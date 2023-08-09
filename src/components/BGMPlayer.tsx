import { useState, useEffect } from "react";
import styled from "styled-components";

const BGMPlayerWrapper = styled.button`
  padding: 10px;
`;

const VolumeControl = styled.div<{ volume: number }>`
margit-top: 100px;
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

const bgmAudio = new Audio("/mp3/dubstep_drum_trap_loop.mp3");

export default function BGMPlayer() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    async function fetch() {
      bgmAudio.loop = true;
      await bgmAudio.play();
    }
    fetch();

    return () => {
      bgmAudio.pause();
      bgmAudio.currentTime = 0;
    };
  }, []);

  const handleToggle = () => {
    if (isPlaying) {
      bgmAudio.pause();
    } else {
      bgmAudio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    bgmAudio.volume = newVolume;
    setVolume(newVolume);
  };

  return (
    <div style={{ position: "fixed", right: "40px", top: "200px" }}>
      <BGMPlayerWrapper onClick={handleToggle}>
        {isPlaying ? "Pause BGM" : "Play BGM"}
      </BGMPlayerWrapper>
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
    </div>
  );
}
