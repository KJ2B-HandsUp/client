import { TopLeftButton } from "../styled/home.styled";
import { AiOutlineHome } from "react-icons/ai";
import { playBtnAudio } from "../utils/audio";

export default function HomeButton() {
  return (
    <TopLeftButton to="/main" onClick={playBtnAudio}>
      <AiOutlineHome size="30" color="black" />
    </TopLeftButton>
  );
}
