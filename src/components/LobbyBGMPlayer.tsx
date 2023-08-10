import { useState, useEffect } from "react";
import styled from "styled-components";

const BGMPlayerWrapper = styled.button`
  padding: 10px;
`;

const VolumeControl = styled.div<{ volume: number }>`
  justify-content: center;
  align-items: center;
  width: 6rem;

  input[type='range'] {
    -webkit-appearance: none;
    height: 100%;
    background: transparent;

    &:focus {
      outline: none;
    }

    //WEBKIT
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      height: 16px;
      width: 16px;
      border-radius: 50%;
      background: ${(props) => (props.volume ? "#d9d9d9" : "#E5E7EB")};
      margin-top: -5px;
      cursor: pointer;
    }

    &::-webkit-slider-runnable-track {
      height: 0.6rem;
      background: ${(props) =>
        props.volume
          ? `linear-gradient(to right, #D9D9D9 ${props.volume}%, rgba(229, 231, 235, 0.5)
 ${props.volume}% 100%)`
          : "#E5E7EB"};
      opacity: ${(props) => (props.volume ? "1" : "0.5")};
      border-radius: 3rem;
      transition: all 0.5s;
      cursor: pointer;
    }
`;

const lobbyAudio = new Audio("/mp3/menu_loop.mp3");

export default function LobbyBGMPlayer() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.7);

  useEffect(() => {
    async function fetch() {
      lobbyAudio.currentTime = 0;
      lobbyAudio.loop = true;
      await lobbyAudio.play();
    }
    fetch();

    return () => {
      lobbyAudio.pause();
    };
  }, []);

  const handleToggle = () => {
    if (isPlaying) {
      lobbyAudio.pause();
    } else {
      lobbyAudio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    lobbyAudio.volume = newVolume;
    setVolume(newVolume);
  };

  return (
    <div style={{ position: "fixed", right: "40px", bottom: "50px" }}>
      <BGMPlayerWrapper onClick={handleToggle}>
        {isPlaying ? "Pause BGM" : "Play BGM"}
      </BGMPlayerWrapper>
      {isPlaying && (
        <VolumeControl volume={volume * 100}>
          <input
            type="range"
            value={volume}
            onChange={handleVolumeChange}
            min={0}
            max={1}
            step={0.1}
          />
        </VolumeControl>
      )}
    </div>
  );
}
