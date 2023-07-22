import "./index.css";
import GamePage from "./pages/GamePage";
import { useState } from "react";
import LoginPage from "./pages/LoginPage";

function App() {
  const [isLogined, setIsLogined] = useState<boolean>(false);

  return (
    <div className="App">
      <h1>Put Your Hands Up</h1>
      {isLogined ? <GamePage /> : <LoginPage onLogined={setIsLogined} />}
    </div>
  );
}

export default App;
