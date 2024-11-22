import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [position, setPosition] = useState(500); // Inizializza la macchina alla destra del contenitore
  const [intervalId, setIntervalId] = useState(null); // ID dell'intervallo corrente
  const [currentGear, setCurrentGear] = useState(null); // Marcia attuale

  const playElevatorMusic = () => {
    const audio = new Audio("/elevator-music.mp3");
    audio.play();
  };

  const handleMove = (gear) => {
    if (gear === currentGear) {
      return; // Se la marcia selezionata è uguale alla marcia attuale, non fare nulla
    }

    // Ferma il movimento attuale
    if (intervalId) {
      clearInterval(intervalId);
    }

    setCurrentGear(gear); // Aggiorna la marcia attuale

    // Definisce la velocità in base alla marcia
    const speeds = {
      1: -2,   // Velocità lenta per la prima (verso sinistra)
      2: -4,   // Velocità media per la seconda
      3: -6,   // Velocità più veloce per la terza
      4: -8,   // Velocità massima per la quarta
      5: -3,   // Velocità ridotta per la quinta
      reverse: 4, // Retromarcia, muove verso destra
    };

    if (gear === 5) {
      playElevatorMusic(); // Riproduce la musica per la quinta marcia
    }

    // Imposta un nuovo movimento continuo
    const newIntervalId = setInterval(() => {
      setPosition((prev) => {
        const newPos = prev + speeds[gear];

        // Se la macchina esce fuori dal limite sinistro del contenitore, ritorna alla posizione iniziale
        if (newPos < 0) {
          return 500; // Torna alla destra del contenitore
        } else if (newPos > 500) {
          return 0; // Torna all'inizio se va troppo a destra in retromarcia
        } else {
          return newPos;
        }
      });
    }, 100); // Aggiorna la posizione ogni 100ms

    setIntervalId(newIntervalId);
  };

  const handleStop = () => {
    if (intervalId) {
      clearInterval(intervalId); // Ferma il movimento
      setIntervalId(null);
      setCurrentGear(null); // Reset della marcia attuale
    }
  };

  // Pulisce l'intervallo quando il componente viene smontato
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

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
        <button onClick={handleStop}>Fermata</button>
      </div>
      <div className="road">
        <div
          className="car"
          style={{
            transform: `translateX(${position}px)`,
            transition: "transform 0.1s linear",
          }}
        >
          🚗
        </div>
      </div>
    </div>
  );
};

export default App;
