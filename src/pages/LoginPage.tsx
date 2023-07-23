import { NavLink } from "react-router-dom";
import styled from "styled-components";

const LoginPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: 20px;
`;

export default function LoginPage() {
  return (
    <LoginPageWrapper>
      <h1>Put Your Hands Up</h1>
      <NavLink to="/home">
        <img alt="카카오 로그인" src="/kakao_login_medium.png" />
      </NavLink>
    </LoginPageWrapper>
  );
}
