import styled from "styled-components";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

export const RoomListPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const FormWrapper = styled.form`
  display: block;
  margin: 50px;
  gap: 20px;
`;

//새로운 FORM
export const InputGroup = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0 auto;
  justify-content: center;
  max-width: 160px;
`;

export const SubmitButton = styled.button`
  font-size: 14px;
  border: transparent;
  padding: 0.5em 2em;
  padding-top: 1em;
  box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24);
  background: linear-gradient(90deg, #fc466b 0%, #3f5efb 100%);
  border-radius: 0 5px 5px 0;
  transition: 0.3s;
  position: relative;
  color: black;
  justify-content: center;

  &:hover {
    background: linear-gradient(90deg, #fc466b 0%, #3f5efb 100%);
    cursor: pointer;
    color: white;
  }

  &:active {
    transform: translate(0em, 0.2em);
  }
`;

export const InputField = styled.input`
  background-color: white;
  border-radius: 5px 0 0 5px;
  border: none;
  width: 300px;
  padding-left: 8px;
  color: white;
  font-size: 14px;
  ::placeholder {
    color: rgb(184, 184, 184);
  }
`;

export const Overlay = styled(motion.div)`
  top: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

export const RoomListColor = ["black", "white"];

export const RoomWrapper = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  width: 280px;
  height: 280px;
  cursor: pointer;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    margin: auto;
    left: -10px;
    width: 300px;
    height: 300px;
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

export const MotionButton = styled(motion.button)`
  font-size: 20px;
  border: transparent;
  padding: 2em 0.5em;
  padding-top: 1em;
  box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24);
  background: linear-gradient(90deg, #fc466b 0%, #3f5efb 100%);
  border-radius: 0 5px 5px 0;
  transition: 0.3s;
  position: relative;
  color: black;
  justify-content: center;

  &:hover {
    background: linear-gradient(90deg, #fc466b 0%, #3f5efb 100%);
    cursor: pointer;
    color: white;
  }

  &:active {
    transform: translate(0em, 0.2em);
  }
`;
