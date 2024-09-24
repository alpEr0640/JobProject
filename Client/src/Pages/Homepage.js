import "../css/App.css";
import React from "react";
import Cards from "../components/Cards";
import Flights from "../components/Flights";
import FilterFlights from "../components/FilterFlights";
import SortFlights from "../components/SortFlights";

export default function Homepage() {
  return (
    <div className="hompageContainer">
      <div className="hompageContentLeft">
        {/* Anasayfada uçuş filtreleme componenti Çağırılıyor */}
        <FilterFlights />
        <div className="leftFlights">
          {/* Anasayfada Uçuşla ilgili componentler Çağırılıyor */}
          <Flights />
          <SortFlights />
          <></>
        </div>
      </div>
      <div className="hompageContentRight">
        <Cards />
      </div>
    </div>
  );
}
