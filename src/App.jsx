// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Components/Context/AuthContext";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import ForgotPassword from "./Components/Auth/Forgetpassword";
import Dashboard from "./Components/Page/Dashboard";
import Home from "./Components/Page/Home";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
