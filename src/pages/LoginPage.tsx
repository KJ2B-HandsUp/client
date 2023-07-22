import "../index.css";

type LoginProps = {
  onLogined: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function LoginPage({ onLogined }: LoginProps) {
  return (
    <div className="loginBtn">
      <h2>Login</h2>
      <img
        alt="카카오 로그인"
        src="/kakao_login_medium.png"
        onClick={() => onLogined(true)}
      />
    </div>
  );
}
