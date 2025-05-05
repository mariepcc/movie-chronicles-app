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
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<PersistLogin />}>
          <Route index exact element={<Home />}></Route>
          <Route path="/auth">
            <Route path="login" element={<Login />}></Route>
            <Route path="register" element={<Register />}></Route>
            <Route element={<AuthMiddleware />}>
              <Route path="user" element={<User />} />
              <Route path="discover" element={<Discover />} />
              <Route path="watchlist" element={<Watchlist />} />
              <Route path="watched" element={<Watched />} />
              <Route path="recommended" element={<Recommended />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" />}></Route>
      </Routes>
    </>
  );
}

export default App;
