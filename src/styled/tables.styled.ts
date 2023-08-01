import styled, { keyframes } from "styled-components";

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
  width: 500px;
  height: 500px;
`;

export const GridCell = styled.td`
  border: 1px solid black;
  width: 125px;
  height: 125px;
  text-align: center;
  vertical-align: middle;
  transition: background-color 0.5s;

  &.flash {
    animation: ${flash} 0.5s;
  }
`;
