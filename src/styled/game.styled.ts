import styled from "styled-components";

export const CAMERA_VIEW_WIDTH = 40;
export const CAMERA_VIEW_HEIGHT = 85;

export const colorList = ["red", "orange", "blue", "violet"];

export const GamePageWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100vw;
  height: 90vh;
`;

export const GameWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const BoardWrapper = styled.div`
  width: ${CAMERA_VIEW_WIDTH}vw;
  height: ${CAMERA_VIEW_HEIGHT}vh;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const MyCameraView = styled.div`
  overflow: hidden;
  position: absolute;
  width: ${CAMERA_VIEW_WIDTH}vw;
  height: ${CAMERA_VIEW_HEIGHT}vh;
`;

export const CardListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 16px;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr; // 작은 화면에서는 1열로 보여줍니다.
  }
`;

export const PlayerIdContainer = styled.div`
  margin: 10px;
  font-size: 5vmin;
  color: white;
`;
