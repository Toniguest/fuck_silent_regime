import React, { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";
import backgroundImage from "./img/background_ivan.png";
import popupImage from "./img/faccia_salvatore.jpg";

const App = () => {
  const [position, setPosition] = useState(1850); // Inizializza la macchina alla destra del contenitore
  const [intervalId, setIntervalId] = useState(null); // ID dell'intervallo corrente
  const [currentGear, setCurrentGear] = useState(null); // Marcia attuale
  const [showPopup, setShowPopup] = useState(false); // Stato per mostrare il pop-up
  const [isPlaying, setIsPlaying] = useState(false); // Stato per monitorare se l'audio è in riproduzione
  const audioRef = useRef(null); // Riferimento all'oggetto audio

  // Riproduce la musica
  const playElevatorMusic = () => {
    if (audioRef.current && !isPlaying) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true); // Aggiorna lo stato a "in riproduzione"
        })
        .catch((error) => {
          console.error("Errore durante la riproduzione dell'audio:", error);
        });
    }
  };

  // Ferma la musica, funzione stabilizzata con useCallback
  const stopElevatorMusic = useCallback(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Riporta l'audio all'inizio
      setIsPlaying(false); // Aggiorna lo stato a "non in riproduzione"
    }
  }, [isPlaying]);

  // Gestisce il movimento della macchina
  const handleMove = (gear) => {
    if (gear === currentGear) {
      return; // Se la marcia selezionata è uguale alla marcia attuale, non fare nulla
    }

    // Ferma il movimento attuale e la musica
    if (intervalId) {
      clearInterval(intervalId);
    }
    stopElevatorMusic();

    setShowPopup(false); // Chiudi il pop-up quando si seleziona un altro pulsante
    setCurrentGear(gear); // Aggiorna la marcia attuale

    // Definisce la velocità in base alla marcia
    const speeds = {
      1: -2,   // Velocità lenta per la prima (verso sinistra)
      2: -4,   // Velocità media per la seconda
      3: -6,   // Velocità più veloce per la terza
      4: -8,   // Velocità massima per la quarta
      5: -2,   // Velocità ridotta per la quinta
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
          return 1850; // Torna alla destra del contenitore
        } else if (newPos > 1850) {
          return 0; // Torna all'inizio se va troppo a destra in retromarcia
        } else {
          return newPos;
        }
      });
    }, 100); // Aggiorna la posizione ogni 100ms

    setIntervalId(newIntervalId);
  };

  // Gestisce la fermata/parcheggio della macchina
  const handleStop = () => {
    if (intervalId) {
      clearInterval(intervalId); // Ferma il movimento
      setIntervalId(null);
      setCurrentGear(null); // Reset della marcia attuale
    }
    setShowPopup(true); // Mostra il pop-up solo quando si clicca su "Parcheggia bene"
    stopElevatorMusic(); // Ferma l'audio quando la macchina si ferma
  };

  // Pulisce l'intervallo quando il componente viene smontato
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      stopElevatorMusic(); // Ferma l'audio quando il componente viene smontato
    };
  }, [intervalId, stopElevatorMusic]); // Aggiungi `stopElevatorMusic` come dipendenza

  return (
    <div 
      className="App"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh"
      }}
    >
      {/* Elemento audio nascosto per la riproduzione */}
      <audio ref={audioRef} src="/waiting-music.mp3" /> {/* QUI inserisci il percorso del file audio */}

      <div className="buttons">
        <button onClick={() => handleMove(1)}>Metti prima</button>
        <button onClick={() => handleMove(2)}>Metti seconda</button>
        <button onClick={() => handleMove(3)}>Metti terza</button>
        <button onClick={() => handleMove(4)}>Metti quarta</button>
        <button onClick={() => handleMove(5)}>Metti quinta bene</button>
        <button onClick={() => handleMove("reverse")}>
          Retromarcia
        </button>
        <button onClick={handleStop}>Parcheggia bene</button>
      </div>

      {showPopup && (
        <div className="popup">
          <img src={popupImage} alt="Parcheggio" className="popup-image" />
        </div>
      )}

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
