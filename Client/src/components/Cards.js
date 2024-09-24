import React from "react";
import "../css/Cards.css";
export default function Cards() {
  return (
    <div className="cardContainer">
      <div className="CardBodyFirst">
        <div className="cardBodyContent">
          {" "}
          <i class="fa-solid fa-car"></i>
          <span>Car Rentals </span>
        </div>
      </div>
      <div className="CardBodySecond">
        <div className="cardBodyContent">
          {" "}
          <i class="fa-solid fa-hotel"></i>
          <span>Hotels </span>
        </div>
      </div>
      <div className="CardBodyThird">
        <div className="cardBodyContent">
          {" "}
          <i class="fa-solid fa-umbrella-beach"></i>
          <span>Travel Packages </span>
        </div>
      </div>
    </div>
  );
}
