import { useEffect, useRef } from "react";
import carImageSrc from "../../site-images/temp-racecar.png";
import roadImageSrc from "../../site-images/Road.png";

function GameCanvas({ activeQuestionIndex, questionsInSet, showWinMessage }) {
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);

  const racecarPosition = useRef(0);
  const targetPosition = useRef(0);
  const carImage = useRef(new Image());
  const travelDistance = 0.75; // Adjust this value to control the distance the car travels each time
  const carSpeed = 0.02; // Adjust this value to control the "speed" of the car (lerp speed)

  const roadPosition = useRef(0);
  const roadImage = useRef(new Image());
  const roadSpeed = 0.5;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Load the car image
    carImage.current.src = carImageSrc;

    // Load the road image
    roadImage.current.src = roadImageSrc;

    // Function to draw the track
    const drawTrack = () => {
      ctx.fillStyle = "gray";
      ctx.fillRect(0, canvas.height / 2 - 50, canvas.width, 100);
      const roadWidth = roadImage.current.naturalWidth;
      const roadHeight = roadImage.current.naturalHeight;
      const aspectRatio = roadWidth / roadHeight;
      const height = 150;
      const width = height * aspectRatio;
      ctx.drawImage(roadImage.current, roadPosition.current, canvas.height / 2 - 5, width, height);
    };

    // Function to draw the racecar
    const drawRacecar = () => {
      const carWidth = carImage.current.naturalWidth;
      const carHeight = carImage.current.naturalHeight;
      const aspectRatio = carWidth / carHeight;
      const height = 100;
      const width = height * aspectRatio;
      ctx.drawImage(carImage.current, racecarPosition.current, canvas.height / 2 - 25, width, height);
    };

    // Function to draw the win message
    const drawWinMessage = () => {
      ctx.fillStyle = "black";
      ctx.font = "48px Arial";
      ctx.fillText("You Win!", canvas.width / 2 - 100, canvas.height / 2);
    };

    // Function to update the canvas
    const updateCanvas = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawTrack();
      drawRacecar();
      if (showWinMessage) {
        drawWinMessage();
      }
    };

    // Linear interpolation function for smooth movement
    const lerp = (start, end, t) => {
      return start * (1 - t) + end * t;
    };

    // Animation function to update the racecar and road position
    const animate = () => {
      const carWidth = carImage.current.naturalWidth;
      // Calculate the target position based on the active question index
      targetPosition.current = (activeQuestionIndex / questionsInSet) * (canvas.width + carWidth * 2) * travelDistance; // Adjust travel distance
      // Smoothly interpolate the racecar position
      racecarPosition.current = lerp(racecarPosition.current, targetPosition.current, carSpeed);

      roadPosition.current = roadPosition.current - roadSpeed;
      if (roadPosition.current <= -600) {
        roadPosition.current = 0;
      }
      updateCanvas();
      animationFrameId.current = requestAnimationFrame(animate);
    };

    // Start the animation once the car image is loaded
    carImage.current.onload = () => {
      animationFrameId.current = requestAnimationFrame(animate);
    };

    // Cleanup function to cancel the animation frame
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [activeQuestionIndex, questionsInSet, showWinMessage]);

  return (
    <canvas
      ref={canvasRef}
      data-testid="GameCanvas"
      id="GameCanvas"
      width="600"
      height="450"
      style={{ backgroundColor: "black" }}
    ></canvas>
  );
}

export default GameCanvas;
