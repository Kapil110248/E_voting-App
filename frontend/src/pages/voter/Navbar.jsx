import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await axios.post("http://localhost:4000/api/voter/logout", {}, { withCredentials: true });
    navigate("/voter/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success px-4">
      <div className="container-fluid">
        <span className="navbar-brand fw-bold">🗳 eVote</span>
        <button
          className="btn btn-outline-light"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
