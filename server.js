///////////////////////////////
// DEPENDENCIES
////////////////////////////////
// get .env variables
require("dotenv").config();
// pull PORT from .env, give default value of 3000
// pull MONGODB_URL from .env
const { PORT = 3000, MONGODB_URL } = process.env;
// import express
const express = require("express");
// create application object
const app = express();
// import mongoose
const mongoose = require("mongoose");
// import middlware
const cors = require("cors");
const morgan = require("morgan");

///////////////////////////////
// DATABASE CONNECTION
////////////////////////////////
// Establish Connection
mongoose.connect(MONGODB_URL);
// Connection Events
mongoose.connection
  .on("open", () => console.log("Your are connected to mongoose"))
  .on("close", () => console.log("Your are disconnected from mongoose"))
  .on("error", (error) => console.log(error));

///////////////////////////////
// MODELS
////////////////////////////////
const CheeseSchema = new mongoose.Schema({
    name:
     {type:String,
    required:true,
    unique:true},
    countryOfOrigin: String,
    image: String,
});

const Cheese = mongoose.model("Cheese", CheeseSchema);

///////////////////////////////
// MiddleWare
////////////////////////////////
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies

///////////////////////////////
// ROUTES
////////////////////////////////
// create a test route
app.get("/", (req, res) => {
  res.send("I like cheese");
});

// PEOPLE INDEX ROUTE
app.get("/cheese", async (req, res) => {
  try {
    // get all people
    res.json(await Cheese.find({}));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

app.get("/cheese/:id", async(req,res)=>{
    try{
        res.json(await Cheese.findById(req.params.id))
    }catch(error){
        res.status(400).json(error)
    }
})


// PEOPLE CREATE ROUTE
app.post("/cheese", async (req, res) => {
  try {
    // send all people
    res.json(await Cheese.create(req.body));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

// PEOPLE UPDATE ROUTE
app.put("/cheese/:id", async (req, res) => {
  try {
    // update people by ID
    res.json(
      await Cheese.findByIdAndUpdate(req.params.id, req.body)
    );
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

// PEOPLE DELETE ROUTE
app.delete("/cheese/:id", async (req, res) => {
  try {
    // delete people by ID
    res.json(await Cheese.findByIdAndRemove(req.params.id));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

///////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));