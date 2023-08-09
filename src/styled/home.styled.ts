import { styled } from "styled-components";
import { NavLink } from "react-router-dom";

export const HomePageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  height: 80vh;
`;

export const HomeButtonWrapper = styled(NavLink)`
  position: relative;
  background-color: #000;
  display: flex;
  align-items: center;
  color: white;
  flex-direction: column;
  justify-content: center;
  width: 60px;
  height: 60px;
  cursor: pointer;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    margin: auto;
    left: -4px;
    top: -2px;
    width: 68px;
    height: 68px;
    background: linear-gradient(-45deg, #e81cff 0%, #40c9ff 100%);
    z-index: -1;
    pointer-events: none;
    transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  &::after {
    content: "";
    z-index: -2;
    position: absolute;
    inset: 0;
    background: linear-gradient(-45deg, #fc00ff 0%, #00dbde 100%);
    transform: translate3d(0, 0, 0) scale(0.95);
    filter: blur(20px);
  }

  &:hover::after {
    filter: blur(30px);
  }

  &:hover::before {
    transform: rotate(-180deg);
  }

  &:active::before {
    scale: 0.7;
  }
`;
