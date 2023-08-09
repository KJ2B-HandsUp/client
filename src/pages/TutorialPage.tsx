import { TutorialPageWrapper } from "../styled/tutorial.styled";
import { NavLink } from "react-router-dom";
import HomeButton from "../components/HomeButton";

export default function TutorialPage() {
  return (
    <>
      <TutorialPageWrapper>
        <HomeButton />
        <div
          style={{
            display: "flex",
            marginTop: "10px",
            flexDirection: "column",
            backgroundColor: "white",
            color: "black",
            padding: "30px",
            borderRadius: "2%",
          }}
        >
          <h1>튜토리얼</h1>
          <br />
          <h2>게임 방식</h2>
          <p>화면을 치는 모션으로 런치패드를 칠 수 있습니다.</p>
          <br />
          <br />
          <h2>대전 모드</h2>
          <p>
            런치패드를 치는 순서를 최대한 많이 기억하는 암기력 대전 게임입니다.
            <br />
            상대방과 턴을 주고받으면서, 상대방이 쳤던 런치패드 순서를 기억하고
            따라친 후<br />한 칸을 더 치는 것으로 턴을 종료합니다.
          </p>
          <br />
          <br />
          <h2>싱글 모드</h2>
          <p>혼자서 런치패드를 조작할 수 있는 모드입니다.</p>
          <br />

          <NavLink
            to={`/sologame/tutorial`}
            style={{ color: "black", textDecoration: "none" }}
          >
            <button>Play!</button>
          </NavLink>
        </div>
      </TutorialPageWrapper>
    </>
  );
}
