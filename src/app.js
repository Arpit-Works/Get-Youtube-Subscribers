
const express = require('express');
const app = express()

// Your code goes here

// Import Subscribers model form subscribers.js
const Subscribers = require('./models/subscribers')

//Get all Subscriber's Details
app.get('/subscribers', async (req, res) => {
  try {
    //Retrieve all Subscriber's from the database
    const subscribers = await Subscribers.find({});
    // Send a JSON response with list of Subscriber
    res.status(200).json(subscribers);
  } catch (error) {
    // Handle error that occur during process
    res.status(500).json({ message: error.message });
  }
});

//Get Subscriber,s name and Subscribed Channel
app.get('/subscribers/names', async (req, res) => {
  try {
    //Restreive  Subscriber's name and subscribedChannel  from database
    const subscribers = await Subscribers.find({},{ name: 1, subscribedChannel: 1, _id: 0 });
    //Send a JSON response  with the filetered response of subscribers
    res.status(200).json(subscribers);
  }
  catch (error) {
     // Handle error that occur during process
    res.status(500).json(error)
  }
});


// Get Subscriber's by ID
app.get('/subscribers/:id', async (req, res) => {
  try {
    // Extract the id from Request Parameters 
    let id = req.params.id;
    //Retrieve Subscriber  by Id from  the database
    let subscribers = await Subscribers.findById(id);
    //Check  if the subscriber with given id exists
    if (!subscribers){
      // Send a JSON response 
      return res.status(400).json({message: "subscriber  not found"})
    }
    //Send a JSON response  with the details  of subscribers
    res.status(200).json(subscribers)
  }
  catch (error) {
     // Handle error that occur during process
    res.status(500).json({ message: error.message })
  }
});












module.exports = app;
