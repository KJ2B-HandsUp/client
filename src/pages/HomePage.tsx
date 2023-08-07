import { HomePageWrapper } from "../styled/home.styled";
import { pageItems } from "./MainPage";
import Sidebar from "../components/Sidebar";
import { TitleWrapper } from "../styled/login.styled";

export default function HomePage() {
  return (
    <>
      <Sidebar items={pageItems.slice(1)} />
      <header>
        <TitleWrapper>Hands Up!</TitleWrapper>
      </header>
      <HomePageWrapper></HomePageWrapper>
    </>
  );
}
