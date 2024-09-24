import React, { useState } from "react";
import axios from "axios";
import "../css/SortFlights.css";
import { useMainContext } from "../MainContext";
import { Notify } from "notiflix/build/notiflix-notify-aio";

const port = process.env.REACT_APP_API_PORT || 5001;
export default function SortFlights() {
  //sayfada kullanılan değişkenler
  const {
    flights,
    setFlights,
    flightRoute,
    departureDate,
    flightDirection,
    setFilterControl,
    selectedSortOption,
    setSelectedSortOption,
  } = useMainContext();

  const handleSort = async () => {        //sıralama şekline göre istek gönderen fonksiyon
    try {
      const response = await axios.get(
        `http://localhost:${port}/api/flights/filterFligth/${flightRoute}/${flightDirection}/${departureDate}/0/${selectedSortOption}`,
        {}
      );
      const flightData = response.data;
      setFlights([flightData]);
      console.log(response);
      setFilterControl(true);
      Notify.success(`Sıralandı` );
    } catch (e) {
      console.log(e);
    }
  };

  const handleOptionChange = (event) => {
    setSelectedSortOption(event.target.value);
  };

  return (
    <div className="SortFlightsGeneralContainer">
      {flights?.length > 0 && flights[0]?.flights?.length > 0 ? (
        <>
          <div className="SortBody">
            <div className="sortBodyTop">
              <span>Sıralama:</span>
            </div>
            <div className="sortBodyBottom">
              <label>
                <input
                  className="radioButtons"
                  type="radio"
                  name="flightSort"
                  value="%2BscheduleDateTime"
                  checked={selectedSortOption === "%2BscheduleDateTime"}
                  onChange={handleOptionChange}
                />{" "}
                Tarihe göre(Önce En Yakın)
              </label>
              <label>
                <input
                  className="radioButtons"
                  type="radio"
                  name="flightSort"
                  value="-scheduleDateTime"
                  checked={selectedSortOption === "-scheduleDateTime"}
                  onChange={handleOptionChange}
                />{" "}
                Tarihe göre(Önce En Uzak)
              </label>
              <label>
                <input
                  className="radioButtons"
                  type="radio"
                  name="flightSort"
                  value="%2BexpectedTimeGateOpen"
                  checked={selectedSortOption === "%2BexpectedTimeGateOpen"}
                  onChange={handleOptionChange}
                />{" "}
                Kapı Açılış Tarihi
              </label>
              <label>
                <input
                  className="radioButtons"
                  type="radio"
                  name="flightSort"
                  value="%2BexpectedTimeGateClosing"
                  checked={selectedSortOption === "%2BexpectedTimeGateClosing"}
                  onChange={handleOptionChange}
                />{" "}
                Kapı Kapanış Tarihi
              </label>
              <label>
                <input
                  className="radioButtons"
                  type="radio"
                  name="flightSort"
                  value="%2BlastUpdatedAt"
                  checked={selectedSortOption === "%2BlastUpdatedAt"}
                  onChange={handleOptionChange}
                />{" "}
                Son Güncellenme
              </label>
            </div>
          </div>
          <div className="sortButton">
            <button onClick={handleSort}>Sırala</button>
          </div>
        </>
      ) : null}
    </div>
  );
}
