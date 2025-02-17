import { useEffect } from "react";

function GameCanvas() {
  useEffect(() => {
    const canvas = document.getElementById("GameCanvas");
    if (canvas) {
        var c = document.getElementById("GameCanvas");
        var ctx = c.getContext("2d");

        // Create gradient
        var grd = ctx.createLinearGradient(0, 0, 200, 0);
        grd.addColorStop(0, "red");
        grd.addColorStop(1, "white");

        // Fill with gradient
        ctx.fillStyle = grd;
        ctx.fillRect(10, 10, 150, 80);
      } 
  }, []);

  return (
    <canvas
      data-testid="GameCanvas"
      id="GameCanvas"
      width="600"
      height="450"
      style={{ backgroundColor: "black" }}
    ></canvas>
  );
}

export default GameCanvas;
