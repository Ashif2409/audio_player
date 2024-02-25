import React, { useState, useEffect } from 'react';
import './Components/Style.css';

const Pause = ({ onPlayerClick }) => {
  return (
    <svg className="button" viewBox="0 0 60 60" onClick={onPlayerClick} style={{ width: '1.5em' }}>
      <polygon points="0,0 15,0 15,60 0,60" />
      <polygon points="25,0 40,0 40,60 25,60" />
    </svg>
  );
};

const Play = ({ onPlayerClick }) => {
  return (
    <svg className="button" viewBox="0 0 60 60" onClick={onPlayerClick} style={{ width: '1.5em' }}>
      <polygon points="0,0 50,30 0,60" />
    </svg>
  );
};

const YourComponent = () => {
  const [currentFileIndex, setCurrentFileIndex] = useState(null);
  const [audioElements, setAudioElements] = useState([]);
  const [currentTimes, setCurrentTimes] = useState([]);
  const [file, setFile] = useState([]);



  const handleFileChange = (event) => {
    const files = Array.from(event.target.files); 
    const newFiles = [...file, ...files];
    setFile(newFiles);
  
    const newAudioElements = files.map((file) => {
      return new Audio(URL.createObjectURL(file));
    });
    setAudioElements([...audioElements, ...newAudioElements]);
  };
  
  
  

  useEffect(() => {
    const newCurrentTimes = Array(audioElements.length).fill(0);
    setCurrentTimes(newCurrentTimes);
  }, [audioElements]);

  useEffect(() => {
    const handleTimeUpdate = (index) => {
      return () => {
        const updatedCurrentTimes = [...currentTimes];
        updatedCurrentTimes[index] = audioElements[index].currentTime;
        setCurrentTimes(updatedCurrentTimes);
      };
    };

    const removeTimeUpdateListeners = () => {
      audioElements.forEach((audio, index) => {
        audio.removeEventListener('timeupdate', handleTimeUpdate(index));
      });
    };

    if (audioElements.length > 0) {
      audioElements.forEach((audio, index) => {
        audio.addEventListener('timeupdate', handleTimeUpdate(index));
        audio.addEventListener('ended', handleEnded);
      });
    }

    return () => {
      removeTimeUpdateListeners();
    };
  }, [audioElements, currentTimes]);

  const handlePlay = (index) => {
    if (currentFileIndex !== null && currentFileIndex !== index) {
      audioElements[currentFileIndex].pause();
    }

    if (currentFileIndex === index) {
      if (audioElements[index].paused) {
        audioElements[index].play();
      } else {
        audioElements[index].pause();
      }
    } else {
      setCurrentFileIndex(index);
      audioElements[index].play();
    }
  };

  const handleTimeChange = (index, event) => {
    const newCurrentTimes = [...currentTimes];
    newCurrentTimes[index] = parseFloat(event.target.value);
    setCurrentTimes(newCurrentTimes);

    if (audioElements[index]) {
      audioElements[index].currentTime = newCurrentTimes[index];
    }
  };

  const handleEnded = (event) => {
    const nextIndex = currentFileIndex + 1;
    if (nextIndex < file.length) {
      setCurrentFileIndex(nextIndex);
      audioElements[nextIndex].play();
    }
  };

  return (
    <div>
      <input type="file" accept="audio/mp3" onChange={handleFileChange} multiple />
      {file.map((file, index) => (
        <ul key={index}>
          <li>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
              <h3>{file.name}</h3>
              <button onClick={() => handlePlay(index)}>
                {audioElements[index]?.paused ? <Play /> : <Pause />}
              </button>
              <input type="range" min={0} max={audioElements[index]?.duration || 0} value={currentTimes[index] || 0} onChange={(event) => handleTimeChange(index, event)} />
            </div>
          </li>
        </ul>
      ))}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <h1>Audio Player</h1>
      <YourComponent />
    </div>
  );
}

export default App;
