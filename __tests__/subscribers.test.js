const dns = require("dns");
const path = require("path");
const chai = require("chai");

dns.setServers(["8.8.8.8", "1.1.1.1"]);
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");

require("dotenv").config({ path: path.join(__dirname, "../.env") });

const { expect } = chai;
chai.use(chaiHttp);

const app = require("../src/app");
const Subscriber = require("../src/models/subscribers");
const seedData = require("../src/data");

const MONGO_URI = process.env.MONGO_URI;

describe("Subscriber API", function () {
  this.timeout(60000);

  let subscriberId;

  before(async function () {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is required for tests");
    }

    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 30000 });
    await Subscriber.deleteMany({});
    const inserted = await Subscriber.insertMany(seedData);
    subscriberId = inserted[0]._id.toString();
  });

  after(async function () {
    await mongoose.disconnect();
  });

  describe("GET /subscribers", function () {
    it("returns all subscribers", async function () {
      const res = await chai.request(app).get("/subscribers");

      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
      expect(res.body).to.have.lengthOf(seedData.length);
    });
  });

  describe("GET /subscribers/names", function () {
    it("returns only name and subscribedChannel", async function () {
      const res = await chai.request(app).get("/subscribers/names");

      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
      expect(res.body).to.have.lengthOf(seedData.length);

      res.body.forEach((subscriber) => {
        expect(subscriber).to.have.keys("name", "subscribedChannel");
        expect(subscriber).to.not.have.property("_id");
      });
    });
  });

  describe("GET /subscribers/:id", function () {
    it("returns a subscriber when id is valid", async function () {
      const res = await chai.request(app).get(`/subscribers/${subscriberId}`);

      expect(res).to.have.status(200);
      expect(res.body).to.be.an("object");
      expect(res.body).to.have.property("_id", subscriberId);
      expect(res.body).to.have.property("name");
      expect(res.body).to.have.property("subscribedChannel");
    });

    it("returns 400 when subscriber is not found", async function () {
      const missingId = "507f1f77bcf86cd799439011";
      const res = await chai.request(app).get(`/subscribers/${missingId}`);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property("message", "subscriber  not found");
    });

    it("returns 500 when id format is invalid", async function () {
      const res = await chai.request(app).get("/subscribers/not-a-valid-id");

      expect(res).to.have.status(500);
      expect(res.body).to.have.property("message");
    });
  });
});
