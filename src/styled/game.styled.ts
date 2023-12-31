import styled from "styled-components";

export const CAMERA_VIEW_WIDTH = 40;
export const CAMERA_VIEW_HEIGHT = 80;

export const colorList = [
  "#f43f5e",
  "#3b82f6",
  "#921DFF",
  "gold",
  "#FF90D4",
  "red",
  "green",
];

export const DefaultProfile =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw0NDg0NDQ8PDQ0NDw0NDg0NDQ8NDg4NFREWFhQdExMYHCghGBolGxUTITEhJSkrLi4wFx8zODMsNygtLisBCgoKDg0OGhAQGC4dICU3KystKysrLS0rLS0tLSstLS0tLS0tLS0rLS0rLS0tLSstLS0tKy0tKzcrKysrKy0rN//AABEIAOAA4QMBIgACEQEDEQH/xAAaAAEBAQADAQAAAAAAAAAAAAAAAQUCAwQG/8QAMBABAAIAAggDBwUBAAAAAAAAAAECAwQFERIhMUFRcTJSYSKBkaGxweETM3KS0UL/xAAZAQEBAQEBAQAAAAAAAAAAAAAAAQMCBAX/xAAeEQEBAQEAAwADAQAAAAAAAAAAAQIRAzFBEiFRE//aAAwDAQACEQMRAD8A+rBX0XzUFQUFQQFAQUBBQEFAQUBBQEFAQVABUABQQAAABUUAABFAAAAAAAAAAAAAAAAAAAAAAAQAAAVRAFEUAAQAAAAAAAAAAAAEBVEAUQBRAAAQAFAAFRQABAAAAAcqUtbdWJntGt31yGLPKI7zCdkWS15h6p0fi9IntaHRiYN6eKsx66t3xOw5Y4AKgACACgAAAAAAAgAKAAKigACAAER0aOV0fHHE/r/rno7K7MbdvFPD0h7WWt/I2zj7UrWIjVEao6QoM2gADx5nIVtvp7Nun/M/4y71mszExqmOT6B5s7loxK648ccPX0d53/WesfYxwGzFABQAAAAAAAQAFAAFRQABB3ZPC271jlxntDpaGia+O3aHOryOsztaIDB6AAAAAAGRpLC2b644X3+/m8rU0rXXSJ6W+Ustvi9jDc5UAdOQAAAAAAAAAAABUUAAQaeifDfvH0Zj3aKvqtavmjXHeHO/TvHtpgMG4AAAAADy6T/bnvVkNLS191a9Z2ma2x6Yb9oA7cgAAAAAAAgAKAAKigACDlhYk1tFo4xOtxBW/h3i0RaOExrcmPks1+nOqd9J4+ktetomImJ1xPCYYazxvnXVAcugAAmdW+eEcRl5/N7XsU8POev4WTrnV5HnzWN+pebcuEdnUDdggCgAAAAAAAIACgACooAAgAA7cDMXw59md3Os8JdQitXC0jSfFE1n4w9FcxhzwvX4wwkc3EdzyVvzjUjjav8AaHRi5/Drwnan0/1jqn+cL5K9GYzd8Td4a+WPu84O5OOLegCogAoAAAAAAAIACgACooAAgO7L5a2Jw3RztPBp4GTpTfq2rdZ+zm6kdzNrMwspiX4V1R1ndD14ejPNb3Vj7y0Bnd1pMR5a6Pwo5TPeZ+znGTwvJHzd457XX4x0zlMLyR83C2Qwp5THaZekO0/GM/E0ZH/NvdaHlxcniU4xrjrXe2h1N1zcR88NrHylL8Y1T5o3SzMzlbYfHfXzR92k1KzuLHnAdOQAAAAAAAQAFAAFRQHryWT2/atup052/Djkct+pOufBXj6z0bERqZ71z9R3jPf3UrERGqI1RHKFBk2AAAAAAAACY17p4SAMvPZHZ13p4eden4eF9GyNIZXYnar4Z4x5Za418rLWfseMBozAAAAABAAUAAcqUm0xWOMzqhxe/RWFrmbzy3R35pbyLJ2tDBw4pWKxy+cuYPO9AAAAAAAAAAAACuOJSLRNZ4TulyBHz+PhTS01nl84cGnpbC3ReOW6e3JmN83sYanKAOkAAABAAUAAbeRps4dfWNqfexIh9FWNURHSNTPyNPH7AGTUAAAAAAAAAAABQBHXj02qWr1ifiwH0b5/MV1XvHS0/Vp46z24ANWYAAAIACgAOWF4q/yj6voHz+F4q/yr9X0LLyNfGgDNoAAAAAAAAAAAAoAgw89+7fu3GHnv3b9/s78ftxv06AGzIAAAB//Z";

export const GamePageWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
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
