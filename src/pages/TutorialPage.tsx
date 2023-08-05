import { TutorialPageWrapper } from "../styled/tutorial.styled";
import { TopLeftButton } from "../styled/home.styled";
import { AiOutlineHome } from "react-icons/ai";

export default function TutorialPage() {
  return (
    <>
      <TutorialPageWrapper>
        <TopLeftButton to="/main">
          <AiOutlineHome size="30" color="black" />
        </TopLeftButton>
        <h2>This is Tutorial Page.</h2>
      </TutorialPageWrapper>
    </>
  );
}
