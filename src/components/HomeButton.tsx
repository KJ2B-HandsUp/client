import { HomeButtonWrapper } from "../styled/home.styled";
import { AiOutlineHome } from "react-icons/ai";
import { playBtnAudio, playHoverBtnAudio } from "../utils/audio";
import { motion } from "framer-motion";

export default function HomeButton() {
  return (
    <motion.div onHoverStart={playHoverBtnAudio}>
      <HomeButtonWrapper to="/main" onClick={playBtnAudio}>
        <AiOutlineHome size="30" color="white" />
      </HomeButtonWrapper>
    </motion.div>
  );
}
