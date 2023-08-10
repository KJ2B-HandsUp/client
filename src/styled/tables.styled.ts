import styled, { keyframes } from "styled-components";
import { CAMERA_VIEW_WIDTH, CAMERA_VIEW_HEIGHT } from "../styled/game.styled";
import { motion } from "framer-motion";

export const GridTable = styled.table`
  border-collapse: separate;
  border-spacing: 10px;
  width: ${CAMERA_VIEW_WIDTH - 10}vw;
  height: ${CAMERA_VIEW_HEIGHT - 10}vh;
`;

const flash = keyframes`
  0% {
    background-color: currentColor;
    opacity: 1;
  }
  100% {
    background-color: white;
    opacity: 0.4;
  }
`;

const rotation_481 = keyframes`
    0% {
    transform: rotateZ(0deg);
    }
    100% {
    transform: rotateZ(360deg);
    }
`;

export const GridCell = styled(motion.td)<{ flashcolor: string }>`
  position: relative;
  border: 4px solid ${(props) => props.flashcolor};
  text-align: center;
  vertical-align: middle;
  color: ${(props) => props.flashcolor};
  background-color: white;
  opacity: 0.5;
  cursor: pointer;
  border-radius: 10px;

  &.flash {
    animation: ${flash} 0.5s;
  }

  &.gameover {
    border: 4px solid black;
    background-color: black;
    opacity: 1;
    z-index: 1000;
  }
`;
