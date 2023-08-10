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
      height: 0.4rem;
      background: ${(props) =>
        props.volume
          ? `linear-gradient(to right, #D9D9D9 ${props.volume}%, rgba(229, 231, 235, 0.5)
 ${props.volume}% 100%)`
          : "#E5E7EB"};
      opacity: ${(props) => (props.volume ? "1" : "0.5")};
      transition: all 0.5s;
      cursor: pointer;
    }
`;

const CheckboxInput = styled.input.attrs({ type: "checkbox" })`
  display: none;
`;

const ToggleSwitch = styled.label`
  width: 40px;
  height: 40px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(39, 39, 39);
  border-radius: 50%;
  cursor: pointer;
  transition-duration: 0.3s;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.13);
  overflow: hidden;

  &:hover {
    background-color: rgb(61, 61, 61);
  }
`;

const BellIcon = styled.div`
  width: 18px;
  & path {
    fill: white;
  }
`;

const SpeakerIcon = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition-duration: 0.3s;

  ${CheckboxInput}:checked + ${ToggleSwitch} & {
    opacity: 0;
    transition-duration: 0.3s;
  }
`;

const MuteSpeakerIcon = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  z-index: 3;
  transition-duration: 0.3s;

  ${CheckboxInput}:checked + ${ToggleSwitch} & {
    opacity: 1;
    transition-duration: 0.3s;
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
    <div
      style={{
        position: "fixed",
        display: "flex",
        flexDirection: "row",
        right: "20px",
        bottom: "10px",
        gap: "10px",
        margin: "10px",
        backgroundColor: "white",
        padding: "10px",
        width: "200px",
        borderRadius: "40px",
      }}
    >
      <CheckboxInput id="checkboxInput" onClick={handleToggle} />
      <ToggleSwitch htmlFor="checkboxInput" className="toggleSwitch">
        <SpeakerIcon className="speaker">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.0"
            viewBox="0 0 75 75"
            width="15px"
          >
            <path
              d="M39.389,13.769 L22.235,28.606 L6,28.606 L6,47.699 L21.989,47.699 L39.389,62.75 L39.389,13.769z"
              style={{
                stroke: "#fff",
                strokeWidth: 5,
                strokeLinejoin: "round",
                fill: "#fff",
              }}
            ></path>
            <path
              d="M48,27.6a19.5,19.5 0 0 1 0,21.4M55.1,20.5a30,30 0 0 1 0,35.6M61.6,14a38.8,38.8 0 0 1 0,48.6"
              style={{
                fill: "none",
                stroke: "#fff",
                strokeWidth: 5,
                strokeLinecap: "round",
              }}
            ></path>
          </svg>
        </SpeakerIcon>
        <MuteSpeakerIcon className="mute-speaker">
          <svg
            version="1.0"
            viewBox="0 0 75 75"
            stroke="#fff"
            strokeWidth="5"
            width="15px"
          >
            <path
              d="m39,14-17,15H6V48H22l17,15z"
              fill="#fff"
              strokeLinejoin="round"
            ></path>
            <path
              d="m49,26 20,24m0-24-20,24"
              fill="#fff"
              strokeLinecap="round"
            ></path>
          </svg>
        </MuteSpeakerIcon>
      </ToggleSwitch>
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
