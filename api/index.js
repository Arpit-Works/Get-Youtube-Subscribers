const dns = require("dns");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config({ path: path.join(__dirname, "../.env") });

const app = require("../src/app");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const DATABASE_URL = process.env.MONGO_URI;
if (DATABASE_URL && mongoose.connection.readyState === 0) {
  mongoose.connect(DATABASE_URL);
}

module.exports = app;
