import { styled } from "styled-components";

export const RankingPageWrapper = styled.div`
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  align-items: center;
  font-size: 30px;
  color: white;
  height: 100vh;
`;

export const Card = styled.div`
  position: relative;
  width: 70vh;
  height: 100vh;
  background: #f00;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 0;

  &::before,

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 70vh;
    height: 100vh;
    background: linear-gradient(315deg, #03a9f4, #ff0058);
  }

  &::after {
    filter: blur(30px);
  }
`;

export const CustomTable = styled.table`
  border-collapse: separate;
  border-spacing: 10px;
  position: relative;
  z-index: 3; /* 뒤로 보내기 */
  width:70vh;
  height:100vh;;
`;

export const TableData = styled.td`
  position: relative;
  /* 추가 스타일링... */
`;

export const SubCard = styled.div`
  position: absolute;
  inset: 6px;
  background: rgba(0, 0, 0, 0.6);
  width: 68vh;
  height: 98vh;
`;

export const Box = styled.tr`
    display: flex,
    flexDirection: column,
    background: white,
    padding: 30px,
    borderRadius: 20%,
`;

export const Rank = styled.div`
  text-transform: uppercase;
  display: block;
  font-size: 6vh;
  color: #ffffffce;
  text-shadow:
    0 8px 9px #010300,
    0px -2px 1px #ffffff;
  font-weight: bold;
  letter-spacing: -4px;
  text-align: center;
  border-radius: 20px;
  margin-top: 4vh;`;
//margin-top: 50px;
//   margin-bottom: 20px;
//   background: rgba(100, 46, 254, 0.8);
//   padding: 0.6em 1.0em;
//   border: 2px solid black;
//   border-radius: 0.4em;