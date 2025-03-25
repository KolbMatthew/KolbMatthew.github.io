import { useEffect, useRef, useState, useCallback } from "react";
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
  speedMultiplier
}) {
  // State and refs
  const speedMultiplierRef = useRef(speedMultiplier);

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

  // Positions
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

  // Tree state
  const treePositions = useRef([]);

  // Image Loading 
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

  // Animation/Position Update
  const lerp = (start, end, t) => start * (1 - t) + end * t;

  // Update the racecar’s X position based on current question progress.
  const updateRacecarPosition = useCallback(() => {
    if (!canvasRef.current) return;
    const carWidth = carImage.current.naturalWidth;

    // Racecar drives from left to right as questions progress
    const maxCarTravelX = (canvasRef.current.width / scaleFactor) + (carWidth * 2);
    targetPositionX.current = (activeQuestionIndex / questionsInSet) * maxCarTravelX * 0.75;

    // Smooth out movement (linear interpolation)
    racecarPositionX.current = lerp(racecarPositionX.current, targetPositionX.current, 0.02);
  }, [activeQuestionIndex, questionsInSet]);

  // Draw a repeating, scrolling layer of an image (like clouds, road, mountains, etc.)
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
  
    // Draw the repeated images horizontally side-by-side
    for (let i = 0; i < loops; i++) {
      ctx.drawImage(
        image,
        posX + i * (renderedWidth - 1) + offsetX,
        y,
        renderedWidth,
        renderedHeight
      );
    }
  
    // Use the current speed multiplier from the ref
    positionRef.current -= speed * speedMultiplierRef.current * deltaTime;
    // If the entire image scrolled off screen, reset
    if (positionRef.current <= -renderedWidth) {
      positionRef.current += renderedWidth;
    }
  };

  // Draw the racecar
  const drawRacecar = (ctx) => {
    const carW = carImage.current.naturalWidth;
    const carH = carImage.current.naturalHeight;
    const aspectRatio = carW / carH;
    const finalHeight = 50; // fixed height for the car
    const finalWidth = finalHeight * aspectRatio;

    ctx.drawImage(
      carImage.current,
      racecarPositionX.current,
      250, // Racecar's Y position
      finalWidth,
      finalHeight
    );
  };

  // Spawn trees if we have none, then move and draw them. Trees behind the racecar
  const updateAndDrawTrees = (ctx, deltaTime) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // If no trees have been spawned, populate initial array
    if (treePositions.current.length === 0) {
      const spacing = 40;
      const count = Math.floor(canvas.width / spacing);

      for (let i = 0; i < count; i++) {
        const x = canvas.width + i * spacing;

        // Randomly decide if this tree is in the "top" cluster or "bottom" cluster:
        const isTop = Math.random() < 0.5;
        const [minY, maxY] = isTop ? [260, 260] : [350, 350];
        const y = Math.random() * (maxY - minY) + minY;

        // Scale the tree by a random factor
        const size = Math.random() * (0.18 - 0.09) + 0.09;

        // Randomly select one of the tree images
        const treeImage = [treeImageA.current, treeImageB.current, treeImageC.current][Math.floor(Math.random() * 3)];

        // Randomly adjust brightness
        const brightness = Math.random() * 0.4 + 0.8; // Range from 0.8 to 1.2

        treePositions.current.push({ x, y, size, treeImage, brightness, isTop });
      }
    }

    // Move and re-spawn any off-screen trees
    treePositions.current.forEach((tree) => {
      const width = tree.treeImage.naturalWidth * tree.size;
      tree.x -= baseSpeeds.treeSpeed * speedMultiplierRef.current * deltaTime;

      // If the tree scrolled off screen to the left, put it back on the right
      if (tree.x + width < 0) {
        tree.x = canvas.width + Math.random() * 100;

        // Randomly pick whether it goes to the top or bottom cluster again
        const isTop = Math.random() < 0.5;
        const [minY, maxY] = isTop ? [260, 260] : [350, 350];
        tree.y = Math.random() * (maxY - minY) + minY;
        tree.size = Math.random() * (0.18 - 0.09) + 0.09;

        // Randomly select one of the tree images
        tree.treeImage = [treeImageA.current, treeImageB.current, treeImageC.current][Math.floor(Math.random() * 3)];

        // Randomly adjust brightness
        tree.brightness = Math.random() * 0.4 + 0.8; // Range from 0.8 to 1.2

        tree.isTop = isTop;
      }
    });

    // Separate trees behind vs. in front of car
    const treesBehindCar = treePositions.current.filter((t) => t.isTop);
    const treesInFrontOfCar = treePositions.current.filter((t) => !t.isTop);

    // Draw behind-car trees
    drawTreesArray(ctx, treesBehindCar);

    // Draw the racecar itself
    drawRacecar(ctx);

    // Draw front-of-car trees
    drawTreesArray(ctx, treesInFrontOfCar);
  };

  // Helper function to pre-render a tree with brightness applied
  const getPreRenderedTreeImage = (tree) => {
    // If the pre-rendered image is already cached, return it
    if (tree.renderedImage) return tree.renderedImage;

    // Create an offscreen canvas with dimensions based on the tree image and its scale
    const width = tree.treeImage.naturalWidth * tree.size;
    const height = tree.treeImage.naturalHeight * tree.size;
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = width;
    offscreenCanvas.height = height;
    const offCtx = offscreenCanvas.getContext("2d");

    // Apply the brightness filter and draw the tree onto the offscreen canvas
    offCtx.filter = `brightness(${tree.brightness})`;
    offCtx.drawImage(tree.treeImage, 0, 0, width, height);

    // Cache the rendered image for future draws
    tree.renderedImage = offscreenCanvas;
    return offscreenCanvas;
  };

  // Draw a batch of trees from an array of tree objects { x, y, size, treeImage, brightness }.
  const drawTreesArray = (ctx, trees) => {
    trees.forEach((tree) => {
      // Get pre-rendered image with brightness applied
      const renderedImage = getPreRenderedTreeImage(tree);
      const tw = tree.treeImage.naturalWidth * tree.size;
      const th = tree.treeImage.naturalHeight * tree.size;
      // Draw the pre-rendered image onto the main canvas
      ctx.drawImage(renderedImage, tree.x - tw / 2, tree.y - th, tw, th);
    });
  };

  // Draw the final "You Win!" overlay in the center of the canvas.
  const drawWinMessage = (ctx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    ctx.fillStyle = "rgb(113, 34, 5)";
    ctx.font = `${48 * scaleFactor}px 'Alkaline Regular'`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Outline
    ctx.lineWidth = 3;
    ctx.strokeText(
      "You Win!",
      (canvas.width / 2) / scaleFactor,
      (canvas.height / 2) / scaleFactor
    );
    // Fill
    ctx.fillText(
      "You Win!",
      (canvas.width / 2) / scaleFactor,
      (canvas.height / 2) / scaleFactor
    );
  };

  // Draw the question prompt in a box near the top of the canvas.
  const drawPrompt = (ctx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const boxWidth = 400 * scaleFactor;
    const boxHeight = 100 * scaleFactor;
    const boxX = (canvas.width / 2 / scaleFactor) - (boxWidth / 2);
    const boxY = 225 * scaleFactor;

    // Backdrop
    ctx.fillStyle = "rgba(145, 116, 60, 1)";
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

    // Prompt text
    ctx.fillStyle = "white";
    ctx.font = `${20 * scaleFactor}px Courier New`;
    ctx.textAlign = "center";
    ctx.fillText(prompt, (canvas.width / 2) / scaleFactor, 250 * scaleFactor);
  };

  // Main draw routine for the entire scene, called each frame.
  const renderScene = useCallback((ctx, deltaTime) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Clear entire canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply global scale for all subsequent draws
    ctx.save();
    ctx.scale(scaleFactor, scaleFactor);

    // 1. Draw backgrounds / layered scenery
    drawScrollingLayer(ctx, sunsetImage.current, sunsetPositionX, baseSpeeds.sunsetSpeed, 0, 300, 2, deltaTime);
    drawScrollingLayer(ctx, sunImage.current, sunPositionX, baseSpeeds.sunSpeed, 0, 200, 2, deltaTime);
    drawScrollingLayer(ctx, cloudImage.current, cloudPositionX, baseSpeeds.cloudSpeed, 15, 50, 8, deltaTime);

    drawScrollingLayer(ctx, mountainImage1.current, mountainPosition1X, baseSpeeds.mountainSpeed1, 30, 600, 3, deltaTime);
    drawScrollingLayer(ctx, mountainImage2.current, mountainPosition2X, baseSpeeds.mountainSpeed2, 30, 300, 3, deltaTime, -100);
    drawScrollingLayer(ctx, mountainImage3.current, mountainPosition3X, baseSpeeds.mountainSpeed3, 30, 400, 3, deltaTime, 100);

    drawScrollingLayer(ctx, cloudImage2.current, cloudPositionX2, baseSpeeds.cloudSpeed2, 50, 100, 4, deltaTime);
    drawScrollingLayer(ctx, cloudImage3.current, cloudPositionX3, baseSpeeds.cloudSpeed3, 75, 200, 3, deltaTime);
    drawScrollingLayer(ctx, groundImage.current, groundPositionX, baseSpeeds.groundSpeed, -40, 400, 2, deltaTime);
    drawScrollingLayer(ctx, roadImage.current, roadPositionX, baseSpeeds.roadSpeed, -65, 400, 2, deltaTime);

    // 2. Update and draw trees + racecar
    updateAndDrawTrees(ctx, deltaTime);

    // 3. Draw the prompt area
    drawPrompt(ctx);

    // 4. If the user has won, overlay a message
    if (showWinMessage) {
      drawWinMessage(ctx);
    }

    ctx.restore();
  }, [showWinMessage, prompt, speedMultiplier]);

  useEffect(() => {
    speedMultiplierRef.current = speedMultiplier;
  }, [speedMultiplier]);  

  // React lifecycle hooks
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");

    // Load image resources
    loadImages();

    let lastTime = performance.now();

    const animate = (time) => {
      const deltaTime = (time - lastTime) / 1000; // in seconds
      lastTime = time;

      updateRacecarPosition();
      renderScene(ctx, deltaTime);
      requestAnimationFrame(animate);
    };

    // Start animation once the car image is ready
    carImage.current.onload = () => {
      if (canvasRef.current) {
        requestAnimationFrame(animate);
      }
    };

    return () => {
      // Cleanup if needed
    };
  }, [loadImages, updateRacecarPosition, renderScene, speedMultiplier]);

  // Reset positions when the question index changes
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
