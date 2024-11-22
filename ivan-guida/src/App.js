import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [position, setPosition] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [reverse, setReverse] = useState(false);

  const playElevatorMusic = () => {
    const audio = new Audio("/elevator-music.mp3");
    audio.play();
  };

  const handleMove = (gear) => {
    if (gear === "reverse") {
      setReverse(true);
      setSpeed(2);
    } else {
      setReverse(false);
      const speeds = {
        1: 1,
        2: 3,
        3: 6,
        4: 10,
        5: 2, // Slow down for the "fifth gear"
      };
      setSpeed(speeds[gear]);
      if (gear === 5) playElevatorMusic();
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
            transition: `transform ${speed / 10}s linear`,
          }}
        >
          🚗
        </div>
      </div>
    </div>
  );
};

export default App;
