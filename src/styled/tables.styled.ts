import styled, { keyframes } from "styled-components";
import { CAMERA_VIEW_WIDTH, CAMERA_VIEW_HEIGHT } from "../styled/game.styled";

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
    background-color: black;
    opacity: 0.4;
  }
`;

export const GridCell = styled.td`
  border: 2px solid ${(props) => props.flashcolor};
  text-align: center;
  vertical-align: middle;
  transition: background-color 0.5s;
  color: ${(props) => props.flashcolor};
  background-color: black;
  opacity: 0.4;
  cursor: pointer;

  &.flash {
    animation: ${flash} 0.5s;
  }
`;
