import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import backgroundImage from "./img/background_ivan.png";

const App = () => {
  const [position, setPosition] = useState(1840); // Inizializza la macchina alla destra del contenitore
  const [intervalId, setIntervalId] = useState(null); // ID dell'intervallo corrente
  const [currentGear, setCurrentGear] = useState(null); // Marcia attuale
  const [showPopup, setShowPopup] = useState(false); // Stato per mostrare il pop-up
  const [elevatorMusic, setElevatorMusic] = useState(false); // Stato per la musica
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Stato per monitorare se siamo su mobile
  const [disabledButtons, setDisabledButtons] = useState({
    2: true,
    3: true,
    4: true,
    5: true,
  }); // Stato per monitorare quali pulsanti sono disabilitati
  const audioRef = useRef(new Audio("/waiting-music.mp3")); // Riferimento all'oggetto audio

  // Riproduce la musica in modo indipendente
  const playElevatorMusic = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Riavvia la musica dall'inizio
      audioRef.current
        .play()
        .then(() => {
          console.log("Musica riprodotta con successo.");
        })
        .catch((error) => {
          console.error("Errore durante la riproduzione dell'audio:", error);
        });
    }
  };

  // Ferma la musica
  const stopElevatorMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Riporta l'audio all'inizio
    }
  };

  // Gestisce il movimento della macchina
  const handleMove = (gear) => {
    if (gear === currentGear) {
      return; // Se la marcia selezionata è uguale alla marcia attuale, non fare nulla
    }

    // Ferma il movimento attuale
    if (intervalId) {
      clearInterval(intervalId);
    }

    setShowPopup(false); // Chiudi il pop-up quando si seleziona un altro pulsante
    setCurrentGear(gear); // Aggiorna la marcia attuale

    // Definisce la velocità in base alla marcia
    const speeds = {
      1: -2,   // Velocità lenta per la prima (verso sinistra)
      2: -4,   // Velocità media per la seconda
      3: -6,   // Velocità più veloce per la terza
      4: -8,   // Velocità massima per la quarta
      5: -1,   // Velocità ridotta per la quinta
      reverse: 4, // Retromarcia, muove verso destra
    };

    // Imposta un nuovo movimento continuo
    const newIntervalId = setInterval(() => {
      setPosition((prev) => {
        const newPos = prev + speeds[gear];
        const limit = isMobile ? 355 : 1840;

        // Se la macchina esce fuori dal limite sinistro del contenitore, ritorna alla posizione iniziale
        if (newPos < 0) {
          return limit; // Torna alla destra del contenitore, posizione dipendente dal dispositivo
        } else if (newPos > limit) {
          return 0; // Torna all'inizio se va troppo a destra in retromarcia
        } else {
          return newPos;
        }
      });
    }, 100); // Aggiorna la posizione ogni 100ms

    setIntervalId(newIntervalId);

    // Se si mette la quinta, riproduci la musica
    if (gear === 5) {
      setElevatorMusic(true);
    } else {
      setElevatorMusic(false);
      stopElevatorMusic(); // Ferma la musica se si cambia marcia
    }

    // Attiva il pulsante successivo quando una marcia è selezionata (fino alla quarta)
    if (gear < 5) {
      setDisabledButtons((prevDisabled) => ({
        ...prevDisabled,
        [gear + 1]: false,
      }));
    }
  };

  // Gestisce la fermata/parcheggio della macchina
  const handleStop = () => {
    if (intervalId) {
      clearInterval(intervalId); // Ferma il movimento
      setIntervalId(null);
      setCurrentGear(null); // Reset della marcia attuale
    }
    setShowPopup(true); // Mostra il pop-up solo quando si clicca su "Parcheggia bene"
    setElevatorMusic(false);
    stopElevatorMusic(); // Ferma l'audio quando la macchina si ferma
  };

  // Riproduce o ferma la musica quando cambia lo stato `elevatorMusic`
  useEffect(() => {
    if (elevatorMusic) {
      playElevatorMusic();
    } else {
      stopElevatorMusic();
    }
  }, [elevatorMusic]); // Dipendenza su `elevatorMusic`

  // Pulisce l'intervallo quando il componente viene smontato
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      stopElevatorMusic(); // Ferma l'audio quando il componente viene smontato
    };
  }, [intervalId]); // Dipendenza su `intervalId`

  // Imposta la posizione iniziale della macchina in base alla larghezza dello schermo
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
        setPosition(355); // Posizione iniziale per la visualizzazione mobile
      } else {
        setIsMobile(false);
        setPosition(1840); // Posizione iniziale per desktop
      }
    };

    // Imposta la posizione iniziale al caricamento
    handleResize();

    // Aggiungi un listener per aggiornare la posizione quando cambia la dimensione dello schermo
    window.addEventListener("resize", handleResize);

    // Pulisci l'evento quando il componente viene smontato
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
      <div className="buttons">
        <button onClick={() => handleMove(1)}>Metti prima</button>
        <button
          onClick={() => handleMove(2)}
          disabled={disabledButtons[2]}
          className={disabledButtons[2] ? "disabled-button" : ""}
        >
          Metti seconda
        </button>
        <button
          onClick={() => handleMove(3)}
          disabled={disabledButtons[3]}
          className={disabledButtons[3] ? "disabled-button" : ""}
        >
          Metti terza
        </button>
        <button
          onClick={() => handleMove(4)}
          disabled={disabledButtons[4]}
          className={disabledButtons[4] ? "disabled-button" : ""}
        >
          Metti quarta
        </button>
        <button
          onClick={() => handleMove(5)}
          disabled={disabledButtons[5]}
          className={disabledButtons[5] ? "disabled-button" : ""}
        >
          Metti quinta bene
        </button>
        <button onClick={() => handleMove("reverse")}>Retromarcia</button>
        <button onClick={handleStop}>Parcheggia bene</button>
      </div>

      {showPopup && (
        <div className="popup">
          <img src="/faccia_salvatore.jpg" alt="Parcheggio" className="popup-image" />
        </div>
      )}

      <div className="road">
        <div
          className="car"
          style={{
            transform: `translateX(${position}px)`,
            transition: "transform 0.1s linear",
            fontSize: isMobile ? "60px" : "50px", // Dimensione maggiore su mobile
          }}
        >
          🚗
        </div>
      </div>
    </div>
  );
};

export default App;
