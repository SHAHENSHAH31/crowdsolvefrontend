import './App.css'
import {  Routes, Route,useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setToken, clearToken } from './Services/authSlice.js';
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from './pages/Dashdoard.jsx';
import ProblemSolutionsPage from './pages/ProblemSolutionsPage.jsx';


function App() {
   const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.auth.accessToken);

 useEffect(() => {
  if (!accessToken) {
    (async () => {
      try {
        const res = await fetch("https://crowsolvebackend.onrender.com/auth/refresh", {
          method: "POST",
          credentials: "include",
        });

        if (!res.ok) {
          
          throw new Error("Refresh failed");
        }

        const data = await res.json();
        dispatch(setToken(data.accessToken));
        navigate("/dashboard");
      } catch (err) {
        dispatch(clearToken());
        navigate("/");
      }
    })();
  }
}, [accessToken, dispatch, navigate]);

  
    return (
   
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/problems/:id" element={<ProblemSolutionsPage />} />
      </Routes>
    
  );
  
}

export default App
