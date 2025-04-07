import { useEffect, useRef, useCallback } from "react";
import carImageSrc from "../../site-images/car.png";
import roadImageSrc from "../../site-images/Game/road.png";
import sunImageSrc from "../../site-images/Game/sun.png";
import sunsetImageSrc from "../../site-images/Game/sunset-background.png";
import cloudImageASrc from "../../site-images/Game/clouds-A.png";
import cloudImageBSrc from "../../site-images/Game/clouds-B.png";
import groundImageSrc from "../../site-images/Game/ground.png";
import mountainImageSrc from "../../site-images/Game/mountains.png";
import treeLayerImageSrc from "../../site-images/Game/tree-layer.png"; // Import the new tree layer image
import "./GameCanvas.css";

const scaleFactor = 1.5;
const baseSpeeds = {
  sunSpeed: 0.0,
  sunsetSpeed: 20,
  cloudSpeed: 20,
  cloudSpeed2: 40,
  cloudSpeed3: 80,
  groundSpeed: 50,
  roadSpeed: 60,
  mountainSpeed1: 5,
  mountainSpeed2: 10,
  mountainSpeed3: 15,
  treeSpeed: 60,
};

function GameCanvas({
  activeQuestionIndex,
  questionsInSet,
  showWinMessage,
  isCorrect,
  prompt,
  options,
  handleOptionClick,
  speedMultiplier,
  timeLeft 
}) {
  // Refs and state
  const speedMultiplierRef = useRef(speedMultiplier);
  const timeLeftRef = useRef(timeLeft);

  // Canvas and images
  const canvasRef = useRef(null);
  const carImage = useRef(new Image());
  const sunImage = useRef(new Image());
  const sunsetImage = useRef(new Image());
  const cloudImage = useRef(new Image());
  const cloudImage2 = useRef(new Image());
  const cloudImage3 = useRef(new Image());
  const groundImage = useRef(new Image());
  const roadImage = useRef(new Image());
  const mountainImage1 = useRef(new Image());
  const mountainImage2 = useRef(new Image());
  const mountainImage3 = useRef(new Image());
  const treeLayerImage = useRef(new Image()); 
  const treesAreReady = useRef(false);

  // Positions for elements
  const racecarPositionX = useRef(0);
  const targetPositionX = useRef(0);

  const sunPositionX = useRef(0);
  const sunsetPositionX = useRef(0);
  const cloudPositionX = useRef(0);
  const cloudPositionX2 = useRef(0);
  const cloudPositionX3 = useRef(0);
  const groundPositionX = useRef(0);
  const roadPositionX = useRef(0);
  const mountainPosition1X = useRef(0);
  const mountainPosition2X = useRef(0);
  const mountainPosition3X = useRef(0);
  const treeLayerPositionX = useRef(0); 

  const layers = useRef([
    {
      image: treeLayerImage.current,
      positionRef: useRef(0),
      speed: baseSpeeds.treeSpeed,
      y: 50,
      renderedHeight: 200,
      loops: 3,
      offsetX: 0,
    },
    // Add more layers dynamically if needed
  ]);

  // Pre-create refs for new layers
  const treeLayerRefs = useRef([]); // Array to store refs for dynamically added tree layers

  // Load image resources
  const loadImages = useCallback(() => {
    carImage.current.src = carImageSrc;
    sunImage.current.src = sunImageSrc;
    sunsetImage.current.src = sunsetImageSrc;
    cloudImage.current.src = cloudImageBSrc;
    cloudImage2.current.src = cloudImageASrc;
    cloudImage3.current.src = cloudImageBSrc;
    groundImage.current.src = groundImageSrc;
    roadImage.current.src = roadImageSrc;
    mountainImage1.current.src = mountainImageSrc;
    mountainImage2.current.src = mountainImageSrc;
    mountainImage3.current.src = mountainImageSrc;
    treeLayerImage.current.src = treeLayerImageSrc; 
  }, []);

  // Track when tree layer image has loaded.
  useEffect(() => {
    treeLayerImage.current.onload = () => {
      treesAreReady.current = true;
    };

    return () => {
      treeLayerImage.current.onload = null;
    };
  }, []);

  // Linear interpolation helper.
  const lerp = (start, end, t) => start * (1 - t) + end * t;

  // Update the racecar's X position based on question progress.
  const updateRacecarPosition = useCallback(() => {
    if (!canvasRef.current) return;
    const carWidth = carImage.current.naturalWidth;
    const maxCarTravelX = canvasRef.current.width / scaleFactor + carWidth * 2;
    targetPositionX.current =
      (activeQuestionIndex / questionsInSet) * maxCarTravelX * 0.75;
    racecarPositionX.current = lerp(
      racecarPositionX.current,
      targetPositionX.current,
      0.02
    );
  }, [activeQuestionIndex, questionsInSet]);

  // Draw a scrolling layer (background, clouds, road, etc.)
  const drawScrollingLayer = (ctx, layer, deltaTime) => {
    const { image, positionRef, speed, y, renderedHeight, loops, offsetX } = layer;
    const naturalAspect = image.naturalWidth / image.naturalHeight;
    const renderedWidth = renderedHeight * naturalAspect;
    const posX = positionRef.current;
  
    for (let i = 0; i < loops; i++) {
      ctx.drawImage(
        image,
        posX + i * (renderedWidth - 1) + offsetX,
        y,
        renderedWidth,
        renderedHeight
      );
    }
  
    positionRef.current -= speed * speedMultiplierRef.current * deltaTime;
    if (positionRef.current <= -renderedWidth) {
      positionRef.current += renderedWidth;
    }
  };

  // Draw the racecar.
  const drawRacecar = (ctx) => {
    const carW = carImage.current.naturalWidth;
    const carH = carImage.current.naturalHeight;
    const aspectRatio = carW / carH;
    const finalHeight = 25; // fixed height
    const finalWidth = finalHeight * aspectRatio;
    ctx.drawImage(
      carImage.current,
      racecarPositionX.current,
      265,
      finalWidth,
      finalHeight
    );
  };

  // Draw the win overlay.
  const drawWinMessage = (ctx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    ctx.fillStyle = "rgb(255, 58, 162)";
    ctx.font = `${48 * scaleFactor}px 'Alkaline Regular'`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = 3;
    ctx.strokeText(
      "You Win!",
      (canvas.width / 2) / scaleFactor,
      (canvas.height / 2) / scaleFactor
    );
    ctx.fillText(
      "You Win!",
      (canvas.width / 2) / scaleFactor,
      (canvas.height / 2) / scaleFactor
    );
  };

  // Draw the question prompt box.
  const drawPrompt = (ctx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const boxWidth = 400 * scaleFactor;
    const boxHeight = 100 * scaleFactor;
    const boxX = canvas.width / (2 * scaleFactor) - boxWidth / 2;
    const boxY = 225 * scaleFactor;
    ctx.fillStyle = "rgba(145, 116, 60, 1)";
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
    ctx.fillStyle = "white";
    ctx.font = `${20 * scaleFactor}px Courier New`;
    ctx.textAlign = "center";
    ctx.fillText(prompt, canvas.width / (2 * scaleFactor), 250 * scaleFactor);
  };

  // --- Stopwatch Drawing Function ---
  const drawStopwatch = (ctx, x, y, radius, remainingTime, totalTime) => {
    // Draw clock face.
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = "rgb(255, 91, 37)"; 
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000";
    ctx.stroke();
  
    // Draw stopwatch border with the same style as the canvas border.
    ctx.lineWidth = 20;
    ctx.strokeStyle = "rgb(113, 34, 5)"; 
    ctx.stroke();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "rgb(232, 41, 12)"; 
    ctx.stroke();
    ctx.lineWidth = 10;
    ctx.strokeStyle = "rgb(255, 226, 188)";
    ctx.stroke();
  
    // Calculate fraction elapsed.
    const fraction = 1 - remainingTime / totalTime;
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + fraction * 2 * Math.PI;
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle, false);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "rgb(232, 41, 12)"; 
    ctx.stroke();
  
    // Display remaining time in 0:00 format in the center.
    const remainingSeconds = Math.ceil(remainingTime / 1000);
    const minutes = Math.floor(remainingSeconds / 60).toString();
    const seconds = (remainingSeconds % 60).toString().padStart(2, '0');
    ctx.font = "bold 22px Courier New";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${minutes}:${seconds}`, x, y);
  };

  // Main render routine.
  const renderScene = useCallback(
    (ctx, deltaTime) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(scaleFactor, scaleFactor);

      // Draw all layers
      const backgroundLayers = layers.current.filter(layer => layer.y !== 150);
      const foregroundLayers = layers.current.filter(layer => layer.y === 150);

      backgroundLayers.forEach((layer) => drawScrollingLayer(ctx, layer, deltaTime));
      drawRacecar(ctx);
      foregroundLayers.forEach((layer) => drawScrollingLayer(ctx, layer, deltaTime));

      // Draw prompt overlay
      drawPrompt(ctx);

      if (showWinMessage) {
        drawWinMessage(ctx);
      }

      // Draw stopwatch
      const logicalWidth = canvas.width / scaleFactor; // e.g., 600
      drawStopwatch(ctx, logicalWidth - 70, 390, 40, timeLeftRef.current, 60000);

      ctx.restore();
    },
    [showWinMessage, prompt, speedMultiplier]
  );

  useEffect(() => {
    speedMultiplierRef.current = speedMultiplier;
  }, [speedMultiplier]);

  // Update timeLeftRef whenever timeLeft prop changes.
  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  // Main animation loop.
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    loadImages();
    let lastTime = performance.now();

    const animate = (time) => {
      const deltaTime = (time - lastTime) / 1000;
      lastTime = time;
      updateRacecarPosition();
      renderScene(ctx, deltaTime);
      requestAnimationFrame(animate);
    };

    carImage.current.onload = () => {
      if (canvasRef.current) {
        requestAnimationFrame(animate);
      }
    };

    return () => {
      // Cleanup if needed.
    };
  }, [loadImages, updateRacecarPosition, renderScene, speedMultiplier]);

  // Reset positions when question index changes.
  useEffect(() => {
    if (activeQuestionIndex === 0) {
      racecarPositionX.current = 0;
      targetPositionX.current = 0;
    }
  }, [activeQuestionIndex]);



  const addLayer = (imageRef, speed, y, renderedHeight, loops, offsetX = 0) => {
    const newPositionRef = { current: 0 }; // Create a plain object for positionRef
    layers.current.push({
      image: imageRef.current,
      positionRef: newPositionRef,
      speed,
      y,
      renderedHeight,
      loops,
      offsetX,
    });
  };

  useEffect(() => {
    // Add layers dynamically
    // addlayer(image, speed, y, renderedHeight, loops, offsetX)
    addLayer(sunsetImage, baseSpeeds.sunsetSpeed, 0, 300, 2);
    addLayer(sunImage, baseSpeeds.sunSpeed, 0, 200, 2);
    addLayer(cloudImage, baseSpeeds.cloudSpeed, -20, 350, 3);
    addLayer(mountainImage1, baseSpeeds.mountainSpeed1, 30, 600, 3);
    addLayer(mountainImage2, baseSpeeds.mountainSpeed2, 30, 300, 3, -100);
    addLayer(mountainImage3, baseSpeeds.mountainSpeed3, 30, 400, 3, 100);
    addLayer(cloudImage2, baseSpeeds.cloudSpeed2, 50, 300, 3);
    addLayer(groundImage, baseSpeeds.groundSpeed, -40, 400, 2);
    addLayer(roadImage, baseSpeeds.roadSpeed, -65, 400, 2);
    addLayer(treeLayerImage, baseSpeeds.treeSpeed, 60, 200, 3);
    addLayer(treeLayerImage, baseSpeeds.treeSpeed, 150, 200, 3);
  }, []);

  return (
    <div className="game-container">
      <canvas
        ref={canvasRef}
        data-testid="GameCanvas"
        id="GameCanvas"
        width={600 * scaleFactor}
        height={450 * scaleFactor}
        style={{ backgroundColor: "black" }}
      />
      <div className="game-canvas-option-container">
        {options.map((option, index) => (
          <button
            key={index}
            className="game-canvas-option-button"
            onClick={() => handleOptionClick(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default GameCanvas;
