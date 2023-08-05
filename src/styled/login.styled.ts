import { styled } from "styled-components";

export const LoginPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;
`;

export const VideoBackground = styled.video`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
`;

export const TitleWrapper = styled.div`
  position: fixed;
  font-family: "establishRetrosansOTF";
  text-transform: uppercase;
  display: block;
  font-size: 92px;
  color: #ffffffce;
  text-shadow:
    0 8px 9px #010300,
    0px -2px 1px #ffffff;
  font-weight: bold;
  letter-spacing: -4px;
  text-align: center;
  top: 10%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 20px;
`;
