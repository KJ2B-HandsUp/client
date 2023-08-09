import { styled,keyframes } from "styled-components";
import { NavLink } from 'react-router-dom';

export const LoginPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
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

//새로 추가한 코드
export const StyledNavLink = styled(NavLink)`
text-transform: uppercase;
display: block;
font-size: 65px;
color: #ffffffce;
text-shadow:
  0 8px 9px #010300,
  0px -2px 1px #ffffff;
font-weight: bold;
letter-spacing: -4px;
text-align: center;
border-radius: 20px;
margin-top : 20px;
&:hover{
  color : #00FF87;
}
`;
export const colors = {
    white: "#FEFEFE",
    brown: "#362100"
};


export const Card = styled.section`
  backdrop-filter: blur(10px);
  background-color: rgba(0,0,0);
  border: 1px solid rgba(225, 225, 225, 0.18);
  border-radius: 15px;
  box-shadow: 0 10px 35px 0;
  color: ${colors.white};
  overflow: hidden;
  padding: 20px 30px 50px 30px;
  position: relative;
  text-align: center;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;


const ripple = keyframes`
  0% {
    background-color: transparent;
  }

  30% {
    background-color: var(--cell-color);
  }

  60% {
    background-color: transparent;
  }

  100% {
    background-color: transparent;
  }
`;

export const Loader = styled.div`
  --cell-size: 150px;
  --cell-spacing: 10px;
  --cells: 3;
  --total-size: calc(var(--cells) * (var(--cell-size) + 2 * var(--cell-spacing)));
  display: flex;
  flex-wrap: wrap;
  width: var(--total-size);
  height: var(--total-size);
`;

export const Cell = styled.div`
  flex: 0 0 var(--cell-size);
  margin: var(--cell-spacing);
  background-color: transparent;
  box-sizing: border-box;
  border-radius: 4px;
  animation: 1.5s ${ripple} ease infinite;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  &.d-1 {
    animation-delay: 100ms;
  }

  &.d-2 {
    animation-delay: 200ms;
  }

  &.d-3 {
    animation-delay: 300ms;
  }

  &.d-4 {
    animation-delay: 400ms;

  }

  

  &:nth-child(1) {
    --cell-color: #00FF87;
  }

  &:nth-child(2) {
    --cell-color: #0CFD95;
  }

  &:nth-child(3) {
    --cell-color: #17FBA2;
  }

  &:nth-child(4) {
    --cell-color: #23F9B2;
  }

  &:nth-child(5) {
    --cell-color: #30F7C3;
  }

  &:nth-child(6) {
    --cell-color: #3DF5D4;
  }

  &:nth-child(7) {
    --cell-color: #45F4DE;
  }

  &:nth-child(8) {
    --cell-color: #53F1F0;
  }

  &:nth-child(9) {
    --cell-color: #60EFFF;
  }
`;