import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";
import "../styles/LandingPage.css";
import "../styles/ScoresPage.css"; // Import styles for scores
import MRLogo from "../site-images/MRLogo.png";
import ButtonWithSound from "../components/ButtonWithSound";

const parentMap = {
  default: null,
  playGame: "default",
  viewScores: "default",
  profileSettings: "default",
  logout: "default",
  startGame: "playGame",
  tutorial: "playGame",
  highScores: "viewScores",
  leaderboard: "viewScores",
  editProfile: "profileSettings",
  settings: "profileSettings",
  easy: "startGame",
  medium: "startGame",
  hard: "startGame",
  changeUsername: "editProfile",
  changeEmail: "editProfile",
  changePassword: "editProfile",
};

function LandingPage() {
  const [navigationStack, setNavigationStack] = useState(["default"]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalScore, setTotalScore] = useState(0);
  const [showAllScores, setShowAllScores] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [activeForm, setActiveForm] = useState(null); // Track which form is active
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const userID = localStorage.getItem("userID");

  const handleButtonClick = (menu) => {
    const difficultyMap = {
      easy: 1,
      medium: 2,
      hard: 3,
    };

    if (["easy", "medium", "hard"].includes(menu)) {
      // Map difficulty to numeric value and navigate to GamePage
      const numericDifficulty = difficultyMap[menu];
      navigate("/game", { state: { difficulty: numericDifficulty } });
      return;
    }

    if (menu === "logout") {
      // Clear user session data and navigate to the login page
      localStorage.removeItem("userID");
      navigate("../");
      return;
    }

    setNavigationStack((prev) => {
      if (menu === "default") return ["default"];
      const parent = parentMap[menu] ?? "default";
      const parentIndex = prev.indexOf(parent);
      if (parentIndex === -1) return ["default", menu];
      return [...prev.slice(0, parentIndex + 1), menu];
    });

    // Fetch scores when navigating to "highScores"
    if (menu === "highScores") {
      fetch(`http://localhost:8080/scores/user/${userID}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch scores");
          }
          return response.json();
        })
        .then((data) => {
          setScores(data);
          setLoading(false);

          // Calculate total score
          const total = data.reduce((sum, game) => sum + game.score, 0);
          setTotalScore(total);
        })
        .catch((error) => {
          console.error("Error fetching scores:", error);
          setLoading(false);
        });
    }

    // Fetch leaderboard when navigating to "leaderboard"
    if (menu === "leaderboard") {
      fetch("http://localhost:8080/scores/leaderboard")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch leaderboard");
          }
          return response.json();
        })
        .then((data) => {
          setLeaderboard(data);
          setLoadingLeaderboard(false);
        })
        .catch((error) => {
          console.error("Error fetching leaderboard:", error);
          setLoadingLeaderboard(false);
        });
    }
  };

  const handleBackClick = () =>
    setNavigationStack((prev) => prev.slice(0, -1));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateInput = () => {
    if (activeForm === "username" && (!formData.username || formData.username.trim().length < 3)) {
      setMessage("Username must be at least 3 characters long.");
      return false;
    }

    if (
      activeForm === "email" &&
      (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
    ) {
      setMessage("Please enter a valid email address.");
      return false;
    }

    if (activeForm === "password") {
      if (!formData.password || formData.password.length < 6) {
        setMessage("Password must be at least 6 characters long.");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setMessage("Passwords do not match!");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInput()) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/auth/update-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          userID: userID,
          username: activeForm === "username" ? formData.username : undefined,
          email: activeForm === "email" ? formData.email : undefined,
          password: activeForm === "password" ? formData.password : undefined,
        }),
      });

      if (response.ok) {
        setMessage("Profile updated successfully!");
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setActiveForm(null);
      } else {
        const errorText = await response.text();
        setMessage(`Error: ${errorText}`);
      }
    } catch (error) {
      setMessage("An error occurred while updating your profile.");
    }
  };

  const renderMenu = (menu) => {
    switch (menu) {
      case "default":
        return (
          <div key="default" className="menu-container">
            <ButtonWithSound onClick={() => handleButtonClick("playGame")}>
              Play Game
            </ButtonWithSound>
            <ButtonWithSound onClick={() => handleButtonClick("viewScores")}>
              View Scores
            </ButtonWithSound>
            <ButtonWithSound onClick={() => handleButtonClick("profileSettings")}>
              Profile/Settings
            </ButtonWithSound>
            <ButtonWithSound onClick={() => handleButtonClick("logout")}>
              Log Out
            </ButtonWithSound>
          </div>
        );
      case "playGame":
        return (
          <div key="playGame" className="options-container border-style">
            <h2>Game Options</h2>
            <ButtonWithSound onClick={() => handleButtonClick("startGame")}>
              Start Game
            </ButtonWithSound>
          </div>
        );
      case "startGame":
        return (
          <div key="startGame" className="options-container border-style">
            <h2>Select Difficulty</h2>
            <ButtonWithSound onClick={() => handleButtonClick("easy")}>
              Easy
            </ButtonWithSound>
            <ButtonWithSound onClick={() => handleButtonClick("medium")}>
              Medium
            </ButtonWithSound>
            <ButtonWithSound onClick={() => handleButtonClick("hard")}>
              Hard
            </ButtonWithSound>
          </div>
        );
      case "easy":
      case "medium":
      case "hard":
        return (
          <div key={menu} className="options-container border-style">
            <h2>{menu.charAt(0).toUpperCase() + menu.slice(1)} Difficulty</h2>
            <p>Starting the game with {menu} difficulty...</p>
            <ButtonWithSound onClick={handleBackClick}>Back</ButtonWithSound>
          </div>
        );
      case "viewScores":
        return (
          <div key="viewScores" className="options-container border-style">
            <h2>Score Options</h2>
            <ButtonWithSound onClick={() => handleButtonClick("highScores")}>
              Previous Games
            </ButtonWithSound>
            <ButtonWithSound onClick={() => handleButtonClick("leaderboard")}>
              Leaderboard
            </ButtonWithSound>
          </div>
        );
      case "highScores":
        const displayedScores = showAllScores ? scores : scores.slice(-5);

        return (
          <div key="highScores" className="options-container border-style wide-container">
            <h2>High Scores</h2>
            {loading ? (
              <p>Loading...</p>
            ) : scores.length === 0 ? (
              <p>No scores available.</p>
            ) : (
              <>
                {/* Total Score Section */}
                <div className="total-score-container border-style">
                  <h3>Total Score: {totalScore}</h3>
                </div>

                {/* Scores Table */}
                <div className="table-wrapper border-style">
                  <table className="scores-table">
                    <thead>
                      <tr>
                        <th>Score</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedScores.map((score, index) => (
                        <tr key={index}>
                          <td>{score.score}</td>
                          <td>{new Date(score.time).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            {scores.length > 5 && (
              <ButtonWithSound onClick={() => setShowAllScores((prev) => !prev)}>
                {showAllScores ? "Show Less" : "Show More"}
              </ButtonWithSound>
            )}
          </div>
        );
      case "leaderboard":
        return (
          <div key="leaderboard" className="options-container border-style wide-container">
            <h2>Leaderboard</h2>
            {loadingLeaderboard ? (
              <p>Loading...</p>
            ) : leaderboard.length === 0 ? (
              <p>No leaderboard data available.</p>
            ) : (
              <div className="table-wrapper border-style">
                <table className="scores-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Username</th>
                      <th>Total Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((user, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{user.username}</td>
                        <td>{user.totalScore}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      case "profileSettings":
        return (
          <div className="options-container border-style">
            <h2>Profile Options</h2>
            <ButtonWithSound onClick={() => handleButtonClick("editProfile")}>
              Edit Profile
            </ButtonWithSound>
            <ButtonWithSound onClick={() => handleButtonClick("settings")}>
              Settings
            </ButtonWithSound>
          </div>
        );
      case "editProfile":
        return (
          <div key="editProfile" className="options-container border-style">
            <h2>Edit Profile</h2>
            <div className="profile-menu">
              <ButtonWithSound onClick={() => handleButtonClick("changeUsername")}>
                Change Username
              </ButtonWithSound>
              <ButtonWithSound onClick={() => handleButtonClick("changeEmail")}>
                Change Email
              </ButtonWithSound>
              <ButtonWithSound onClick={() => handleButtonClick("changePassword")}>
                Change Password
              </ButtonWithSound>
            </div>
          </div>
        );
      case "changeUsername":
        return (
          <div key="changeUsername" className="options-container border-style">
            <h2>Change Username</h2>
            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="field-wrap">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter new username"
                />
              </div>
              <ButtonWithSound type="submit" className="button button-block">
                Update Username
              </ButtonWithSound>
            </form>
            {message && <p className="message">{message}</p>}
          </div>
        );
      case "changeEmail":
        return (
          <div key="changeEmail" className="options-container border-style">
            <h2>Change Email</h2>
            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="field-wrap">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter new email"
                />
              </div>
              <ButtonWithSound type="submit" className="button button-block">
                Update Email
              </ButtonWithSound>
            </form>
            {message && <p className="message">{message}</p>}
          </div>
        );
      case "changePassword":
        return (
          <div key="changePassword" className="options-container border-style">
            <h2>Change Password</h2>
            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="field-wrap">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter new password"
                />
              </div>
              <div className="field-wrap">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm new password"
                />
              </div>
              <ButtonWithSound type="submit" className="button button-block">
                Update Password
              </ButtonWithSound>
            </form>
            {message && <p className="message">{message}</p>}
          </div>
        );
      case "settings":
        return (
          <div className="options-container border-style">
            <h2>Settings</h2>
            <p>Settings options…</p>
          </div>
        );
      case "tutorial":
        return (
          <div className="options-container border-style">
            <h2>Tutorial</h2>
            <p>Here's how to play…</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="landing-page">
      <div className="logo-container">
        <img
          src={MRLogo}
          alt="Mind Racers Logo"
          className="landing-logo"
          onClick={() => handleButtonClick("default")}
        />
      </div>
      <div className="navigation-stack">
        {navigationStack.map((menu, idx) => (
          <div key={idx}>{renderMenu(menu)}</div>
        ))}
      </div>
    </div>
  );
}

export default LandingPage;
