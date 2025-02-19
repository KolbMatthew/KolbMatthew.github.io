import { useEffect, useRef } from "react";

function GameCanvas({ activeQuestionIndex, questionsInSet, showWinMessage }) {
  const canvasRef = useRef(null);
  const blockPosition = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const drawTrack = () => {
      ctx.fillStyle = "gray";
      ctx.fillRect(0, canvas.height / 2 - 50, canvas.width, 100);
      ctx.fillStyle = "white";
      ctx.fillRect(0, canvas.height / 2 - 5, canvas.width, 10);
    };

    const drawBlock = () => {
      if (activeQuestionIndex < questionsInSet) {
        ctx.fillStyle = "red";
        ctx.fillRect(blockPosition.current, canvas.height / 2 - 25, 50, 50);
      }
    };

    const drawWinMessage = () => {
      ctx.fillStyle = "black";
      ctx.font = "48px Arial";
      ctx.fillText("You Win!", canvas.width / 2 - 100, canvas.height / 2);
    };

    const updateCanvas = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawTrack();
      if (showWinMessage) {
        drawWinMessage();
      } else {
        drawBlock();
      }
    };

    const animate = () => {
      blockPosition.current = (activeQuestionIndex / questionsInSet) * (canvas.width + 50);
      updateCanvas();
      requestAnimationFrame(animate);
    };

    animate();
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
