import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/style.css"; 
import MRLogo from "../site-images/MRLogo.png"; 

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="logo-container">
        <img src={MRLogo} alt="Mind Racers Logo" className="landing-logo" />
      </div>
      <div className="menu-container">
        <button className="button" onClick={() => navigate("/game")}>
          Play Game
        </button>
        <button className="button" onClick={() => navigate("/profile")}>
          Profile/Settings
        </button>
        <button className="button" onClick={() => navigate("/")}>
          Log Out
        </button>
      </div>
    </div>
  );
}

export default LandingPage;