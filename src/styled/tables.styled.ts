import styled, { keyframes } from "styled-components";
import { CAMERA_VIEW_WIDTH, CAMERA_VIEW_HEIGHT } from "../styled/game.styled";

const flash = keyframes`
  0% {
    background-color: red;
  }
  100% {
    background-color: transparent;
  }
`;

export const GridTable = styled.table`
  border-collapse: collapse;
  width: ${CAMERA_VIEW_WIDTH};
  height: ${CAMERA_VIEW_HEIGHT};
`;

export const GridCell = styled.td`
  border: 1px solid black;
  width: 12.5vw;
  height: 12.5vh;
  text-align: center;
  vertical-align: middle;
  transition: background-color 0.5s;

  &.flash {
    animation: ${flash} 0.5s;
  }
`;
