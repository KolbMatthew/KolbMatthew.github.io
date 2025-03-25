import { useEffect, useRef, useState, useCallback } from "react";
import carImageSrc from "../../site-images/temp-racecar.png";
import roadImageSrc from "../../site-images/Game/road.png";
import sunImageSrc from "../../site-images/Game/sun.png";
import sunsetImageSrc from "../../site-images/Game/sunset-background.png";
import cloudImageASrc from "../../site-images/Game/clouds-A.png";
import cloudImageBSrc from "../../site-images/Game/clouds-B.png";
import groundImageSrc from "../../site-images/Game/ground.png";
import mountainImageSrc from "../../site-images/Game/mountains.png";
import treeImageSrc from "../../site-images/Game/tree.png";
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

function GameCanvas({ activeQuestionIndex, questionsInSet, showWinMessage, isCorrect, prompt, options, handleOptionClick }) {
  const canvasRef = useRef(null);
  const racecarPosition = useRef(0);
  const targetPosition = useRef(0);
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
  const treeImage = useRef(new Image());
  const sunPosition = useRef(0);
  const sunsetPosition = useRef(0);
  const cloudPosition = useRef(0);
  const cloudPosition2 = useRef(0);
  const cloudPosition3 = useRef(0);
  const groundPosition = useRef(0);
  const roadPosition = useRef(0);
  const mountainPosition1 = useRef(0);
  const mountainPosition2 = useRef(0);
  const mountainPosition3 = useRef(0);
  const treePositions = useRef([]);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

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
    treeImage.current.src = treeImageSrc;
  }, []);

  const updateRacecarPosition = useCallback(() => {
    if (!canvasRef.current) return; // Ensure canvas is rendered
    const carWidth = carImage.current.naturalWidth;
    targetPosition.current = (activeQuestionIndex / questionsInSet) * (canvasRef.current.width / scaleFactor + carWidth * 2) * 0.75;
    racecarPosition.current = lerp(racecarPosition.current, targetPosition.current, 0.02);
  }, [activeQuestionIndex, questionsInSet]);

  const updateCanvas = useCallback((ctx, deltaTime) => {
    if (!canvasRef.current) return; // Ensure canvas is rendered
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.save();
    ctx.scale(scaleFactor, scaleFactor);

    sunsetPosition.current = drawLayer(ctx, sunsetImage.current, sunsetPosition.current, baseSpeeds.sunsetSpeed, 0, 300, 2, deltaTime);
    sunPosition.current = drawLayer(ctx, sunImage.current, sunPosition.current, baseSpeeds.sunSpeed, 0, 200, 2, deltaTime);
    cloudPosition.current = drawLayer(ctx, cloudImage.current, cloudPosition.current, baseSpeeds.cloudSpeed, 15, 50, 8, deltaTime);
    mountainPosition1.current = drawLayer(ctx, mountainImage1.current, mountainPosition1.current, baseSpeeds.mountainSpeed1, 30, 600, 3, deltaTime);
    mountainPosition2.current = drawLayer(ctx, mountainImage2.current, mountainPosition2.current, baseSpeeds.mountainSpeed2, 30, 300, 3, deltaTime, -100);
    mountainPosition3.current = drawLayer(ctx, mountainImage3.current, mountainPosition3.current, baseSpeeds.mountainSpeed3, 30, 400, 3, deltaTime, 100);
    cloudPosition2.current = drawLayer(ctx, cloudImage2.current, cloudPosition2.current, baseSpeeds.cloudSpeed2, 50, 100, 4, deltaTime);
    cloudPosition3.current = drawLayer(ctx, cloudImage3.current, cloudPosition3.current, baseSpeeds.cloudSpeed3, 75, 200, 3, deltaTime);
    groundPosition.current = drawLayer(ctx, groundImage.current, groundPosition.current, baseSpeeds.groundSpeed, -40, 400, 2, deltaTime);
    roadPosition.current = drawLayer(ctx, roadImage.current, roadPosition.current, baseSpeeds.roadSpeed, -65, 400, 2, deltaTime);

    spawnAndDrawTrees(ctx, deltaTime);
    drawPromptAndOptions(ctx);

    if (showWinMessage) {
      drawWinMessage(ctx);
    }

    ctx.restore();
  }, [showWinMessage, prompt, options]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // Ensure canvas is rendered

    const ctx = canvas.getContext("2d");

    // Load images
    loadImages();

    let lastTime = performance.now();

    const animate = (time) => {
      const deltaTime = (time - lastTime) / 1000; // Convert to seconds
      lastTime = time;

      updateRacecarPosition();
      updateCanvas(ctx, deltaTime);
      requestAnimationFrame(animate);
    };

    carImage.current.onload = () => {
      if (canvasRef.current) {
        requestAnimationFrame(animate);
      }
    };

    return () => {
      // Cleanup function
    };
  }, [loadImages, updateRacecarPosition, updateCanvas]);

  useEffect(() => {
    if (isCorrect) {
      setSpeedMultiplier((prev) => prev + 0.6);
    } else {
      setSpeedMultiplier((prev) => Math.max(1, prev - 0.02));
    }
  }, [activeQuestionIndex, isCorrect]);

  const drawLayer = (ctx, image, position, speed, y, height, loops, deltaTime, offset = 0) => {
    const width = image.naturalWidth * (height / image.naturalHeight);
    for (let i = 0; i < loops; i++) {
      ctx.drawImage(image, position + i * (width - 1) + offset, y, width, height);
    }
    position -= speed * speedMultiplier * deltaTime;
    if (position <= -width) {
      position += width;
    }
    return position;
  };

  const drawRacecar = (ctx) => {
    const carWidth = carImage.current.naturalWidth;
    const carHeight = carImage.current.naturalHeight;
    const aspectRatio = carWidth / carHeight;
    const height = 50;
    const width = height * aspectRatio;
    ctx.drawImage(carImage.current, racecarPosition.current, 250, width, height);
  };

  const drawWinMessage = (ctx) => {
    ctx.fillStyle = 'rgb(113, 34, 5)';
    ctx.font = `${48 * scaleFactor}px 'Alkaline Regular'`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = 3;
    ctx.strokeText("You Win!", canvasRef.current.width / 2 / scaleFactor, canvasRef.current.height / 2 / scaleFactor);
    ctx.fillText("You Win!", canvasRef.current.width / 2 / scaleFactor, canvasRef.current.height / 2 / scaleFactor);
  };

  const spawnAndDrawTrees = (ctx, deltaTime) => {
    const treeSpacing = 40;
    const topTreeYRange = [250, 350];
    const bottomTreeYRange = [350, 400];
    const treeSizeRange = [0.09, 0.2];
    const treeCount = Math.floor(canvasRef.current.width / treeSpacing);

    if (treePositions.current.length === 0) {
      const newTreePositions = [];
      for (let i = 0; i < treeCount; i++) {
        const x = i * treeSpacing + canvasRef.current.width;
        const y = Math.random() < 0.5 ? topTreeYRange[0] : bottomTreeYRange[0];
        const size = Math.random() * (treeSizeRange[1] - treeSizeRange[0]) + treeSizeRange[0];
        newTreePositions.push({ x, y, size });
      }
      treePositions.current = newTreePositions;
    }

    const treesBehindCar = [];
    const treesInFrontOfCar = [];

    treePositions.current.forEach((tree) => {
      const treeWidth = treeImage.current.naturalWidth * tree.size;
      const treeHeight = treeImage.current.naturalHeight * tree.size;
      if (tree.y < 30) {
        treesBehindCar.push(tree);
      } else {
        treesInFrontOfCar.push(tree);
      }
      tree.x -= baseSpeeds.treeSpeed * speedMultiplier * deltaTime;

      if (tree.x + treeWidth < 0) {
        tree.x = canvasRef.current.width + Math.random() * 100;
        tree.y = Math.random() < 0.5 ? topTreeYRange[0] : bottomTreeYRange[0];
        tree.size = Math.random() * (treeSizeRange[1] - treeSizeRange[0]) + treeSizeRange[0];
      }
    });

    treesBehindCar.forEach((tree) => {
      const treeWidth = treeImage.current.naturalWidth * tree.size;
      const treeHeight = treeImage.current.naturalHeight * tree.size;
      ctx.drawImage(treeImage.current, tree.x - treeWidth / 2, tree.y - treeHeight, treeWidth, treeHeight);
    });

    drawRacecar(ctx);

    treesInFrontOfCar.forEach((tree) => {
      const treeWidth = treeImage.current.naturalWidth * tree.size;
      const treeHeight = treeImage.current.naturalHeight * tree.size;
      ctx.drawImage(treeImage.current, tree.x - treeWidth / 2, tree.y - treeHeight, treeWidth, treeHeight);
    });
  };

  const drawPromptAndOptions = (ctx) => {
    const backdropX = (canvasRef.current.width / 2 / scaleFactor) - (200 * scaleFactor);
    const backdropY = 225 * scaleFactor;
    const backdropWidth = 400 * scaleFactor;
    const backdropHeight = 100 * scaleFactor;

    ctx.fillStyle = "rgba(145, 116, 60, 1)";
    ctx.fillRect(backdropX, backdropY, backdropWidth, backdropHeight);

    ctx.fillStyle = "white";
    ctx.font = `${20 * scaleFactor}px Courier New`;
    ctx.textAlign = "center";
    ctx.fillText(prompt, canvasRef.current.width / 2 / scaleFactor, 250 * scaleFactor);
  };

  const lerp = (start, end, t) => {
    return start * (1 - t) + end * t;
  };

  return (
    <div className="game-container">
      <canvas
        ref={canvasRef}
        data-testid="GameCanvas"
        id="GameCanvas"
        width={600 * scaleFactor}
        height={450 * scaleFactor}
        style={{ backgroundColor: "black" }}
      ></canvas>
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
