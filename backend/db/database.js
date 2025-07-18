const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "../middleware.db");
console.log("DB file location:", dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Cannot open the database.", err.message);
    }else{
        console.log("Connected to the database.");
    }
});



db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        username TEXT UNIQUE NOT NULL, 
        password TEXT NOT NULL,
        created DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS apikeys (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userid INTEGER NOT NULL,
        apikey TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        revoked INTEGER DEFAULT 0, 
        created DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_used DATETIME,
        count INTEGER DEFAULT 0,
        FOREIGN KEY(userid) REFERENCES users(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS apikeys_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        apikeyid INTEGER NOT NULL, 
        accessed DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(apikeyid) REFERENCES apikeys(id)
    )`)
});

module.exports = db;