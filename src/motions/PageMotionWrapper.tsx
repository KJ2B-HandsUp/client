import { motion } from "framer-motion";

export default function PageMotionWrapper({ children }) {
  return (
    <motion.div
      initial={animate.initial}
      animate={animate.animate}
      exit={animate.exit}
      transition={{ duration: 0.5, type: "spring" }}
    >
      {children}
    </motion.div>
  );
}

const animate = {
  initial: {
    y: 500,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
  },
  exit: {
    y: 500,
    opacity: 0,
  },
};
