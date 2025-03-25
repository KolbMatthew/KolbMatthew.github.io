import { useEffect, useRef, useCallback } from "react";
import carImageSrc from "../../site-images/temp-racecar.png";
import roadImageSrc from "../../site-images/Game/road.png";
import sunImageSrc from "../../site-images/Game/sun.png";
import sunsetImageSrc from "../../site-images/Game/sunset-background.png";
import cloudImageASrc from "../../site-images/Game/clouds-A.png";
import cloudImageBSrc from "../../site-images/Game/clouds-B.png";
import groundImageSrc from "../../site-images/Game/ground.png";
import mountainImageSrc from "../../site-images/Game/mountains.png";
import treeImageASrc from "../../site-images/Game/tree-A.png";
import treeImageBSrc from "../../site-images/Game/tree-B.png";
import treeImageCSrc from "../../site-images/Game/tree-C.png";
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
  const treeImageA = useRef(new Image());
  const treeImageB = useRef(new Image());
  const treeImageC = useRef(new Image());

  // Ref to track if tree images are loaded
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

  // Tree state array
  const treePositions = useRef([]);

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
    treeImageA.current.src = treeImageASrc;
    treeImageB.current.src = treeImageBSrc;
    treeImageC.current.src = treeImageCSrc;
  }, []);

  // Track when tree images have loaded.
  useEffect(() => {
    let loadedCount = 0;
    const handleTreeLoad = () => {
      loadedCount++;
      if (loadedCount === 3) {
        treesAreReady.current = true;
        treePositions.current = [];
      }
    };

    treeImageA.current.onload = handleTreeLoad;
    treeImageB.current.onload = handleTreeLoad;
    treeImageC.current.onload = handleTreeLoad;

    return () => {
      treeImageA.current.onload = null;
      treeImageB.current.onload = null;
      treeImageC.current.onload = null;
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
  const drawScrollingLayer = (
    ctx,
    image,
    positionRef,
    speed,
    y,
    renderedHeight,
    loops,
    deltaTime,
    offsetX = 0
  ) => {
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
    const finalHeight = 50; // fixed height
    const finalWidth = finalHeight * aspectRatio;
    ctx.drawImage(
      carImage.current,
      racecarPositionX.current,
      250,
      finalWidth,
      finalHeight
    );
  };

  // Pre-render a tree image with brightness filter on an offscreen canvas.
  const getPreRenderedTreeImage = (tree) => {
    if (!tree.treeImage.naturalWidth) {
      return tree.treeImage;
    }
    if (tree.renderedImage) return tree.renderedImage;
    const width = tree.treeImage.naturalWidth * tree.size;
    const height = tree.treeImage.naturalHeight * tree.size;
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = width;
    offscreenCanvas.height = height;
    const offCtx = offscreenCanvas.getContext("2d");
    offCtx.filter = `brightness(${tree.brightness})`;
    offCtx.drawImage(tree.treeImage, 0, 0, width, height);
    tree.renderedImage = offscreenCanvas;
    return offscreenCanvas;
  };

  // Draw an array of trees using pre-rendered images.
  const drawTreesArray = (ctx, trees) => {
    trees.forEach((tree) => {
      const renderedImage = getPreRenderedTreeImage(tree);
      const tw = tree.treeImage.naturalWidth * tree.size;
      const th = tree.treeImage.naturalHeight * tree.size;
      ctx.drawImage(renderedImage, tree.x - tw / 2, tree.y - th, tw, th);
    });
  };

  // Spawn trees (only if images are loaded), update their positions, and draw them.
  const updateAndDrawTrees = (ctx, deltaTime) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (treePositions.current.length === 0 && treesAreReady.current) {
      const spacing = 40;
      const count = Math.floor(canvas.width / spacing);
      for (let i = 0; i < count; i++) {
        const x = canvas.width + i * spacing;
        const isTop = Math.random() < 0.5;
        const [minY, maxY] = isTop ? [260, 260] : [350, 350];
        const y = Math.random() * (maxY - minY) + minY;
        const size = Math.random() * (0.18 - 0.09) + 0.09;
        const treeImage = [
          treeImageA.current,
          treeImageB.current,
          treeImageC.current,
        ][Math.floor(Math.random() * 3)];
        const brightness = Math.random() * 0.4 + 0.8;
        treePositions.current.push({ x, y, size, treeImage, brightness, isTop });
      }
    }

    treePositions.current.forEach((tree) => {
      const width = tree.treeImage.naturalWidth * tree.size;
      tree.x -= baseSpeeds.treeSpeed * speedMultiplierRef.current * deltaTime;
      if (tree.x + width < 0) {
        tree.x = canvas.width + Math.random() * 100;
        const isTop = Math.random() < 0.5;
        const [minY, maxY] = isTop ? [260, 260] : [350, 350];
        tree.y = Math.random() * (maxY - minY) + minY;
        tree.size = Math.random() * (0.18 - 0.09) + 0.09;
        tree.treeImage = [
          treeImageA.current,
          treeImageB.current,
          treeImageC.current,
        ][Math.floor(Math.random() * 3)];
        tree.brightness = Math.random() * 0.4 + 0.8;
        tree.isTop = isTop;
        tree.renderedImage = null;
      }
    });

    const treesBehindCar = treePositions.current.filter((t) => t.isTop);
    const treesInFrontOfCar = treePositions.current.filter((t) => !t.isTop);

    drawTreesArray(ctx, treesBehindCar);
    drawRacecar(ctx);
    drawTreesArray(ctx, treesInFrontOfCar);
  };

  // Draw the win overlay.
  const drawWinMessage = (ctx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    ctx.fillStyle = "rgb(113, 34, 5)";
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
    ctx.fillStyle = "rgb(255, 226, 188)";
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
    ctx.strokeStyle = "rgb(255, 91, 37)"; 
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
  
    // Display remaining time in 00:00 format in the center.
    const remainingSeconds = Math.ceil(remainingTime / 1000);
    const minutes = Math.floor(remainingSeconds / 60).toString().padStart(2, '0');
    const seconds = (remainingSeconds % 60).toString().padStart(2, '0');
    ctx.font = "bold 16px Courier New";
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
      // Draw background layers.
      drawScrollingLayer(
        ctx,
        sunsetImage.current,
        sunsetPositionX,
        baseSpeeds.sunsetSpeed,
        0,
        300,
        2,
        deltaTime
      );
      drawScrollingLayer(
        ctx,
        sunImage.current,
        sunPositionX,
        baseSpeeds.sunSpeed,
        0,
        200,
        2,
        deltaTime
      );
      drawScrollingLayer(
        ctx,
        cloudImage.current,
        cloudPositionX,
        baseSpeeds.cloudSpeed,
        15,
        50,
        8,
        deltaTime
      );
      drawScrollingLayer(
        ctx,
        mountainImage1.current,
        mountainPosition1X,
        baseSpeeds.mountainSpeed1,
        30,
        600,
        3,
        deltaTime
      );
      drawScrollingLayer(
        ctx,
        mountainImage2.current,
        mountainPosition2X,
        baseSpeeds.mountainSpeed2,
        30,
        300,
        3,
        deltaTime,
        -100
      );
      drawScrollingLayer(
        ctx,
        mountainImage3.current,
        mountainPosition3X,
        baseSpeeds.mountainSpeed3,
        30,
        400,
        3,
        deltaTime,
        100
      );
      drawScrollingLayer(
        ctx,
        cloudImage2.current,
        cloudPositionX2,
        baseSpeeds.cloudSpeed2,
        50,
        100,
        4,
        deltaTime
      );
      drawScrollingLayer(
        ctx,
        cloudImage3.current,
        cloudPositionX3,
        baseSpeeds.cloudSpeed3,
        75,
        200,
        3,
        deltaTime
      );
      drawScrollingLayer(
        ctx,
        groundImage.current,
        groundPositionX,
        baseSpeeds.groundSpeed,
        -40,
        400,
        2,
        deltaTime
      );
      drawScrollingLayer(
        ctx,
        roadImage.current,
        roadPositionX,
        baseSpeeds.roadSpeed,
        -65,
        400,
        2,
        deltaTime
      );
      // Update and draw trees and racecar.
      updateAndDrawTrees(ctx, deltaTime);
      // Draw prompt overlay.
      drawPrompt(ctx);
      if (showWinMessage) {
        drawWinMessage(ctx);
      }
      // --- Draw Stopwatch ---
      // Position stopwatch in the top-right corner.
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
      treePositions.current = [];
    }
  }, [activeQuestionIndex]);

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
      <div className="options-container">
        {options.map((option, index) => (
          <button
            key={index}
            className="option-button"
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
