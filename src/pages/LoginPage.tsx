import { NavLink } from "react-router-dom";
import {
  LoginPageWrapper,
  VideoBackground,
  TitleWrapper,
  Card,
  Loader,
  Cell,
  StyledNavLink,
} from "../styled/login.styled";
//import Sidebar from "../components/Sidebar";
import { SidebarItemType } from "../types/sidebar.type";
import { playBtnAudio } from "../utils/audio";

export const items: SidebarItemType[] = [
  {
    name: "Login",
    path: "login",
  },
];

export default function LoginPage() {
  const requestLogin = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_LOGINSERVER_IP}/authorize`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Origin: "https://kimcookieya.shop",
        },
      },
    );
    console.log(response);
    const data = await response.json();
    console.log(data);
    window.location.href = data.redirectUrl;
  };

  return (
    <>
      <VideoBackground autoPlay loop muted playsInline>
        <source src="/back.mp4" type="video/mp4" />
      </VideoBackground>
      {
        //<Sidebar items={items} />
      }
      <LoginPageWrapper>
        <header>
          <TitleWrapper>Hands Up!</TitleWrapper>
        </header>
        <Card>
          <Loader>
            <Cell className="d-0" />
            <Cell className="d-1" />
            <Cell className="d-2" />

            <Cell className="d-1" />
            <Cell className="d-2" />

            <Cell className="d-2" />
            <Cell className="d-3" />

            <Cell className="d-3" />
            <Cell className="d-4" />
          </Loader>

          <StyledNavLink to="/main" onClick={playBtnAudio}>
            LOGIN
          </StyledNavLink>
        </Card>
        {/*기존 코드 <button onClick={requestLogin}>카카오 로그인</button>
          <NavLink to="/main" onClick={playBtnAudio}>
            <img alt="카카오 로그인" src="/kakao_login_medium_wide.png"/>
          </NavLink> */}
      </LoginPageWrapper>
    </>
  );
}
