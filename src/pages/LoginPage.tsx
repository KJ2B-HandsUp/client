import { NavLink } from "react-router-dom";
import styled from "styled-components";

const LoginPageWrapper = styled.div`
  display: flex;
  background-color: #212529;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: 20px;
`;

export default function LoginPage() {
  return (
    <>
      <LoginPageWrapper>
        <h1
          style={{
            fontFamily: "Ramche",
            color: "#ffffff",
            fontWeight: 700,
            marginBottom: 50,
          }}
        >
          손 들어
        </h1>
        <NavLink to="/home">
          <img alt="카카오 로그인" src="/kakao_login_medium.png" />
        </NavLink>
      </LoginPageWrapper>
    </>
  );
}
