import {
  LoginPageWrapper,
  VideoBackground,
  TitleWrapper,
  Card,
  Loader,
  Cell,
  StyledNavLink,
} from "../styled/login.styled";
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
        <source src="/client/back.mp4" type="video/mp4" />
      </VideoBackground>
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
          <img
            src="/client/kakao_login_medium.png"
            onClick={requestLogin}
            style={{ cursor: "pointer" }}
          />
        </Card>
      </LoginPageWrapper>
    </>
  );
}
