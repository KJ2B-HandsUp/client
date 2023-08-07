import { motion, useAnimation } from "framer-motion";
import { useState } from "react";

export default function RoomCard({ children }) {
  const controls = useAnimation();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleButtonClick = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    controls.start({
      scale: [0, 1],
      opacity: [1, 0],
      transition: { duration: 0.5 },
    });

    setTimeout(() => {
      controls.stop();
      controls.set({ scale: 0, opacity: 1 }); // Reset to initial state
      setIsAnimating(false);
    }, 500);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <motion.div
        initial={{ scale: 0, opacity: 1 }}
        animate={controls}
        style={{
          position: "absolute",
          borderRadius: "50%",
          backgroundColor: "rgba(255, 0, 0, 0.5)",
          width: "100px",
          height: "100px",
          top: "50%",
          left: "50%",
          transformOrigin: "center",
          transform: "translate(-50%, -50%)",
        }}
      >
        {children}
      </motion.div>
      <button onClick={handleButtonClick}>Click Me</button>
    </div>
  );
}
