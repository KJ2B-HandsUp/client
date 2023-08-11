import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import CSSButtonComponent2 from "./CSSButtonComponent2";

const Backdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Countdown = styled(motion.div)`
  font-size: 5rem;
  color: white;
`;

export default function CountdownModal({ onClick }: { onClick: () => void }) {
  const [isVisible, setIsVisible] = useState(false);
  const [count, setCount] = useState(3);

  const handleClick = () => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount <= 0) {
          clearInterval(interval);
          setIsVisible(false);
          onClick();
          return 3;
        }
        return prevCount - 1;
      });
    }, 1000);
  };

  return (
    <>
      <CSSButtonComponent2 onClick={handleClick}>Start</CSSButtonComponent2>
      <AnimatePresence>
        {isVisible && (
          <Backdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Countdown
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              {count}
            </Countdown>
          </Backdrop>
        )}
      </AnimatePresence>
    </>
  );
}
