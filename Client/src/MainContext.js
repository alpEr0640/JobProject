import React, { createContext, useContext, useEffect, useState } from "react";

const MainContext = createContext(null);

export const MainProvider = ({ children }) => {
  const [flights, setFlights] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [flightRoute, setFlightRoute] = useState("");
  const [flightDirection, setFlightDirection] = useState("A");
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureDate, setDepartureDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [currentpage, setCurrentPage] = useState("0");
  const [filterControl, setFilterControl] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState(
    "%2BscheduleDateTime"
  );
  const [myFlights, setMyFlights] = useState();
  const [status, setStatus] = useState(false);
  return (
    <MainContext.Provider
      value={{
        setAirlines,
        airlines,
        setFlights,
        flights,
        destinations,
        setDestinations,
        flightRoute,
        setFlightRoute,
        flightDirection,
        setFlightDirection,
        arrivalDate,
        setArrivalDate,
        departureDate,
        setDepartureDate,
        currentpage,
        setCurrentPage,
        filterControl,
        setFilterControl,
        selectedSortOption,
        setSelectedSortOption,
        myFlights,
        setMyFlights,
        status,
        setStatus,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

export const useMainContext = () => useContext(MainContext);
