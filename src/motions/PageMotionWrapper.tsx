import { motion } from "framer-motion";

export default function PageMotionWrapper({ children }) {
  return (
    <motion.div
      initial={animate.initial}
      animate={animate.animate}
      exit={animate.exit}
    >
      {children}
    </motion.div>
  );
}

const animate = {
  initial: {
    transform: `translateY(100px)`,
    opacity: 0,
  },
  animate: {
    transform: `translateY(0px)`,
    opacity: 1,
  },
  exit: {
    transform: `translateY(-100px)`,
    opacity: 0,
  },
};
