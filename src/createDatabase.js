const dns = require("dns");
const path = require("path");
const mongoose = require("mongoose");

// Windows/router DNS often refuses SRV lookups that Atlas mongodb+srv needs
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const subscriberModel = require("./models/subscribers");
const data = require("./data");

require("dotenv").config({ path: path.join(__dirname, "../.env") });

const DATABASE_URL = process.env.MONGO_URI;

const refreshAll = async () => {
  if (!DATABASE_URL) {
    console.error(
      "MONGO_URI is missing. Add it to Get-Youtube-Subscribers/.env",
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(DATABASE_URL, {
      serverSelectionTimeoutMS: 30000,
    });
    console.log("Connected to database");

    await subscriberModel.deleteMany({});
    await subscriberModel.insertMany(data);
    console.log("Database seeded successfully");
  } catch (err) {
    console.error("Database error:", err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

refreshAll();
