require ("dotenv").config();

const express = require("express");
const cors = require("cors");

const db = require("./db/database");
const routes = require("./routes/auth");
const apikey_routes = require("./routes/apikey_routes");
const countries_routes = require("./routes/countries_routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', routes);
app.use('/api/apikey', apikey_routes);
app.use('/api/country', countries_routes);

app.get("/", (req, res) => {
  res.send("Hello World, API Server is running");
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



