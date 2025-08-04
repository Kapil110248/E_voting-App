import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const [voter, setVoter] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/voter/me", { withCredentials: true })
      .then((res) => {
        setVoter(res.data.voter);
        setTimeout(() => {
          navigate("/voter/dashboard");
        }, 3000); // ⏱️ 3 seconds delay
      })
      .catch(() => navigate("/voter/login"));
  }, [navigate]);

  if (!voter) return null;

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
          alt="Success"
          className="mb-4"
          style={{ width: "100px" }}
        />
        <h2 className="text-success">Welcome, {voter.name}!</h2>
        <p className="mb-2">You have successfully logged in.</p>
        <p className="text-muted">Redirecting to Dashboard...</p>
      </div>
    </div>
  );
};

export default Success;
