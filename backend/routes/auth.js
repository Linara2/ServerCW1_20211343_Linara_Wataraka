const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/database");

router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            [username, hashedPassword],
            function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE')){
                        return res.status(409).json({ message: "Username already exists." });
                    }
                    return res.status(500).json({ message: "Database issue." });
                }
                res.status(201).json({ message: "User registered successfully" , userId: this.lastID});
            }
        );
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
});

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.get (`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
        if (err) {
            return res.status(500).json({ message: "Database issue." });
        }
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials." });

        }
        
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ message: "Invalid credentials." });
        }
        const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, userId: user.id });
    });
});

module.exports = router;