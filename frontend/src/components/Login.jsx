// pages/AdminLogin.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [authType, setAuthType] = useState("login");
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (authType === "login") {
        const res = await axios.post(
          "http://localhost:4000/api/admin/login",
          { email: formData.email, password: formData.password },
          { withCredentials: true }
        );
        if (res.data.success) navigate("/admin/dashboard");
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          return;
        }
        const res = await axios.post("http://localhost:4000/api/admin/register", {
          fullname: formData.fullname,
          email: formData.email,
          password: formData.password,
        });
        if (res.data.success) {
          alert("Registered successfully! Please login.");
          setAuthType("login");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ maxWidth: 400, width: "100%" }}>
        <h4 className="text-center text-success mb-3">
          {authType === "login" ? "Admin Login" : "Admin Register"}
        </h4>

        <form onSubmit={handleSubmit}>
          {authType === "register" && (
            <input
              type="text"
              name="fullname"
              placeholder="Full Name"
              className="form-control mb-3"
              value={formData.fullname}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="form-control mb-3"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="form-control mb-3"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {authType === "register" && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="form-control mb-3"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          )}

          {error && <div className="text-danger text-center mb-3">{error}</div>}
          <button className="btn btn-success w-100">
            {authType === "login" ? "Login" : "Register"}
          </button>
        </form>

        <div className="text-center mt-3">
          {authType === "login" ? (
            <span>
              Don't have an account?{" "}
              <button
                className="btn btn-link p-0"
                onClick={() => setAuthType("register")}
              >
                Register
              </button>
            </span>
          ) : (
            <span>
              Already registered?{" "}
              <button
                className="btn btn-link p-0"
                onClick={() => setAuthType("login")}
              >
                Login
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
