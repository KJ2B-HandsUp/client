import { styled } from "styled-components";

export const UserProfileWrapper = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const UserImage = styled.img`
  width: 7vh;
  height: 7vh;
  border-radius: 50%;
  border: 3px solid white;
  margin-bottom: 10px;
`;

export const UserNickname = styled.div`
  font-size: 20px;
  color: #fff;
`;
