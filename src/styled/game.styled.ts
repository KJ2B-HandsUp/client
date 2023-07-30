import styled from "styled-components";

export const GameContainer = styled.div`
  position: relative;
  user-select: none;
`;

export const MyCameraView = styled.div`
  transform-origin: left;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
`;
