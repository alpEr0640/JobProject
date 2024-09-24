const mongoose = require("mongoose")
const joi = require("joi");

const myFlightsSchema = mongoose.Schema({
    flightId: String,
    from: String,
    to: String,
    flightTime: String,
    airline:String,
    detail: String,
    landingTime:Date
})

const Fligts =mongoose.model("myFlights", myFlightsSchema);
module.exports= Fligts;