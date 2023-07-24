import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import "bootstrap/dist/css/bootstrap.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home/*" element={<MainPage />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
      <Outlet />
    </div>
  );
}

export default App;
