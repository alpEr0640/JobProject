require('dotenv').config();
const express = require("express");
const router = express.Router();
const Flight = require("../Models/myFlights");
const axios = require("axios");
const APPID= process.env.APPID
const APPKEY = process.env.APPKEY
//!databaseye uçuşları listeleme
router.get("/myFLights", async (req, res) => {
  try {
    const election = await Flight.find();
    res.send(election).status(200);
  } catch (err) {
    console.log("Hata:", err.message);
    res.status(500).send("bir hata oluştu: " + err.message);
  }
});
//!databaseye uçuşu ekleme
router.post("/", async (req, res) => {
  console.log("Gelen veri:", req.body);
  try {
    const newFlightRes = new Flight({
      flightId: req.body.flightId,
      from: req.body.from,
      to: req.body.to,
      flightTime: req.body.flightTime,
      airline: req.body.airline,
      detail: req.body.detail,
      landingTime: req.body.landingTime
    });
    await newFlightRes.save();

    console.log("Kullanıcı kaydedildi");
    res.status(201).send("Rezervasyon başarıyla oluşturuldu.");
  } catch (err) {
    console.log("Hata:", err.message);
    res.status(500).send("Bir hata oluştu: " + err.message);
  }
});

//! uçuşu silme
router.delete("/:flightCode", async (req, res) => {
  const flightCode = req.params.flightCode;
  try {
    
    const deletedFlight = await Flight.findOneAndDelete({ flightId: flightCode });

    if (!deletedFlight) {
      return res.status(404).json({ message: "Flight not found" });
    }
    res.status(200).send("kullanıcı Başarıyla Silindi");
  } catch (err) {
    console.error("Error deleting flight:", err.message);
    res
      .status(500)
      .json({ message: "Error deleting flight", error: err.message });
  }
});

//!filter Flights endpoint
router.get("/filterFligth/:city/:route/:date/:page/:sort", async (req, res) => {
  const sort = req.params.sort;
  const city = req.params.city;
  const route = req.params.route;
  const date = req.params.date;
  const page = req.params.page;
  
  try {
    const response = await axios.get(
      `https://api.schiphol.nl/public-flights/flights?scheduleDate=${date}&flightDirection=${route}&route=${city}&includedelays=false&page=${page}&sort=${sort}`,
      {
        headers: {
          app_id: APPID,
          app_key: APPKEY,
          Accept: "application/json",
          ResourceVersion: "v4",
        },
      }
    );
    if (response.status === 204) {
      res.status(204).send();
    } if(response.status===200) {
      res.send(response.data);
    }
    console.log(response.status)
  } catch (e) {
    res.status(500).send();
  }
});


//! get Airline Code endpoint
router.get("/airline/:airlineCode", async (req, res) => {
  const code = req.params.airlineCode;
  try {
    const response = await axios.get(
      `https://api.schiphol.nl/public-flights/airlines/${code}
`,
      {
        headers: {
          app_id: APPID,
          app_key: APPKEY,
          Accept: "application/json",
          ResourceVersion: "v4",
        },
      }
    );
    res.send(response.data);
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return res.status(404).send({ message: "Airline not found" });
    }
    console.error(err.response ? err.response.data : err.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
});
//! get city name endpoint
router.get("/:code", async (req, res) => {
  const code = req.params.code;
  try {
    const response = await axios.get(
      `https://api.schiphol.nl/public-flights/destinations/${code}`,
      {
        headers: {
          app_id: APPID,
          app_key: APPKEY,
          Accept: "application/json",
          ResourceVersion: "v4",
        },
      }
    );
    res.send(response.data);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
    res.status(500).send();
  }
});

module.exports = router;
