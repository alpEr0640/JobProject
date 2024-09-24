require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios")
const mongoose = require("mongoose");
const port = process.env.PORT || 5001;
const flight = require("./Routes/Flights");

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use("/api/flights", flight);
const link = "mongodb+srv://Alper:alper12389@project.6fxfb.mongodb.net/";
mongoose
  .connect(`${link}`)
  .then(() => {
    console.log("mongodb bağlantısı kuruldu");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(port, () => {
  console.log(`server ${port} portunda çalışıyor`);
});
