import MainLanding from "./components/common/MainLanding";
import ChatWindow from "./components/screens/ChatWindow";
import AuthLayout from "./components/common/AuthLayout";
import Profile from "./pages/Home/Profile/Profile";
import { Route, Routes } from "react-router";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AuthLayout>
            <Home />
          </AuthLayout>
        }
      >
        <Route index element={<MainLanding />} />
        <Route path="chat" element={<ChatWindow />} />
      </Route>
      <Route path="profile" element={<Profile />} />

      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
    </Routes>
  );
};

export default App;
