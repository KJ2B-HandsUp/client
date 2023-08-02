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
  }
  100% {
    background-color: transparent;
  }
`;

export const GridCell = styled.td`
  border: 2px solid ${(props) => props.flashcolor};
  border-radius: 15px;
  text-align: center;
  vertical-align: middle;
  transition: background-color 0.5s;
  color: ${(props) => props.flashcolor};

  &.flash {
    animation: ${flash} 0.5s;
  }
`;
