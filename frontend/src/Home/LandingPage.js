import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";
import "../styles/LandingPage.css";
import MRLogo from "../site-images/MRLogo.png";
import ButtonWithSound from "../components/ButtonWithSound";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="logo-container">
        <img src={MRLogo} alt="Mind Racers Logo" className="landing-logo" />
      </div>
      <div className="menu-container">
        <ButtonWithSound className="button" onClick={() => navigate("/game")}>
          Play Game
        </ButtonWithSound>
        <ButtonWithSound className="button" onClick={() => navigate("/scores")}>
          View Scores
        </ButtonWithSound>
        <ButtonWithSound className="button" onClick={() => navigate("/profile")}>
          Profile/Settings
        </ButtonWithSound>
        <ButtonWithSound className="button" onClick={() => navigate("/")}>
          Log Out
        </ButtonWithSound>
      </div>
    </div>
  );
}

export default LandingPage;
