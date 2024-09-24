import axios from "axios";
import "../css/FilterFlights.css";
import { useMainContext } from "../MainContext";
import React, { useEffect, useState } from "react";
import { Loading } from "notiflix/build/notiflix-loading-aio";

const port = process.env.REACT_APP_API_PORT || 5001;

export default function FilterFlights() {
  //sayfada kullanılacak değişkenler
  const [selectedTrip, setSelectedTrip] = useState("oneWay");
  const {
    setStatus,
    setFlights,
    flightRoute,
    departureDate,
    setFlightRoute,
    flightDirection,
    setFilterControl,
    setDepartureDate,
    setFlightDirection,
    selectedSortOption,
  } = useMainContext();

  //sayfada kullanılan fonksiyonlar

  const validateDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;

    if (!regex.test(dateString)) return false;

    const date = new Date(dateString);
    const time = date.getTime();

    return time && dateString === date.toISOString().split("T")[0];
  };
//uçuşları zaman yön ve varış noktasına göre filtreleyen fonksiyon
  const filterFlights = async () => {
    Loading.standard();

    try {
      const response = await axios.get(
        `http://localhost:${port}/api/flights/filterFligth/${flightRoute.toUpperCase()}/${flightDirection}/${departureDate}/0/${selectedSortOption}`,
        {}
      );
      const flightData = response.data;
      setFlights([flightData]);
      console.log(response);
      setFilterControl(true);
      setStatus(true);
    } catch (e) {
      console.log(e);
      Loading.remove();
    }
  };

  //girilen tarihin geçerli bir tarih olup olmadığını kontrol eden fonksiyon
  const handleFilterFlights = () => {
    if (!validateDate(departureDate)) {
      alert("Lütfen geçerli bir tarih girin (YYYY-MM-DD formatında)");
      return;
    }

    filterFlights();
  };

  return (
    <div className="filterFlightsContainer">
      <div className="filterFlightsContentHeader">
        <div className="filterFlightsHeaderLeft">
          <i className="fa-solid fa-plane"></i> <span> Book Your Flight</span>
        </div>
        <div className="filterFlightsHeaderRight">
          <button
            id="roundTrip"
            className={selectedTrip === "roundTrip" ? "tripActive" : ""}
            disabled
            onClick={() => setSelectedTrip("roundTrip")}
          >
            Gidiş-Geliş
          </button>
          <button
            className={selectedTrip === "oneWay" ? "tripActive" : ""}
            onClick={() => setSelectedTrip("oneWay")}
            id="oneWay"
          >
            Tek Yön
          </button>
        </div>
      </div>

      {selectedTrip === "roundTrip" ? null : (  //gidiş geliş mi yoksa sadece gidiş miyi kontrol eden koşul
        <div className="filterFlightsContentBody">
          <div className="leftInputs">
            <div className="from">
              {flightDirection === "A" ? (
                <i className="fa-solid fa-plane-departure"></i>
              ) : (
                <i class="fa-solid fa-plane-arrival"></i>
              )}
              <input
                type="text"
                placeholder="(Örnek: OSL)"
                onBlur={(e) => setFlightRoute(e.target.value)}
              />
            </div>
            <div className="to">
              <select
                onChange={(e) => {
                  setFlightDirection(e.target.value);
                  console.log(e.target.value);
                }}
              >
                <option value={"A"}>Arriving to Amsterdam</option>
                <option value={"D"}>Departure from Amsterdam</option>
              </select>
            </div>
          </div>

          <div className="rightInputs">
            <div className="startDate">
              <i className="fa-regular fa-calendar"></i>
              <input
                placeholder="Gidiş(YYYY-MM-DD)"
                onChange={(e) => setDepartureDate(e.target.value)}
              />
            </div>
            <div className="endDate">
              <i className="fa-regular fa-calendar"></i>
              <input disabled />
            </div>
          </div>
        </div>
      )}

      <div className="filterFlightsContentButton">
        <button
          onClick={() => {
            handleFilterFlights();
          }}
        >
          Uçuşları Göster
        </button>
      </div>
    </div>
  );
}
