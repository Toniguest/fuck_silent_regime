import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [position, setPosition] = useState(0); // Track the car's Y position
  const [moving, setMoving] = useState(false); // Track if the car is moving

  const playElevatorMusic = () => {
    const audio = new Audio("/elevator-music.mp3");
    audio.play();
  };

  const handleMove = (gear) => {
    if (moving) return; // Prevent overlapping movements

    setMoving(true); // Start moving
    const speeds = {
      1: 5,   // Small movement for 1st gear
      2: 10,  // Medium movement for 2nd gear
      3: 15,  // Larger movement for 3rd gear
      4: 20,  // Fastest movement for 4th gear
      5: 8,   // Slow movement for 5th gear
    };

    const movement = gear === "reverse" ? -10 : speeds[gear]; // Negative for reverse

    if (gear === 5) playElevatorMusic(); // Play music for 5th gear

    // Move the car and reset the state after the movement
    setPosition((prev) => prev + movement);
    setTimeout(() => setMoving(false), 500); // Stop movement after 500ms
  };

  return (
    <div className="App">
      <div className="buttons">
        <button onClick={() => handleMove(1)}>Metti prima</button>
        <button onClick={() => handleMove(2)}>Metti seconda</button>
        <button onClick={() => handleMove(3)}>Metti terza</button>
        <button onClick={() => handleMove(4)}>Metti quarta</button>
        <button onClick={() => handleMove(5)}>Metti quinta</button>
        <button onClick={() => handleMove("reverse")}>
          Retromarcia parcheggio
        </button>
      </div>
      <div className="road">
        <div
          className="car"
          style={{
            transform: `translateY(${position}px)`,
            transition: "transform 0.5s ease",
          }}
        >
          🚗
        </div>
      </div>
    </div>
  );
};

export default App;
