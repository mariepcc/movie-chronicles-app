import { Routes, Navigate, Route } from "react-router-dom";
import AuthMiddleware from "./middlewares/AuthMiddleware";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import User from "./pages/auth/User";
import Watchlist from "./pages/Watchlist";
import Watched from "./pages/Watched";
import Recommended from "./pages/Recommended";
import PersistLogin from "./components/PersistLogin";
import Navbar from "./components/Navbar";

function App() {
  const appStyle = {
    minHeight: "100vh", // full viewport height minimum
    backgroundImage: `url(https://img.freepik.com/premium-photo/dust-scratches-overlay-isolated-dust-scratches-ruined-surface-black-background_943071-27.jpg)`,
    backgroundSize: "cover",
    backgroundAttachment: "fixed",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex", // flex container to control layout
    flexDirection: "column",
  };

  const contentStyle = {
    flexGrow: 1, // content area grows to fill space
    display: "flex",
    flexDirection: "column",
  };

  return (
    <>
      <div style={appStyle}>
        <Navbar />
        <main style={contentStyle}>
          <Routes>
            <Route path="/" element={<PersistLogin />}>
              <Route index element={<Home />} />
              <Route path="auth">
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route element={<AuthMiddleware />}>
                  <Route path="user" element={<User />} />
                  <Route path="discover" element={<Discover />} />
                  <Route path="watchlist" element={<Watchlist />} />
                  <Route path="watched" element={<Watched />} />
                  <Route path="recommended" element={<Recommended />} />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;
