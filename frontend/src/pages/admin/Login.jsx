import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 🔐 Check if admin already logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/admin/me", {
          withCredentials: true,
        });

        if (res.data?.admin) {
          // Already logged in
          navigate("/admin/dashboard");
        }
      } catch (err) {
        // Not logged in – do nothing
      }
    };

    checkLoginStatus();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        const res = await axios.post(
          "http://localhost:4000/api/admin/login",
          {
            email: formData.email,
            password: formData.password,
          },
          { withCredentials: true }
        );
        if (res.data.success) {
          navigate("/admin/dashboard");
        }
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
          alert("Registration successful. Please login.");
          setIsLogin(true);
          setFormData({
            fullname: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center text-success mb-3">
          {isLogin ? "Admin Login" : "Admin Register"}
        </h3>

        {error && <div className="alert alert-danger text-center">{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>

          {!isLogin && (
            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                required
              />
            </div>
          )}

          <button type="submit" className="btn btn-success w-100">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <div className="text-center mt-3">
          {isLogin ? (
            <span>
              Don’t have an account?{" "}
              <button className="btn btn-link p-0" onClick={() => setIsLogin(false)}>
                Register
              </button>
            </span>
          ) : (
            <span>
              Already registered?{" "}
              <button className="btn btn-link p-0" onClick={() => setIsLogin(true)}>
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
