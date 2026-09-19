const dns = require("dns");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

dns.setServers(["8.8.8.8", "1.1.1.1"]);
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const DATABASE_URL = process.env.MONGO_URI;
if (DATABASE_URL && mongoose.connection.readyState === 0) {
  mongoose.connect(DATABASE_URL);
  const db = mongoose.connection;
  db.on("error", (err) => console.log(err));
  db.once("open", () => console.log("connected to database"));
}

const Subscribers = require("./models/subscribers");

app.get("/subscribers", async (req, res) => {
  try {
    const subscribers = await Subscribers.find({});
    res.status(200).json(subscribers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/subscribers/names", async (req, res) => {
  try {
    const subscribers = await Subscribers.find(
      {},
      { name: 1, subscribedChannel: 1, _id: 0 }
    );
    res.status(200).json(subscribers);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.get("/subscribers/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const subscribers = await Subscribers.findById(id);
    if (!subscribers) {
      return res.status(400).json({ message: "subscriber  not found" });
    }
    res.status(200).json(subscribers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = app;
