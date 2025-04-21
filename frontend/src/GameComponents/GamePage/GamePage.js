import GameCanvas from "../GameCanvas/GameCanvas";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import useSound from 'use-sound';
import clickSound from '../../sounds/click-sound.mp3';
import "../../styles/global.css";
import "../../styles/GamePage.css";

function GamePage() {
  const [questions, setQuestions] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [questionsInSet] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60000);
  const [showWinMessage, setShowWinMessage] = useState(false); 
  const [isCorrect, setIsCorrect] = useState(null);
  const [speedMultiplier, setSpeedMultiplier] = useState(1); // Default speed multiplier
  const userID = localStorage.getItem("userID");
  const navigate = useNavigate();
  const location = useLocation();
  const difficulty = location.state?.difficulty || 1; // Default to 1 if not provided
  const [playClickSound] = useSound(clickSound);

  console.log("Difficulty received:", difficulty);

  // Fetch questions from backend
  useEffect(() => {
    console.log(`Starting game with difficulty: ${difficulty}`);
    fetch(`http://localhost:8080/game/getProblems?difficulty=${difficulty}&count=10`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched questions:", data);
        setQuestions(data);
        setActiveQuestionIndex(0); // Reset active question index
      })
      .catch((err) => console.error("Error fetching questions:", err));
  }, [difficulty]);

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      setGameOver(true);
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 10);
    }, 10);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  // Function to move to next question
  const nextQuestion = () => {
    if (activeQuestionIndex < questions.length - 1) {
      setActiveQuestionIndex(activeQuestionIndex + 1);
    } else {
      const additionalPoints = Math.floor(timeLeft / 1000); // 1 point per second left
      setScore((prevScore) => prevScore + additionalPoints);
      setShowWinMessage(true); // Show win message
      setTimeout(() => {
        setGameOver(true);
      }, 3000); // 3-second delay before setting game over
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
    playClickSound(); // Play sound
    if (value === activeQuestion.correctAnswer) {
      setScore(score + 10);
      setIsCorrect(true);
      nextQuestion();
    } else {
      setIsCorrect(false);
      setScore(score - 10);
      setSpeedMultiplier((prev) => Math.max(prev - 0.2, 0.5)); // Reduce speed multiplier, minimum 0.5
    }
  };

  // Simulate getting the answer wrong (debug button)
  const simulateWrongAnswer = () => {
    setIsCorrect(false);
    setScore((prevScore) => prevScore - 10);
    setSpeedMultiplier((prev) => Math.max(prev - 0.2, 0.5)); // Reduce speed multiplier, minimum 0.5
  };

  // Save score when the game is over
  const saveScore = async () => {
    const gameDate = new Date().toISOString();

    try {
      const response = await fetch('http://localhost:8080/scores/save-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          score: score.toString(),
          userID: userID.toString(),
          gameDate: gameDate,
        }),
      });

      if (response.ok) {
        console.log('Score saved successfully!');
      } else {
        console.error('Failed to save score.');
      }
    } catch (error) {
      console.error('Error while saving score:', error);
    }
  };

  useEffect(() => {
    if (gameOver) {
      saveScore();
      setTimeout(() => {
        navigate("/game-over", { state: { score } });
      }, 3000); // 3-second delay before redirecting
    }
  }, [gameOver]);

  // Check if questions are loaded before rendering GameCanvas
  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="prompt-output">
      <GameCanvas
        activeQuestionIndex={activeQuestionIndex}
        questionsInSet={questionsInSet}
        showWinMessage={showWinMessage}
        isCorrect={isCorrect}
        prompt={prompt}
        options={options}
        handleOptionClick={handleOptionClick}
        speedMultiplier={speedMultiplier}
        timeLeft={timeLeft}
      />
      {/* Debug Buttons */}
      <div className="debug-buttons-container">
        <button className="button" onClick={nextQuestion}>
          Simulate Right Answer
        </button>
        <button className="button" onClick={simulateWrongAnswer}>
          Simulate Wrong Answer
        </button>
        <button className="button" onClick={() => setGameOver(true)}>
          End Game
        </button>
        <button className="button" onClick={() => navigate("/landing")}>
          Return to Home
        </button>
      </div>
    </div>
  );
}

export default GamePage;
