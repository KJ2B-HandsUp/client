import { styled } from "styled-components";
import { NavLink } from "react-router-dom";

export const HomePageWrapper = styled.div`
  margin-top: 15vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  height: 80vh;
`;

export const TopLeftButton = styled(NavLink)`
  position: fixed;
  top: 40px;
  left: 40px;
  padding: 20px;
  background-color: #ffffff;
  opacity: 0.8;
  text-decoration: none;
  border-radius: 50%;
  cursor: pointer;
  &:hover {
    background-color: #007bff;
    color: #ffffff;
  }
`;
