import { HomePageWrapper } from "../styled/home.styled";
import { pageItems } from "./MainPage";
import Sidebar from "../components/Sidebar";

export default function HomePage() {
  return (
    <>
      <Sidebar items={pageItems.slice(1)} />
      <HomePageWrapper></HomePageWrapper>
    </>
  );
}
