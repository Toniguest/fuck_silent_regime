import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [position, setPosition] = useState(0); // Track the car's Y position
  const [reverse, setReverse] = useState(false); // Direction of movement

  const playElevatorMusic = () => {
    const audio = new Audio("/elevator-music.mp3");
    audio.play();
  };

  const handleMove = (gear) => {
    const speeds = {
      1: 5,   // Slow speed for 1st gear
      2: 10,  // Normal speed for 2nd gear
      3: 15,  // Faster speed for 3rd gear
      4: 20,  // High speed for 4th gear
      5: 8,   // Slow down for the "fifth gear"
    };

    if (gear === "reverse") {
      setReverse(true);
      setPosition((prev) => prev - 5); // Move backward
    } else {
      setReverse(false);
      setPosition((prev) => prev + speeds[gear]); // Move forward at the speed of the gear
      if (gear === 5) playElevatorMusic(); // Play elevator music for the 5th gear
    }
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
