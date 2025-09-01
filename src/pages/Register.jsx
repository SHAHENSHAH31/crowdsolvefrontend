import React, { useState } from "react";
import { useRegisterMutation } from "../Services/authapi";
import { Link ,useNavigate} from "react-router-dom"; // Make sure react-router-dom is installed

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate=useNavigate();
  const [registerUser, { isLoading, error }] = useRegisterMutation();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await registerUser(formData).unwrap();
      console.log("Register Success:", result);
      navigate('/')
    } catch (err) {
      console.error("Register Failed:", err);
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
      <h2 style={{ textAlign: "center" }}>Register</h2>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        style={{ width: "100%", padding: "8px", margin: "10px 0" }}
        required
      />
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
          backgroundColor: "#2196F3",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        {isLoading ? "Registering..." : "Register"}
      </button>
      {error && <p style={{ color: "red" }}>Register failed</p>}

      {/* Login Link */}
      <p style={{ textAlign: "center", marginTop: "15px" }}>
        Already have an account?{" "}
        <Link to="/" style={{ color: "#2196F3", textDecoration: "none" }}>
          Login
        </Link>
      </p>
    </form>
  );
}
