import { RankingPageWrapper } from "../styled/ranking.styled";
import { useEffect } from "react";
import HomeButton from "../components/HomeButton";

export default function RankingPage() {
  useEffect(() => {
    fetch(`${import.meta.env.VITE_LOGINSERVER_IP}/scan`)
      .then((res) => console.log(res))
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      <RankingPageWrapper>
        <HomeButton />
        <h2>This is Ranking Page.</h2>
      </RankingPageWrapper>
    </>
  );
}
