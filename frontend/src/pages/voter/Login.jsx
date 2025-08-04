import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VoterLogin = () => {
  const [voterId, setVoterId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ If already logged in, redirect to dashboard
  useEffect(() => {
    const checkVoterLogin = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/voter/me", {
          withCredentials: true,
        });

        if (res.data?.voter) {
          navigate("/voter/dashboard");
        }
      } catch (err) {
        // Not logged in
      }
    };

    checkVoterLogin();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:4000/api/voter/login",
        { voterId, password },
        { withCredentials: true }
      );

      if (res.data.success) {
        navigate("/voter/success"); // ✅ Redirect to Success page instead of Dashboard
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow-lg p-4 bg-white rounded" style={{ maxWidth: 420, width: "100%" }}>
        <h2 className="text-center text-success fw-bold mb-4">🗳 Voter Login</h2>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Voter ID</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your voter ID"
              value={voterId}
              onChange={(e) => setVoterId(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="alert alert-danger text-center py-2 mb-3">{error}</div>}

          <button type="submit" className="btn btn-success w-100 fw-semibold" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VoterLogin;
