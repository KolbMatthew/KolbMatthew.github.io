import GameCanvas from "../GameCanvas/GameCanvas";
import Option from "../Option/Option";
import { useState, useEffect } from "react";
import "./GamePage.css";

function GamePage() {
  const [showOutput, setOutput] = useState("Select an answer to get started!");
  const [questions, setQuestions] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [questionsInSet] = useState(7);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState(1);
  const [showDifficultySelection, setShowDifficultySelection] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60000);
  const [showWinMessage, setShowWinMessage] = useState(false); 
  const [isCorrect, setIsCorrect] = useState(null);

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
      // Calculate additional points based on remaining time
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
    if (value === activeQuestion.correctAnswer) {
      setOutput("Correct!");
      setScore(score + 10);
      setIsCorrect(true);
      nextQuestion();
    } else {
      setOutput("Incorrect!");
      setIsCorrect(false);
      setScore(score - 10);
    setIsCorrect(true);
    }
  };

  // Handle continue button and difficulty selection
  const handleContinue = () => {
    setActiveQuestionIndex(0);
    setScore(0);
    setGameOver(false);
    setShowWinMessage(false); // Reset win message
    setTimeLeft(60000);
    fetch(`http://localhost:8080/game/getProblems?difficulty=${difficulty}&count=${questionsInSet}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data);
        setActiveQuestionIndex(0); // Reset active question index
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  // Handle Difficulty selection
  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
    setActiveQuestionIndex(0); // Reset active question index
    setShowDifficultySelection(false);
  };

  const formatTime = (time) => {
    const seconds = Math.floor(time / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    return `${seconds}.${milliseconds.toString().padStart(2, '0')}`;
  };

  // Debug functions
  const handleDebugCorrect = () => {
    handleOptionClick(activeQuestion.correctAnswer);
  };

  const handleDebugIncorrect = () => {
    const incorrectOption = options.find(option => option !== activeQuestion.correctAnswer);
    handleOptionClick(incorrectOption);
  };

  if (showDifficultySelection) {
    return (
      <div>
        <h3>Select Difficulty:</h3>
        <div>
          <button onClick={() => handleDifficultyChange(1)}>Easy</button>
          <button onClick={() => handleDifficultyChange(2)}>Medium</button>
          <button onClick={() => handleDifficultyChange(3)}>Hard</button>
          <button onClick={() => handleDifficultyChange(4)}>Extreme</button>
        </div>
      </div>
    );
  }

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

  // Check if questions are loaded before rendering GameCanvas
  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="prompt-output">
      <GameCanvas
        activeQuestionIndex={activeQuestionIndex}
        questionsInSet={questionsInSet}
        showWinMessage={showWinMessage} // Pass showWinMessage to GameCanvas
        isCorrect={isCorrect}
        prompt={prompt}
        options={options}
        handleOptionClick={handleOptionClick}
      />

      <div className="question-container">
        <h2 id="result-output" data-testid="result-output">
          {showOutput}
        </h2>

        <div>
          <h2 id="result-output" data-testid="result-output">
            Score: {score}
          </h2>
        </div>

        <button onClick={handleInstantCorrect}>Get Correct Answer</button>
      </div>

      <div>
        <h2>Score: {score}</h2>
      </div>

      <div>
        <h2>Time Left: {formatTime(timeLeft)} seconds</h2>
      </div>

      {/* Debug buttons */}
      <div>
        <button onClick={handleDebugCorrect}>Get Correct Answer</button>
        <button onClick={handleDebugIncorrect}>Get Incorrect Answer</button>
      </div>
    </>
  );
}

export default GamePage;