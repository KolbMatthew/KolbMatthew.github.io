import React, { useEffect, useState } from "react";
import "../styles/global.css";
import "../styles/ScoresPage.css";

function ScoresPage() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    // Fetch scores from the backend
    fetch("http://localhost:8080/scores/user/1") // Replace `1` with the dynamic user ID
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
  }, []);

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
    </div>
  );
}

export default ScoresPage;