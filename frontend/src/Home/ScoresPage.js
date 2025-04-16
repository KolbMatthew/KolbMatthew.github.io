import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "../styles/global.css";
import "../styles/ScoresPage.css";

function ScoresPage() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalScore, setTotalScore] = useState(0);
  const userID = localStorage.getItem("userID");
  const navigate = useNavigate(); 

  useEffect(() => {
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
  }, [userID]);

  if (loading) {
    return <div className="scores-page">Loading...</div>;
  }

  return (
    <div className="scores-page">
      <h1>User Scores</h1>
      <div className="total-score-container border-style">
        <h2>Total Score: {totalScore}</h2>
      </div>
      {scores.length === 0 ? (
        <p>No scores available.</p>
      ) : (
        <div className="table-wrapper border-style">
          <table className="scores-table">
            <thead>
              <tr>
                <th>Score</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, index) => (
                <tr key={index}>
                  <td>{score.score}</td>
                  <td>{new Date(score.time).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="bottom-left-container">
        <button className="button" onClick={() => navigate("/landing")}>
          Return to Home Page
        </button>
      </div>
    </div>
  );
}

export default ScoresPage;