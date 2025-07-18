const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const db = require("../db/database");
const fs = require("fs");
const path = require("path");

const router = express.Router();

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ message: "Unauthorized" }); 

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Invalid format" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = user;
        next();
    });
}

//Generate API key with a name//

router.post("/save", authenticateToken, async (req, res) => {
    const {apikey, name} = req.body;
    const userId = req.user.userId;

    if (!apikey) return res.status(400).json({ message: "API key is required." });
    if (!name) return res.status(400).json({ message: "Name is required." });

db.run(
    "INSERT INTO apikeys (userid, apikey, name) VALUES (?, ?, ?)",
    [userId, apikey, name],
    function (err) {
        if (err) {
            console.error("Database error while saving API key:", err);
            return res.status(500).json({ message: "API key saving failed." });
        }

        //Save the generated API key to a text file//

        const apikeySave = '${new Date().toISOString()} | ${name} | ${apikey}\n';
        fs.appendFile("saveapikeys.txt", apikeySave, (err) => {
            if (err) console.error("API key saving failed:", err.message);
        });
        res.status(201).json({message: "API key saved successfully"});
    }
);
});

//Generating an API key//

router.post("/generate", authenticateToken, async (req, res) => {
    const apikey = crypto.randomBytes(32).toString("hex");
    res.json({apikey});
});

router.get("/keylist", authenticateToken, (req, res) => {
    const userId = req.user.userId;

    db.all(
        "SELECT apikey, name, revoked, created, last_used, count FROM apikeys WHERE userid = ?",
        [userId],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ message: "API key listing failed." });
            }

        const formattedRows = rows.map((key) => ({
            ...key,
            status: key.revoked ? "Inactive" : "Active"
        }));

        res.json({ keys: formattedRows });
    }
    );
});

//Revoking an API Key//

router.post("/update", authenticateToken, (req, res) => {
    const {apikey} = req.body;
    const userId = req.user.userId;
    
    db.run(
        "UPDATE apikeys SET revoked = 1 WHERE apikey = ? AND userid = ?",
        [apikey, userId],
        function (err) {
            if (err) 
                return res.status(500).json({ message: "API key update failed." });
            if (this.changes === 0) {
                return res.status(404).json({ message: "API key not found." });
        }
        res.json({message: "API key updated successfully"});
    }
    );
});

//Update API key name//

router.post("/rename", authenticateToken, (req, res) => {
    const {apikey, name} = req.body;
    const userId = req.user.userId;

    if (!apikey) return res.status(400).json({ message: "API key is required." });
    if (!name) return res.status(400).json({ message: "Name is required." });
    
    db.run(
        "UPDATE apikeys SET name = ? WHERE apikey = ? AND userid = ?",
        [name, apikey, userId],
        function (err) {
            if (err) 
                return res.status(500).json({ message: "API key update failed." });
            if (this.changes === 0) {
                return res.status(404).json({ message: "API key not found." });
        }
        res.json({message: "API key updated successfully"});
    }
    );
});

//  Delete API Key//

router.post("/delete", authenticateToken, (req, res) => {
    const {apikey} = req.body;
    const userId = req.user.userId;

    db.run(
        "DELETE FROM apikeys WHERE apikey = ? AND userid = ?",
        [apikey, userId],
        function (err) {
            if (err) 
                return res.status(500).json({ message: "API key deletion failed." });
            if (this.changes === 0) {
                return res.status(404).json({ message: "API key not found." });
        }
        res.json({message: "API key deleted successfully"});
    }
    );
});

module.exports = router;