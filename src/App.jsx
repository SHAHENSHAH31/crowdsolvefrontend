import './App.css'
import { Routes, Route } from "react-router-dom";


import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from './pages/Dashdoard.jsx';
import ProblemSolutionsPage from './pages/ProblemSolutionsPage.jsx';


function App() {
  

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          
            <Dashboard />
         
        }
      />
      <Route
        path="/problems/:id"
        element={
         
            <ProblemSolutionsPage />
          
        }
      />
    </Routes>
  );
}

export default App;
