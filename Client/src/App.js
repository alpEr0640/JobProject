import Navbar from "./components/Navbar";
import Homepage from "./Pages/Homepage";
import MyFlights from "./Pages/MyFlights";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainProvider, useMainContext } from "./MainContext";
const AppContent = () => {
  return (
    <div className="app">
      <Navbar/>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/myFlights" element={<MyFlights />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <MainProvider>
      <BrowserRouter>
      <AppContent />
    </BrowserRouter>
    </MainProvider>
      
  );
}

export default App;
