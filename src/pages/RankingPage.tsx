import { RankingPageWrapper } from "../styled/ranking.styled";
import { TopLeftButton } from "../styled/home.styled";
import { AiOutlineHome } from "react-icons/ai";
import { playBtnAudio } from "../utils/audio";
import { useEffect } from "react";

export default function RankingPage() {
  useEffect(() => {
    fetch(`${import.meta.env.VITE_LOGINSERVER_IP}/scan`)
      .then((res) => console.log(res))
      .catch((error) => console.log(error));
  }, []);

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
