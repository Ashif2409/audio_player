import React, { useState, useEffect } from 'react';

const AudioPlayer = () => {
  const [files, setFiles] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [audioRef, setAudioRef] = useState(null);

  useEffect(() => {
    const storedIndex = localStorage.getItem('currentFileIndex');
    if (storedIndex !== null) {
      setCurrentFileIndex(parseInt(storedIndex));
    }
  }, []);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles([...files, ...newFiles]);
  };

  const handlePlay = (index) => {
    setCurrentFileIndex(index);
    localStorage.setItem('currentFileIndex', index);
    audioRef.play();
  };

  const handleEnded = () => {
    if (currentFileIndex < files.length - 1) {
      handlePlay(currentFileIndex + 1);
    }
  };

  return (
    <div>
      <input type="file" accept="audio/mp3" onChange={handleFileChange} multiple />
      <ul>
        {files.map((file, index) => (
          <li key={index}>
            <button onClick={() => handlePlay(index)}>{file.name}</button>
          </li>
        ))}
      </ul>
      {files.length > 0 && (
        <audio
          ref={(element) => setAudioRef(element)}
          src={files[currentFileIndex].name}
          controls
          onEnded={handleEnded}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <h1>Audio Player</h1>
      <AudioPlayer />
    </div>
  );
}

export default App;