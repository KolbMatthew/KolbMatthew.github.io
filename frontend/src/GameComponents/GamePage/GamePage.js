import GameCanvas from "../GameCanvas/GameCanvas";
import Option from "../Option/Option";
import { useState, useEffect } from "react";
import "./GamePage.css";

function GamePage() {
  const [showOutput, setOutput] = useState("");
  const [questions, setQuestions] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [questionsInSet, setQuestionsInSet] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState(1);

  // Fetch questions from backend
  useEffect(() => {
    fetch(`http://localhost:8080/game/getProblems?difficulty=${difficulty}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data); 
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [difficulty]);

  // Function to move to next question
  const nextQuestion = () => {
    if (activeQuestionIndex < questions.length - 1) {
      setActiveQuestionIndex(activeQuestionIndex + 1);
    } else {
      setGameOver(true);
    }
  };

  // variables used to display problem and choices
  const activeQuestion = questions[activeQuestionIndex];
  const prompt = activeQuestion?.problemText || "Loading...";
  const options = activeQuestion?.options || [];

  // Log questions when they update
  useEffect(() => {
    console.log(questions);
  }, [questions]);

  // Handle option click
  const handleOptionClick = (value) => {
    if (value === activeQuestion.correctAnswer) {
      setOutput("Correct!");
      setScore(score + 10);
    } else {
      setOutput("Incorrect!");
    }
    nextQuestion();
  };

  // Handle continue button and difficulty selection
  const handleContinue = () => {
    setActiveQuestionIndex(0);
    setScore(0);
    setGameOver(false);
    fetch(`http://localhost:8080/game/getProblems?difficulty=${difficulty}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  // Handle Difficulty selection
  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
  };

  useEffect(() => {
    const canvas = document.getElementById("GameCanvas");
    if (canvas) {
        var c = document.getElementById("GameCanvas");
        var ctx = c.getContext("2d");

        // Create gradient
        var grd = ctx.createLinearGradient(0, 0, 200, 0);
        grd.addColorStop(0, "red");
        grd.addColorStop(1, "white");

        // Fill with gradient
        ctx.fillStyle = grd;
        ctx.fillRect(10, 10, 150, 80);
      } 
  }, []);

  // Once user has answered all questions, display score and continue button
  if (gameOver) {
    return (
      <div>
        <h2>Your score: {score}</h2>
        <button onClick={handleContinue}>Continue</button>
        <div>
          <h3>Change Difficulty:</h3>
          <div>
            <button
              onClick={() => handleDifficultyChange(1)}
              className={difficulty === 1 ? "highlighted" : ""}
            >
              Easy
            </button>
            <button
              onClick={() => handleDifficultyChange(2)}
              className={difficulty === 2 ? "highlighted" : ""}
            >
              Medium
            </button>
            <button
              onClick={() => handleDifficultyChange(3)}
              className={difficulty === 3 ? "highlighted" : ""}
            >
              Hard
            </button>
            <button
              onClick={() => handleDifficultyChange(4)}
              className={difficulty === 4 ? "highlighted" : ""}
            >
              Extreme
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <h2 id="result-output" data-testid="result-output">
        {showOutput}
      </h2>

      <div>
        <GameCanvas />
      </div>

      <div>
        <h2 id="prompt-output" data-testid="prompt-output">
          {prompt}
        </h2>
        <div id="option-container">
          {options.map((option, index) => (
            <Option
              key={index}
              text={option}
              onClick={() => handleOptionClick(option)}
            />
          ))}
        </div>
      </div>

      <div>
        <h2>Score: {score}</h2>
      </div>
    </>

  );
}

export default GamePage;
