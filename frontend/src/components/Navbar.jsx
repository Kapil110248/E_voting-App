// components/Navbar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm position-fixed w-100">
      <div className="container">
 <span className="navbar-brand fw-bold text-success fs-4">🗳 eVote</span>
        <div>
          <Link
            to="/voter/login"
            className={`btn me-2 ${
              location.pathname === "/voter/login" ? "btn-success" : "btn-outline-success"
            }`}
          >
            Voter Login
          </Link>
          <Link
            to="/admin/login"
            className={`btn ${
              location.pathname === "/admin/login" ? "btn-success" : "btn-outline-success"
            }`}
          >
            Admin Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
