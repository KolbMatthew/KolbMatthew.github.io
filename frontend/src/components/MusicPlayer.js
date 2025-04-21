import React, { useEffect, useRef, useState } from "react";

function MusicPlayer({ src, play }) {
  const audioRef = useRef(null);
  const [isUserInteracted, setIsUserInteracted] = useState(false);
  const fadeInterval = useRef(null);

  useEffect(() => {
    const handleUserInteraction = () => {
      setIsUserInteracted(true);
    };

    // Listen for user interaction events
    window.addEventListener("click", handleUserInteraction);
    window.addEventListener("keydown", handleUserInteraction);

    return () => {
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
    };
  }, []);

  const fadeVolume = (targetVolume, duration, onComplete) => {
    if (!audioRef.current) return;

    const currentVolume = audioRef.current.volume;
    const volumeDifference = targetVolume - currentVolume;
    const step = volumeDifference / (duration / 10); // Calculate step size
    const interval = 10; // Adjust volume every 10ms

    clearInterval(fadeInterval.current); // Clear any existing fade intervals
    fadeInterval.current = setInterval(() => {
      const newVolume = audioRef.current.volume + step;
      if (
        (step > 0 && newVolume >= targetVolume) ||
        (step < 0 && newVolume <= targetVolume)
      ) {
        audioRef.current.volume = targetVolume;
        clearInterval(fadeInterval.current);
        if (onComplete) onComplete(); // Call the callback when fade is complete
      } else {
        audioRef.current.volume = newVolume;
      }
    }, interval);
  };

  useEffect(() => {
    if (audioRef.current) {
      // Pause and reset the audio before changing the source
      audioRef.current.pause();
      audioRef.current.currentTime = 0;

      // Attempt to play the new audio if allowed
      if (play && isUserInteracted) {
        audioRef.current.volume = 0; // Start with volume at 0 for fade-in
        audioRef.current.play().then(() => {
          fadeVolume(0.10, 2000); // Fade in to 50% volume over 2 seconds
        }).catch((error) => {
          console.error("Error playing audio:", error);
        });
      }
    }
  }, [src, play, isUserInteracted]); // Triggered when `src`, `play`, or `isUserInteracted` changes

  useEffect(() => {
    if (play && isUserInteracted) {
      audioRef.current.volume = 0; // Start with volume at 0 for fade-in
      audioRef.current.play().then(() => {
        fadeVolume(0.10, 2000); // Fade in to 50% volume over 2 seconds
      }).catch((error) => {
        console.error("Error playing audio:", error);
      });
    } else {
      fadeVolume(0, 100000, () => {
        audioRef.current.pause(); // Pause after fade-out completes
      }); // Fade out to 0 volume over 2 seconds
    }
  }, [play, isUserInteracted]);

  return <audio ref={audioRef} src={src} loop />;
}

export default MusicPlayer;