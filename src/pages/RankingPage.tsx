import { RankingPageWrapper } from "../styled/ranking.styled";
import { TopLeftButton } from "../styled/home.styled";
import { AiOutlineHome } from "react-icons/ai";
import { playBtnAudio } from "../utils/audio";

export default function RankingPage() {
  return (
    <>
      <RankingPageWrapper>
        <TopLeftButton to="/main" onClick={playBtnAudio}>
          <AiOutlineHome size="30" color="black" />
        </TopLeftButton>
        <h2>This is Ranking Page.</h2>
      </RankingPageWrapper>
    </>
  );
}
