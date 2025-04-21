import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/GameOverPage.css";

function GameOverPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const finalScore = location.state?.score || 0; // Default to 0 if no score is passed
  const [showDifficultyOptions, setShowDifficultyOptions] = useState(false);

  // Map string difficulty to numeric values
  const difficultyMap = {
    easy: 1,
    medium: 2,
    hard: 3,
  };

  const currentDifficulty = difficultyMap[location.state?.difficulty] || 1; // Default to 1 if no difficulty is passed

  const handleDifficultyChange = (difficulty) => {
    navigate("/game", { state: { difficulty } });
  };

  return (
    <div className="game-over-page">
      <h1>Game Over</h1>
      <h2>Your Final Score: {finalScore}</h2>
      <div className="game-over-buttons">
        <button className="button" onClick={() => navigate("/landing")}>
          Return to Home
        </button>
        <button
          className="button"
          onClick={() => setShowDifficultyOptions((prev) => !prev)}
        >
          Change Difficulty
        </button>
        <button
          className="button"
          onClick={() =>
            navigate("/game", { state: { difficulty: currentDifficulty } })
          }
        >
          Continue Playing
        </button>
      </div>
      {showDifficultyOptions && (
        <div className="difficulty-options">
          <button
            className="button"
            onClick={() => handleDifficultyChange(1)}
          >
            Easy
          </button>
          <button
            className="button"
            onClick={() => handleDifficultyChange(2)}
          >
            Medium
          </button>
          <button
            className="button"
            onClick={() => handleDifficultyChange(3)}
          >
            Hard
          </button>
        </div>
      )}
    </div>
  );
}

export default GameOverPage;