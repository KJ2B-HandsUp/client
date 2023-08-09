import styled from "styled-components";
import { motion } from "framer-motion";

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

export const Input = styled.input`
  max-width: 250px;
  padding: 10px;
  font-size: 17px;
  color: black;
  border-top-left-radius: 0.5em;
  border-bottom-left-radius: 0.5em;
  border: 2px solid #fff;
  margin-right: -10px;
`;

export const CreateButton = styled.button`
  border: none;
  background-color: #1363df;
  text-decoration: none;
  padding: 13px;
  font-size: 17px;
  color: #fff;
  border-top-right-radius: 0.5em;
  border-bottom-right-radius: 0.5em;
  cursor: pointer;
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
