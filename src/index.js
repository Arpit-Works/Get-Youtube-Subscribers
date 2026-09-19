const dns = require("dns");
const path = require("path");
const express = require("express");

dns.setServers(["8.8.8.8", "1.1.1.1"]);
const app = require("./app.js");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config({ path: path.join(__dirname, "../.env") });

const port = process.env.PORT || 3000;

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//Enable CORS for all routes
app.use(cors());
// Connect to DATABASE
const DATABASE_URL = process.env.MONGO_URI;
if (!DATABASE_URL) {
  console.error("MONGO_URI is missing. Add it to Get-Youtube-Subscribers/.env");
  process.exit(1);
}
mongoose.connect(DATABASE_URL);
const db = mongoose.connection;
db.on("error", (err) => console.log(err));
db.once("open", () => console.log("connected to database"));

// Start Server
app.listen(port, () => console.log(`App listening on port ${port}!`));
