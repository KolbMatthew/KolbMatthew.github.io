import { useEffect, useRef, useState } from "react";
import carImageSrc from "../../site-images/temp-racecar.png";
import roadImageSrc from "../../site-images/Game/road.png";
import sunImageSrc from "../../site-images/Game/sun.png";
import sunsetImageSrc from "../../site-images/Game/sunset-background.png";
import cloudImageASrc from "../../site-images/Game/clouds-A.png";
import cloudImageBSrc from "../../site-images/Game/clouds-B.png";
import groundImageSrc from "../../site-images/Game/ground.png";
import mountainImageSrc from "../../site-images/Game/mountains.png";
import treeImageSrc from "../../site-images/Game/tree.png"; 

function GameCanvas({ activeQuestionIndex, questionsInSet, showWinMessage, isCorrect }) {
  const canvasRef = useRef(null);

  const racecarPosition = useRef(0);
  const targetPosition = useRef(0);
  const carImage = useRef(new Image());
  const travelDistance = 0.75; // Adjust this value to control the distance the car travels each time
  const carSpeed = useRef(0.02); // Adjust this value to control the "speed" of the car (lerp speed)

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

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Load images
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

    let lastTime = performance.now();

    // Function to draw the layers
    const drawLayer = (image, position, speed, y, height, loops, deltaTime, offset = 0) => {
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

    // Function to draw the racecar
    const drawRacecar = () => {
      const carWidth = carImage.current.naturalWidth;
      const carHeight = carImage.current.naturalHeight;
      const aspectRatio = carWidth / carHeight;
      const height = 50;
      const width = height * aspectRatio;
      ctx.drawImage(carImage.current, racecarPosition.current, 250, width, height);
    };

    // Function to draw the win message
    const drawWinMessage = () => {
      ctx.fillStyle = "black";
      ctx.font = "48px Arial";
      ctx.fillText("You Win!", canvas.width / 2 - 100, canvas.height / 2);
    };

    // Function to spawn and draw trees
    const spawnAndDrawTrees = (deltaTime) => {
      const treeSpacing = 40; // Adjust this value to control the spacing between trees
      const topTreeYRange = [250, 350]; // Adjust this value to control the y-range for trees on the top side of the road
      const bottomTreeYRange = [350, 400]; // Adjust this value to control the y-range for trees on the bottom side of the road
      const treeSizeRange = [0.09, 0.2]; // Adjust this value to control the size range for trees
      const treeCount = Math.floor(canvas.width / treeSpacing);
    
      if (treePositions.current.length === 0) {
        const newTreePositions = [];
        for (let i = 0; i < treeCount; i++) {
          const x = i * treeSpacing + canvas.width;
          const y = Math.random() < 0.5
            ? topTreeYRange[0]
            : bottomTreeYRange[0];
          const size = Math.random() * (treeSizeRange[1] - treeSizeRange[0]) + treeSizeRange[0];
          newTreePositions.push({ x, y, size });
        }
        treePositions.current = newTreePositions;
      }
    
      const treesBehindCar = [];
      const treesInFrontOfCar = [];
    
      treePositions.current.forEach((tree, index) => {
        const treeWidth = treeImage.current.naturalWidth * tree.size;
        const treeHeight = treeImage.current.naturalHeight * tree.size;
        if (tree.y < 30) {
          treesBehindCar.push(tree);
        } else {
          treesInFrontOfCar.push(tree);
        }
        tree.x -= baseSpeeds.treeSpeed * speedMultiplier * deltaTime;
    
        // Respawn tree if it goes off screen
        if (tree.x + treeWidth < 0) {
          tree.x = canvas.width + Math.random() * 100;
          tree.y = Math.random() < 0.5
            ? topTreeYRange[0]
            : bottomTreeYRange[0];
          tree.size = Math.random() * (treeSizeRange[1] - treeSizeRange[0]) + treeSizeRange[0];
        }
      });
    
      // Draw trees behind the car
      treesBehindCar.forEach((tree) => {
        const treeWidth = treeImage.current.naturalWidth * tree.size;
        const treeHeight = treeImage.current.naturalHeight * tree.size;
        ctx.drawImage(treeImage.current, tree.x - treeWidth / 2, tree.y - treeHeight, treeWidth, treeHeight);
      });
    
      // Draw the racecar
      drawRacecar();
    
      // Draw trees in front of the car
      treesInFrontOfCar.forEach((tree) => {
        const treeWidth = treeImage.current.naturalWidth * tree.size;
        const treeHeight = treeImage.current.naturalHeight * tree.size;
        ctx.drawImage(treeImage.current, tree.x - treeWidth / 2, tree.y - treeHeight, treeWidth, treeHeight);
      });
    };

    // Function to update the canvas
    const updateCanvas = (deltaTime) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      sunsetPosition.current = drawLayer(sunsetImage.current, sunsetPosition.current, baseSpeeds.sunsetSpeed, 0, 300, 2, deltaTime);
      sunPosition.current = drawLayer(sunImage.current, sunPosition.current, baseSpeeds.sunSpeed, 0, 200, 2, deltaTime);
      cloudPosition.current = drawLayer(cloudImage.current, cloudPosition.current, baseSpeeds.cloudSpeed, 15, 50, 8, deltaTime);
      mountainPosition1.current = drawLayer(mountainImage1.current, mountainPosition1.current, baseSpeeds.mountainSpeed1, 30, 600, 3, deltaTime);
      mountainPosition2.current = drawLayer(mountainImage2.current, mountainPosition2.current, baseSpeeds.mountainSpeed2, 30, 300, 3, deltaTime, -100);
      mountainPosition3.current = drawLayer(mountainImage3.current, mountainPosition3.current, baseSpeeds.mountainSpeed3, 30, 400, 3, deltaTime, 100);
      cloudPosition2.current = drawLayer(cloudImage2.current, cloudPosition2.current, baseSpeeds.cloudSpeed2, 50, 100, 4, deltaTime);
      cloudPosition3.current = drawLayer(cloudImage3.current, cloudPosition3.current, baseSpeeds.cloudSpeed3, 75, 200, 3, deltaTime);
      groundPosition.current = drawLayer(groundImage.current, groundPosition.current, baseSpeeds.groundSpeed, -40, 400, 2, deltaTime);
      roadPosition.current = drawLayer(roadImage.current, roadPosition.current, baseSpeeds.roadSpeed, -65, 400, 2, deltaTime);
      spawnAndDrawTrees(deltaTime); 
      if (showWinMessage) {
        drawWinMessage();
      }
    };

    // Linear interpolation function for smooth movement
    const lerp = (start, end, t) => {
      return start * (1 - t) + end * t;
    };

    // Animation function to update the racecar and road position
    const animate = (time) => {
      const deltaTime = (time - lastTime) / 1000; // Convert to seconds
      lastTime = time;

      const carWidth = carImage.current.naturalWidth;
      // Calculate the target position based on the active question index
      targetPosition.current = (activeQuestionIndex / questionsInSet) * (canvas.width + carWidth * 2) * travelDistance; // Adjust travel distance

      // Smoothly interpolate the racecar position
      racecarPosition.current = lerp(racecarPosition.current, targetPosition.current, carSpeed.current);

      updateCanvas(deltaTime);
      requestAnimationFrame(animate);
    };

    // Start the animation once the car image is loaded
    carImage.current.onload = () => {
      requestAnimationFrame(animate);
    };

  }, [activeQuestionIndex, questionsInSet, showWinMessage, speedMultiplier]);

  useEffect(() => {
    if (isCorrect) {
      setSpeedMultiplier((prev) => prev + 0.6);
    } else {
      setSpeedMultiplier((prev) => Math.max(1, prev - 0.02));
    }
  }, [activeQuestionIndex, isCorrect]);

  return (
    <canvas
      ref={canvasRef}
      data-testid="GameCanvas"
      id="GameCanvas"
      width="600"
      height="350"
      style={{ backgroundColor: "black" }}
    ></canvas>
  );
}

export default GameCanvas;
