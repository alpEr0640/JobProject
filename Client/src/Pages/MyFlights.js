import axios from "axios";
import "../css/MyFlights.css";
import THY from "../images/THY.png";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMainContext } from "../MainContext";
import { myFlightDate } from "../Utils/FormattedAdress";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { Loading } from "notiflix/build/notiflix-loading-aio";

const port = process.env.REACT_APP_API_PORT || 5001;

export default function MyFlights() {
  const { myFlights, setMyFlights } = useMainContext();

  const navigate = useNavigate();
  useEffect(() => {
    getMyFlights();
  }, []);

  /* dbdeki uçuşları çeken fonksiyon */
  const getMyFlights = async () => {
    try {
      const response = await axios.get(
        `http://localhost:${port}/api/flights/myFlights`
      );
      setMyFlights(response.data);
      console.log(response.data);
      if (response.data.length === 0) {
        Loading.remove();
      }
    } catch (e) {
      Loading.remove();
      console.log(e);
    }
  };

  /* rezerve yapılmış uçuşu dbden kaldıran fonksiyon */
  const handleDelete = async (flights) => {
    try {
      const response = await axios.delete(
        `http://localhost:${port}/api/flights/${flights.flightId}`
      );
      setMyFlights(myFlights.filter((flight) => flight.flightId !== flights));
      Notify.failure("Uçuşunuz İptal Edildi");
      console.log("Flight deleted successfully");
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };
  /* uçuşlarım sayfasındaki uçağın kalkış saatini düzenleyen fonksiyon */
  const formatTime = (flightTime) => {
    console.log(flightTime);
    console.log(flightTime);
    if (!flightTime || isNaN(new Date(flightTime).getTime())) {
      return "unknown";
    }
    const date = new Date(flightTime);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
/* sayfa içeriği */
  return (
    <div className="myFlightsContainer">
      {myFlights && myFlights.length > 0 //eğer dbde kayıtlı uçuş yoksa uçuşunuz bulunmamaktadır döndürüp
        ? (Loading.remove(),             // varsa olan uçuşları ekrana yazdıran koşul
          myFlights.map((flight, index) => (
            <div className="myFlightsContent" key={index}>
              <div className="myFlightsLeft">
                <img src={THY} alt="THY"></img>
              </div>

              <div className="myFlightsMiddle">
                <div className="myFlightsHeader">
                  <span>{formatTime(flight.flightTime)}</span>
                  <span> {myFlightDate(flight.flightTime)} </span>
                </div>
                <div className="myFlightsBody">
                  <div className="myFlightsBodyLeft">
                    {flight.airline ? flight.airline : "Unknown"}
                  </div>{" "}
                  <div className="myFlightsBodyMiddle">
                    <span>
                      {" "}
                      <i className="fa-solid fa-plane"></i>
                    </span>
                    <span> {flight.detail} No'lu Uçuş</span>{" "}
                  </div>
                  <div className="myFlightsBodyRight">
                    {flight.from} - {flight.to}
                  </div>{" "}
                </div>
              </div>
              <div className="myFlightsRight">
                <div className="checkIn">
                  <span> Koltuk Seçimi  </span>
                  <span>
                    {flight.checkinStatus ? "Yapıldı" : "Yapılmadı"}
                  </span>{" "}
                </div>
                <div className="checkInButton">
                  {" "}
                  <button onClick={() => handleDelete(flight)}>
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          )))
        : (Loading.standard(),    //verileri getirirken ekrana gösterilen loading
          (
            <div className="myFlightsContainer">
              {" "}
              
                Rezerve Uçuşunuz Bulunmamaktadır
            </div>
          ))}
    </div>
  );
}
