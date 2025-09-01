import React, { useState } from "react";
import { useLoginMutation } from "../Services/authapi";
import { Link,useNavigate } from "react-router-dom"; // Make sure you are using react-router
import { useDispatch } from "react-redux";
import { setToken } from "../Services/authSlice";

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate=useNavigate();
  const dispatch = useDispatch();
  const [loginUser, { isLoading, error }] = useLoginMutation();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await loginUser(formData).unwrap();
      console.log("Login Success:", result);
      dispatch(setToken(result.accessToken));
      navigate('/');
    } catch (err) {
      console.error("Login Failed:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: "300px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Login</h2>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        style={{ width: "100%", padding: "8px", margin: "10px 0" }}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        style={{ width: "100%", padding: "8px", margin: "10px 0" }}
        required
      />
      <button
        type="submit"
        disabled={isLoading}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>
      {error && <p style={{ color: "red" }}>Login failed</p>}
      
      {/* Register Link */}
      <p style={{ textAlign: "center", marginTop: "15px" }}>
        Don't have an account?{" "}
        <Link to="/register" style={{ color: "#4CAF50", textDecoration: "none" }}>
          Register
        </Link>
      </p>
    </form>
  );
}
