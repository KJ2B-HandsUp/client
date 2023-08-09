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

export const TopLeftButton = styled(NavLink)`
  position: relative;
  padding: 20px;
  background-color: #ffffff;
  opacity: 0.8;
  text-decoration: none;
  border-radius: 50%;
  cursor: pointer;
  margin-bottom: 20px;
  &:hover {
    background-color: #007bff;
    color: #ffffff;
  }
`;
