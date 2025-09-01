import './App.css'
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setToken, clearToken } from './Services/authSlice.js';

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from './pages/Dashdoard.jsx';
import ProblemSolutionsPage from './pages/ProblemSolutionsPage.jsx';
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.auth.accessToken);

  // Try to refresh token on first load
  useEffect(() => {
    if (!accessToken) {
      (async () => {
        try {
          const res = await fetch("https://crowsolvebackend.onrender.com/auth/refresh", {
            method: "POST",
            credentials: "include",
          });

          if (!res.ok) throw new Error("Refresh failed");

          const data = await res.json();
          dispatch(setToken(data.accessToken));
        } catch (err) {
          dispatch(clearToken());
        }
      })();
    }
  }, [accessToken, dispatch]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/problems/:id"
        element={
          <ProtectedRoute>
            <ProblemSolutionsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
