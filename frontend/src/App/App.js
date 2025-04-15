import React from "react";
import Home from "../Home/Home.js";
import GamePage from "../GameComponents/GamePage/GamePage.js";
import LandingPage from "../Home/LandingPage.js";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </div>
  );
}

export default App;
