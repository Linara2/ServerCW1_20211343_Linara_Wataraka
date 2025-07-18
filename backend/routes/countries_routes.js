const express = require("express");
const router = express.Router();
const axios = require("axios");
const db = require("../db/database");

//Validating the API key//

async function apiKeyValidation(req, res, next) {
    const apikey = req.header("x-api-key");
    if (!apikey){
        return res.status(400).json({ message: "API key is required." });
    }

db.get(`SELECT * FROM apikeys WHERE apikey = ? AND revoked = 0`, [apikey], (err, key) => {
    if (err) {
        return res.status(500).json({ message: "Database issue." });
    }
    if (!key) {
        return res.status(403).json({ message: "Invalid credentials." });
    }

    db.run("INSERT INTO apikeys_history (apikeyid) VALUES (?)" , [key.id], (err) => {
        if (err) {
            console.error("Usage of API keys failed to log:", err.message);
        }
    });

    db.run(`UPDATE apikeys SET count = IFNULL(count, 0) + 1, last_used = CURRENT_TIMESTAMP WHERE id = ?`, [key.id], (err) => {
        if (err) {
            console.error("Usage of API keys failed to log:", err.message);
        }
    });

    req.saveApiKey = key;
    next();
});
}

//Get all country details//

router.get("/all", apiKeyValidation, async (req, res) => {
    try{
        const response = await axios.get("https://restcountries.com/v3.1/all?fields=name,capital,languages,currencies,flags");
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching all countries:", error.message);
        res.status(500).json({ message: "Internal server issue.", error: error.message });
    }
});

//Get country details by name//

router.get("/name/:name", apiKeyValidation, async (req, res) => {
    const name = req.params.name;
    try{
        const response = await axios.get(`https://restcountries.com/v3.1/name/${name}`);
        const data = response.data[0];
        res.json({
            name: data.name.common,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server issue." });
    }
});

//Get country details by full name//

router.get("/fullName/:name", apiKeyValidation, async (req, res) => {
    const name = req.params.name;
    try{
        const response = await axios.get(`https://restcountries.com/v3.1/name/${name}?fullText=true`);
        const data = response.data[0];
        res.json({
            name: data.name.common,
            capital: data.capital,
            languages: data.languages,
            currencies: data.currencies,
            flag: data.flags.png
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server issue." });
    }
});


//Get country details by currency//

router.get("/currency/:currency", apiKeyValidation, async (req, res) => {
    const currency = req.params.currency;
    try{
        const response = await axios.get(`https://restcountries.com/v3.1/currency/${currency}`);
        const data = response.data[0];
        res.json({
            currencies: data.currencies,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server issue." });
    }
});

//Get country details by language//

router.get("/language/:language", apiKeyValidation, async (req, res) => {
    const language = req.params.language;
    try{
        const response = await axios.get(`https://restcountries.com/v3.1/lang/${language}`);
        const data = response.data[0];
        res.json({
            languages: data.languages,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server issue." });
    }
});

//Get country details by capital city//

router.get("/capital/:capital", apiKeyValidation, async (req, res) => {
    const capital = req.params.capital;
    try{
        const response = await axios.get(`https://restcountries.com/v3.1/capital/${capital}`);
        res.json({
            capital: response.data[0].capital,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server issue." });
    }
});


//TO views API key usage for ADMINS//

router.get("/history/:apikey", (req, res) => {
    const  apikey  = req.params.apikey;
    db.get(`SELECT id FROM apikeys WHERE apikey = ?`, [apikey], (err, key) => {
        if (err) {
            return res.status(500).json({ message: "Internal server issue." });
        }
        if (!key) {
            return res.status(404).json({ message: "API key not found." });
        }
        db.all(`SELECT * FROM apikeys_history WHERE apikeyid = ?`, [key.id], (err2, rows) => {
            if (err2) {
                return res.status(500).json({ message: "Internal server issue." });
            }
            res.json({history:rows});
        });
    });
});

module.exports = router;