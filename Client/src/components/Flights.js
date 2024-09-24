import axios from "axios";
import "../css/Flights.css";
import { useNavigate } from "react-router-dom";
import { useMainContext } from "../MainContext";
import React, { useEffect, useState } from "react";
import { FormattedDate } from "../Utils/FormattedAdress";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { Loading } from "notiflix/build/notiflix-loading-aio";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
const port = process.env.REACT_APP_API_PORT || 5001;
export default function Flights() {
  //sayfada kullanılacak değişkenler
  const navigate = useNavigate();
  const {
    status,
    flights,
    airlines,
    setStatus,
    myFlights,
    setFlights,
    setAirlines,
    flightRoute,
    currentpage,
    destinations,
    setMyFlights,
    departureDate,
    setCurrentPage,
    setDestinations,
    flightDirection,
    selectedSortOption,
    setSelectedSortOption,
  } = useMainContext();

  
  useEffect(() => {       // flights dizisi 0dan büyük bir dizi haline geldiğinde bu fonksiyonların çalıştırılmasını sağlar
    if (flights.length > 0) {
      fetchAirlines(flights);
      fetchCities(flights);
    }
  }, [flights]);

  useEffect(() => { //sayfa yenilendiğinde 1 kere getMyFlights Fonksiyonunu çağırır
    getMyFlights();
  }, []);

  // sayfada kullanılan fonksiyonlar
  const nextPage = () => {            //eğer varsa bir sonraki sayfadaki uçuşları görmek bir sonraki uçuşlara istek gönderen                   
    nextPageFlights();          //fonksiyonları çağırır
  };
  const previousPage = () => {       //eğer varsa bir Önceki sayfadaki uçuşları görmek bir sonraki uçuşlara istek gönderen       
    if (currentpage !== 0) {      //fonksiyonları çağırır
      setCurrentPage(parseInt(currentpage) - 1);
      previousPageFlights();
    }
  };

  const getMyFlights = async () => {      //dbdeki uçuşları ekrana getiren fonksiyon
    try {
      const response = await axios.get(
        `http://localhost:${port}/api/flights/myFlights`
      );
      setMyFlights(response.data);
      console.log(response.data);
    } catch (e) {
      console.log(e);
    }
  };


  const previousPageFlights = async () => {   //bir önceki sayfaya istek atan fonksiyon
    console.log(currentpage);
    try {
      const response = await axios.get(
        `http://localhost:${port}/api/flights/filterFligth/${flightRoute}/${flightDirection}/${departureDate}/${
          parseInt(currentpage) - 1
        }/${selectedSortOption}`,
        {}
      );
      if (response.status === 200) {
        const flightData = response.data;
        setFlights([flightData]);
        console.log(response.status);
        setStatus(true);
      } else {
        alert("başka uçuş bulunamadı");
      }
    } catch (e) {
      console.log(e);
      setStatus(false);
    }
  };
 
  const nextPageFlights = async () => {       //bir sonraki sayfaya istek atan fonksiyon
    try {
      const nextPage = parseInt(currentpage) + 1;

      const response = await axios.get(
        `http://localhost:${port}/api/flights/filterFligth/${flightRoute}/${flightDirection}/${departureDate}/${nextPage}/${selectedSortOption}`,
        {}
      );
     

      if (response.status === 200) {
        const flightData = response.data;
        setFlights([flightData]);
        console.log(response.status);
        setStatus(true);

        setCurrentPage(nextPage);
      } else {
        alert("başka uçuş bulunamadı");
      }
    } catch (e) {
      console.log(e);
      setStatus(false);
    }
  };

  const fetchCities = async (flights) => {    //ana istekle beraber gelen city codeları kullanarak city 
    const cities = {};                        //  codelarını city namelerle birlikte bir diziye aktaran fonksiyon 

    if (flights && flights.length > 0) {
      for (const flight of flights) {
        if (flight.flights && flight.flights.length > 0) {
          const destCodes = flight.flights.map((f) => f.route.destinations[0]);

          for (const destCode of destCodes) {
            try {
              const response = await axios.get(
                `http://localhost:${port}/api/flights/${destCode}`
              );

              const destinationData = response.data;
              cities[destCode] = destinationData.city;
            } catch (e) {
              console.log(e);
            }
          }
        }
      }
      setDestinations(cities);
      Loading.remove();
    } else {
      console.log("Flights data is either undefined or empty");
    }
  };

  const fetchAirlines = async () => {         //ana istekle beraber gelen airline kodların kullanarak airline 
    const Airlines = {};                       //  codelarını  airline kodlarıyla birlikte bir diziye aktaran fonksiyon 

    if (flights && flights.length > 0) {
      for (const flight of flights) {
        if (flight.flights && flight.flights.length > 0) {
          const airlineCodes = flight.flights.map((a) => a.prefixICAO);

          for (const airlineCode of airlineCodes) {
            try {
              const response = await axios.get(
                `http://localhost:${port}/api/flights/airline/${airlineCode}`
              );

              const airlineData = response.data;
              Airlines[airlineCode] = airlineData.publicName;
            } catch (e) {
              if (e.response && e.response.status === 404) {
                Airlines[airlineCode] = "unknown";
              } else {
                console.log(
                  `Error fetching airline data for code ${airlineCode}: ${e.message}`
                );
              }
            }
          }
        }
      }
      setAirlines(Airlines);
    } else {
      console.log("Flights data is either undefined or empty");
    }
  };


  const handleBookFlightConfirm = (flight, airlineName) => {      // doğrulama fonksiyonu
    Confirm.show(
      "Uçuş Rezervasyon",
      "Rezervasyon işlemini tamamlamak istiyor musun",
      "Evet",
      "Hayır",
      () => {
        handleBookFlight(flight, airlineName);
      },
      () => {},
      {}
    );
  };

  const handleBookFlight = async (flight, airlineName) => {     // seçilen uçuşu dbye kaydeden fonksiyon
    let from, to;
    const direction = flight.flightDirection;
    if (direction === "A") {
      from = flight.route.destinations[0];
      to = "AMS";
    } else {
      to = flight.route.destinations[0];
      from = "AMS";
    }

    console.log("myFlights:", myFlights);
    if (!Array.isArray(myFlights)) {
      console.log("myFlights tanımlı değil veya bir dizi değil.");
      return;
    }
                                                                      
    const isFlightAlreadyBooked = myFlights.some(                 // uçuşa önceden rezervasyon yapılıp yapılmadığını kontrol eder
      (f) => f.flightId === flight.id   
    );
                                                                
    if (isFlightAlreadyBooked) {
      console.log("Bu uçuş zaten eklenmiş.");
      alert("Bu uçuş zaten eklenmiş.");
      return;
    }


    const flightDate = new Date(flight.scheduleDateTime);           //uçuşun tarihinin geçip geçmediğini kontrol eder
    const currentDate = new Date();

    if (flightDate < currentDate) {
      console.log("Uçuş tarihi geçmiş.");
      Notify.failure("Uçuş Tarihi geçmiş");
      return;
    }
    const payload = {
      flightId: flight.id,
      from: from,
      to: to,
      flightTime: flight.scheduleDateTime,
      airline: airlineName,
      detail: flight.flightNumber,
    };

    try {
      const response = await axios.post(
        `http://localhost:${port}/api/flights/`,
        payload
      );
      console.log("payload", payload);
      console.log(response);
    } catch (e) {
      console.log(e);
    }

    Notify.success("Uçuşlarıma Başarıyla Eklendi");
    navigate("/myFlights");
  };


  const formatTime = (flightTime) => {
    if (!flightTime || isNaN(new Date(flightTime).getTime())) {
      return "Bilinmiyor";
    }
    const date = new Date(flightTime);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="FlightsGeneralContainer">
      {flights.length > 0 &&
      flights[0]?.flights?.length > 0 &&        //flights dizisinin gelip gelmediğini kontrol eden koşul
      status === true ? (
        flights[0].flights.map((flight, index) => {
          const destinationCode = flight.route.destinations[0];
          const destinationCity = destinations[destinationCode] || "Bilinmiyor";
          const airlineCode = flight.prefixICAO;
          const airlineName = airlines[airlineCode] || "Bilinmiyor";

          return (
            <div className="flightsContainer" key={index}>
              <div className="flightsLeftContent">
                <div className="flightHeader">
                  <div className="flightHeaderLeft">
                    {flight.flightDirection === "A"
                      ? `${destinationCity} - Amsterdam`
                      : `Amsterdam - ${destinationCity}`}
                  </div>
                  <div className="flightHeaderRight">
                    {FormattedDate(flight.scheduleDate)}
                  </div>
                </div>
                <div className="flightBody">
                  <div className="flightBodyLeft">
                    <span>
                      <i className="fa-solid fa-plane-departure"></i> Departure
                    </span>
                    <span className="time">
                      {formatTime(flight.scheduleDateTime)}
                    </span>
                    <span>
                      {flight.flightDirection === "A"
                        ? `Airport: ${flight.route.destinations[0]}`
                        : `Airport: AMS`}
                    </span>
                  </div>
                  <div className="flightBodyMiddle">
                    <span>{airlineName}</span>
                    <span>
                      <i className="fa-solid fa-plane"></i>
                    </span>
                    <span>{`${flight.flightNumber} No'lu uçuş`}</span>
                  </div>
                  <div className="flightBodyRight">
                    <span>
                      <i className="fa-solid fa-plane-arrival"></i> Arrival
                    </span>
                    <span className="time">Bilinmiyor</span>
                    <span>
                      {flight.flightDirection === "A"
                        ? `Airport: AMS`
                        : `Airport: ${flight.route.destinations[0]}`}
                    </span>
                  </div>
                </div>
                <div className="flighBottom">
                  <div className="bottomLeft">
                    <span className="price">Price: $200</span>
                    <span> One Way</span>
                  </div>
                  <div className="bottomRight">
                    <button
                      onClick={() =>
                        handleBookFlightConfirm(flight, airlineName)
                      }
                    >
                      Uçuş Rezervasyonu
                    </button>
                  </div>
                </div>
              </div>
              <div className="chechkDetails">
                <button> Uçuş Detayları</button>
              </div>
            </div>
          );
        })
      ) : (
        <div className="flightsContainer">Uygun Uçuş Bulunamadı</div>
      )}
      {flights?.length > 0 && flights[0]?.flights?.length > 0 ? (
        <div className="pagination">
          <button className="paginationButton" onClick={previousPage}>
            Previous Page
          </button>
          <button className="paginationButton" onClick={nextPage}>
            Next Page
          </button>
        </div>
      ) : null}
    </div>
  );
}
