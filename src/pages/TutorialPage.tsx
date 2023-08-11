import { TutorialPageWrapper } from "../styled/tutorial.styled";
import { NavLink } from "react-router-dom";
import HomeButton from "../components/HomeButton";
import HoverCard from "../components/HoverCard";
import { CAMERA_VIEW_HEIGHT, CAMERA_VIEW_WIDTH } from "../styled/game.styled";
import CSSButtonComponent from "../components/CSSButtonComponent";

export default function TutorialPage() {
  return (
    <>
      <TutorialPageWrapper>
        <HomeButton />
        <HoverCard
          header={"Tutorial"}
          style={{
            width: `${CAMERA_VIEW_WIDTH + 10}vw`,
            height: "80vh",
          }}
        >
          <p>
            <h2>게임 방식</h2>
            화면을 치는 모션으로 런치패드를 칠 수 있습니다.
            <h2>대전 모드</h2>
            런치패드를 치는 순서를 최대한 많이 기억하는 암기력 대전 게임입니다.
            <br />
            상대방과 턴을 주고받으면서, 상대방이 쳤던 런치패드 순서를 기억하고
            따라친 후<br />한 칸을 더 치는 것으로 턴을 종료합니다.
            <h2>싱글 모드</h2>
            혼자서 런치패드를 조작할 수 있는 모드입니다.
            <br />
          </p>
          <NavLink
            to={`/sologame/tutorial`}
            style={{ color: "black", textDecoration: "none" }}
          >
            <CSSButtonComponent>Play!</CSSButtonComponent>
          </NavLink>
        </HoverCard>
      </TutorialPageWrapper>
    </>
  );
}
