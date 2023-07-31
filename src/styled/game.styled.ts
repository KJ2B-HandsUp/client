import styled from "styled-components";

export const GameContainer = styled.div`
  position: relative;
  user-select: none;
  width: 20rem;
  height: 20rem;
  padding: 16px;
  text-align: center;
`;

export const MyCameraView = styled.div`
  transform-origin: left;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
`;

export const CardListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 16px;

  @media (max-width: 400px) {
    grid-template-columns: 1fr; // 작은 화면에서는 1열로 보여줍니다.
  }
`;
