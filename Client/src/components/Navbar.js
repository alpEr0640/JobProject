import React from "react";
import "../css/Navbar.css";
import logo from "../images/images.png";
import resim from "../images/deneme4.jpeg";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const goMyFlights = () => {
    console.log("Navigating to My Flights");
    navigate("/myFlights");
  };
  const goHomepage = ()=>{
    navigate("/");
  }
  const navBarContent = () => {
    return (
      <nav className="navBar">
        <div className="navBarLeftContent" onClick={()=>goHomepage() }>
          <img className="navBarImage" src={logo} alt="Logo" />
          <p> PLANE SCAPE</p>
        </div>
        <div className="navBarRightContent">
          <ul>
            <li onClick={()=> goHomepage()}>
              {" "}
              <i className="fa-solid fa-house"></i> <span>Anasayfa</span>{" "}
            </li>
            <li>
              {" "}
              <i className="fa-solid fa-globe"></i>
              <span>Discover</span>{" "}
            </li>
            <li onClick={()=> goMyFlights()}>
              {" "}
              <img src={resim}></img>
              <span>Alper Sonat</span>{" "}
            </li>
          </ul>
        </div>
      </nav>
    );
  };
  return navBarContent();
}
