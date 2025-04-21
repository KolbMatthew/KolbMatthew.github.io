import GameCanvas from "../GameCanvas/GameCanvas";
import Option from "../Option/Option";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
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
  const [difficulty, setDifficulty] = useState(null);
  const [showDifficultySelection, setShowDifficultySelection] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60000);
  const [showWinMessage, setShowWinMessage] = useState(false); 
  const [isCorrect, setIsCorrect] = useState(null);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const userID = localStorage.getItem("userID");
  const navigate = useNavigate();
  const [playClickSound] = useSound(clickSound);

  // Fetch questions from backend
  useEffect(() => {
    console.log(`Fetching ${questionsInSet} questions with difficulty ${difficulty}`);
    fetch(`http://localhost:8080/game/getProblems?difficulty=${difficulty}&count=${questionsInSet}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched questions:", data);
        setQuestions(data);
        setActiveQuestionIndex(0); // Reset active question index
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [difficulty, questionsInSet]);

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
    }
  };

  // Handle continue button and difficulty selection
  const handleContinue = () => {
    playClickSound(); // Play sound
    setActiveQuestionIndex(0);
    setScore(0);
    setGameOver(false);
    setShowWinMessage(false);
    setTimeLeft(60000);
    setSpeedMultiplier(1); // Reset speed multiplier
    fetch(`http://localhost:8080/game/getProblems?difficulty=${difficulty}&count=${questionsInSet}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data);
        setActiveQuestionIndex(0);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  // Handle Difficulty selection
  const handleDifficultyChange = (newDifficulty) => {
    playClickSound(); // Play sound
    setDifficulty(newDifficulty);
    setActiveQuestionIndex(0); // Reset active question index
    setShowDifficultySelection(false);
  };

  const formatTime = (time) => {
    const seconds = Math.floor(time / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    return `${seconds}.${milliseconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (isCorrect === null) return;

    if (isCorrect) {
      // Increase speed
      setSpeedMultiplier((prev) => {
        const newMultiplier = prev + 0.05;
        console.log(`Speed multiplier increased to ${newMultiplier} (correct).`);
        return newMultiplier;
      });
    } else {
      // Decrease speed
      setSpeedMultiplier((prev) => {
        const newMultiplier = Math.max(0.5, prev - 1);
        console.log(`Speed multiplier decreased to ${newMultiplier} (incorrect).`);
        return newMultiplier;
      });
    }
    setIsCorrect(null);
  }, [isCorrect]);


  // Debug functions
  const handleDebugCorrect = () => {
    playClickSound(); // Play sound
    handleOptionClick(activeQuestion.correctAnswer);
  };

  const handleDebugIncorrect = () => {
    playClickSound(); // Play sound
    const incorrectOption = options.find(option => option !== activeQuestion.correctAnswer);
    handleOptionClick(incorrectOption);
  };

  // saveScore function
  const saveScore = async () => {
    const gameDate = new Date().toISOString();

    try {
      const response = await fetch('http://localhost:8080/scores/save-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          score: score.toString(), // Convert score to a string
          userID: userID.toString(), // Convert userID to a string
          gameDate: gameDate, // Use ISO string format for date
        }),
      });

      if (response.ok) {
        console.log('Score saved successfully!');
      } else {
        console.error('Failed to save score:');
      }
    } catch (error) {
      console.error('Error while saving score:', error);
    }
  };

  // Call saveScore when gameOver is true
  useEffect(() => {
    if (gameOver) {
      saveScore();
    }
  }, [gameOver]);

  if (showDifficultySelection) {
    return (
      <div>
        <h2>Select Difficulty:</h2>
        <div className="difficulty-buttons-container">
          <button
            onClick={() => handleDifficultyChange(1)}
            className={`button ${difficulty === 1 ? "highlighted" : ""}`}
          >
            Easy
          </button>
          <button
            onClick={() => handleDifficultyChange(2)}
            className={`button ${difficulty === 2 ? "highlighted" : ""}`}
          >
            Medium
          </button>
          <button
            onClick={() => handleDifficultyChange(3)}
            className={`button ${difficulty === 3 ? "highlighted" : ""}`}
          >
            Hard
          </button>
        </div>
        <div className="bottom-left-container">
          <button
            className="button"
            onClick={() => {
              playClickSound(); // Play sound
              navigate("/landing");
            }}
          >
            Return to Home Page
          </button>
        </div>
      </div>
    );
  }

  // Once user has answered all questions, display score and continue button
  if (gameOver) {
    return (
      <div>
        <h2>Your score: {score}</h2>
        <button
          className="button"
          onClick={() => {
            playClickSound(); // Play sound
            handleContinue();
          }}
        >
          Continue
        </button>
        <div>
          <h2>Change Difficulty:</h2>
          <div className="difficulty-buttons-container">
            <button
              onClick={() => handleDifficultyChange(1)}
              className={`button ${difficulty === 1 ? "highlighted" : ""}`}
            >
              Easy
            </button>
            <button
              onClick={() => handleDifficultyChange(2)}
              className={`button ${difficulty === 2 ? "highlighted" : ""}`}
            >
              Medium
            </button>
            <button
              onClick={() => handleDifficultyChange(3)}
              className={`button ${difficulty === 3 ? "highlighted" : ""}`}
            >
              Hard
            </button>
          </div>
        </div>
        <div className="bottom-left-container">
          <button
            className="button"
            onClick={() => {
              playClickSound(); // Play sound
              navigate("/landing");
            }}
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

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
      <div className="debug-buttons-container">
        <button
          className="button"
          onClick={() => {
            playClickSound(); // Play sound
            handleDebugCorrect();
          }}
        >
          Get Correct Answer
        </button>
        <button
          className="button"
          onClick={() => {
            playClickSound(); // Play sound
            handleDebugIncorrect();
          }}
        >
          Get Incorrect Answer
        </button>
      </div>
      <div className="bottom-left-container">
        <button
          className="button"
          onClick={() => {
            playClickSound(); // Play sound
            navigate("/landing");
          }}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}

export default GamePage;
