import styled from 'styled-components';
import tetris_banner from "/tetris_banner2.png";


export const RoomListPageWrapper = styled.div`
  flex-direction: column;
  background-color: #000000;
  background-attachment: fixed;
  padding-left: 400px;
  top: 0;
`;

export const Banner = styled.div`
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${tetris_banner});
  background-size: cover;
  height: 900px;
  width: 1500px;
`;