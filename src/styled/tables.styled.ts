import styled, { keyframes } from "styled-components";
import { CAMERA_VIEW_WIDTH, CAMERA_VIEW_HEIGHT } from "../styled/game.styled";

export const GridTable = styled.table`
  border-collapse: separate;
  border-spacing: 5px;
  width: ${CAMERA_VIEW_WIDTH};
  height: ${CAMERA_VIEW_HEIGHT};
`;

const flash = keyframes`
  0% {
    background-color: currentColor;
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
  }
  100% {
    background-color: transparent;
    opacity: 0;
    transform: scale(1);
  }
`;

export const GridCell = styled.td`
  border: 2px solid ${(props) => props.flashcolor};
  border-radius: 15px;
  text-align: center;
  vertical-align: middle;
  transition: background-color 0.5s;
  color: ${(props) => props.flashcolor};
  cursor: pointer;

  &.flash {
    animation: ${flash} 0.5s;
  }
`;
