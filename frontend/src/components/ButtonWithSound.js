import React from "react";
import useSound from "use-sound";
import clickSound from "../sounds/click-sound.mp3";

function ButtonWithSound({ onClick, children, className, ...props }) {
  const [playClickSound] = useSound(clickSound);

  const handleClick = (event) => {
    playClickSound(); // Play the click sound
    if (onClick) {
      onClick(event); // Call the original onClick handler
    }
  };

  return (
    <button className={className} onClick={handleClick} {...props}>
      {children}
    </button>
  );
}

export default ButtonWithSound;