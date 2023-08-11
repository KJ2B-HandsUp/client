import styled, { keyframes } from "styled-components";
import { CAMERA_VIEW_WIDTH, CAMERA_VIEW_HEIGHT } from "../styled/game.styled";
import { motion } from "framer-motion";

export const GridTable = styled(motion.table)`
  border-collapse: separate;
  border-spacing: 10px;
  width: ${CAMERA_VIEW_WIDTH - 8}vw;
  height: ${CAMERA_VIEW_HEIGHT - 25}vh;
  margin-bottom: 50px;
`;

const flash = keyframes`
  0% {
    background-color: currentColor;
    opacity: 1;
  }
  100% {
    background-color: white;
    opacity: 0.5;
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
  border: 2px solid ${(props) => props.flashcolor};
  text-align: center;
  vertical-align: middle;
  color: ${(props) => props.flashcolor};
  background-color: white;
  opacity: 0.5;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: 0 0 20px ${(props) => props.flashcolor};

  &.flash {
    animation: ${flash} 0.7s;
    opacity: 1;
  }
`;
