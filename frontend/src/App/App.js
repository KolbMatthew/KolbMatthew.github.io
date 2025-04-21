import React, { useEffect, useState } from "react";
import Home from "../Home/Home.js";
import GamePage from "../GameComponents/GamePage/GamePage.js";
import LandingPage from "../Home/LandingPage.js";
import ScoresPage from "../Home/ScoresPage.js";
import ProfilePage from "../Home/ProfilePage.js";
import { Routes, Route, useLocation } from "react-router-dom";
import MusicPlayer from "../components/MusicPlayer";

function App() {
  const location = useLocation(); // Get the current route
  const [musicSrc, setMusicSrc] = useState("/sounds/MenuMusic.mp3"); 

  useEffect(() => {
    // Change music based on the current route
    if (location.pathname === "/game") {
      setMusicSrc("/sounds/GameplayMusic.mp3");
    } else {
      setMusicSrc("/sounds/MenuMusic.mp3");
    }
  }, [location]);

  return (
    <div className="App">
      {/* Global Music Player */}
      <MusicPlayer src={musicSrc} play={true} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/scores" element={<ScoresPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  );
}

export default App;
