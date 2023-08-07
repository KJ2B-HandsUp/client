import { styled } from "styled-components";

export const UserProfileWrapper = styled.div`
  position: fixed;
  display: flex;
  top: 40px;
  right: 40px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const UserImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
`;

export const UserNickname = styled.div`
  font-size: 14px;
  color: #fff;
`;
