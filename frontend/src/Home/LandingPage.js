import React, { useState } from "react";
import "../styles/global.css";
import "../styles/LandingPage.css";
import MRLogo from "../site-images/MRLogo.png";
import ButtonWithSound from "../components/ButtonWithSound";

function LandingPage() {
  const [navigationStack, setNavigationStack] = useState(["default"]); // Include default menu in the stack

  const handleButtonClick = (menu) => {
    setNavigationStack((prevStack) => {
      // Check if the new menu is a main menu
      const isMainMenu = ["default", "playGame", "viewScores", "profileSettings", "logout"].includes(menu);

      if (isMainMenu) {
        // Replace the entire stack with the new main menu
        return ["default", menu];
      } else {
        // Prevent adding the same submenu multiple times
        if (prevStack[prevStack.length - 1] === menu) {
          return prevStack;
        }
        return [...prevStack, menu];
      }
    });
  };

  const handleBackClick = () => {
    setNavigationStack((prevStack) => prevStack.slice(0, -1)); // Pop the last menu from the stack
  };

  const renderMenu = (menu) => {
    switch (menu) {
      case "default":
        return (
          <div className="menu-container">
            <ButtonWithSound className="button" onClick={() => handleButtonClick("playGame")}>
              Play Game
            </ButtonWithSound>
            <ButtonWithSound className="button" onClick={() => handleButtonClick("viewScores")}>
              View Scores
            </ButtonWithSound>
            <ButtonWithSound className="button" onClick={() => handleButtonClick("profileSettings")}>
              Profile/Settings
            </ButtonWithSound>
            <ButtonWithSound className="button" onClick={() => handleButtonClick("logout")}>
              Log Out
            </ButtonWithSound>
          </div>
        );
      case "playGame":
        return (
          <div className="options-container">
            <h2>Game Options</h2>
            <ButtonWithSound className="button" onClick={() => handleButtonClick("startGame")}>
              Start Game
            </ButtonWithSound>
            <ButtonWithSound className="button" onClick={() => handleButtonClick("tutorial")}>
              Tutorial
            </ButtonWithSound>
          </div>
        );
      case "viewScores":
        return (
          <div className="options-container">
            <h2>Scores Options</h2>
            <ButtonWithSound className="button" onClick={() => handleButtonClick("highScores")}>
              View High Scores
            </ButtonWithSound>
            <ButtonWithSound className="button" onClick={() => handleButtonClick("leaderboard")}>
              Leaderboard
            </ButtonWithSound>
          </div>
        );
      case "highScores":
        return (
          <div className="options-container">
            <h2>High Scores</h2>
            <p>Here are the high scores...</p>
            <ButtonWithSound className="button" onClick={handleBackClick}>
              Back
            </ButtonWithSound>
          </div>
        );
      case "leaderboard":
        return (
          <div className="options-container">
            <h2>Leaderboard</h2>
            <p>Here is the leaderboard...</p>
            <ButtonWithSound className="button" onClick={handleBackClick}>
              Back
            </ButtonWithSound>
          </div>
        );
      case "profileSettings":
        return (
          <div className="options-container">
            <h2>Profile Options</h2>
            <ButtonWithSound className="button" onClick={() => handleButtonClick("editProfile")}>
              Edit Profile
            </ButtonWithSound>
            <ButtonWithSound className="button" onClick={() => handleButtonClick("settings")}>
              Settings
            </ButtonWithSound>
          </div>
        );
      case "editProfile":
        return (
          <div className="options-container">
            <h2>Edit Profile</h2>
            <p>Profile editing options...</p>
            <ButtonWithSound className="button" onClick={handleBackClick}>
              Back
            </ButtonWithSound>
          </div>
        );
      case "settings":
        return (
          <div className="options-container">
            <h2>Settings</h2>
            <p>Settings options...</p>
            <ButtonWithSound className="button" onClick={handleBackClick}>
              Back
            </ButtonWithSound>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="landing-page">
      <div className="logo-container">
        <img src={MRLogo} alt="Mind Racers Logo" className="landing-logo" />
      </div>
      <div className="navigation-stack">
        {/* Render all levels of the navigation stack */}
        {navigationStack.map((menu, index) => (
          <div key={index}>{renderMenu(menu)}</div>
        ))}
      </div>
    </div>
  );
}

export default LandingPage;