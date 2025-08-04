import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredBtn, setHoveredBtn] = useState(null);

  const links = [
    { name: "Campaigns", path: "/admin/create-campaign", icon: "🗳" },
    { name: "Candidates", path: "/admin/add-candidates", icon: "👤" },
    { name: "Results", path: "/admin/results", icon: "📊" },
    { name: "Logout", path: "/admin/login", icon: "🚪" },
  ];

  const handleClick = async (link) => {
    if (link.name === "Logout") {
      try {
        await axios.get("http://localhost:4000/api/admin/logout", {
          withCredentials: true,
        });
        navigate("/admin/login");
      } catch (err) {
        console.error("Logout failed:", err);
      }
    } else {
      navigate(link.path);
    }
  };

  return (
    <nav
      className="bg-success text-white w-100 py-3 shadow-sm position-fixed top-0 start-0 z-3"
      style={{ zIndex: 1030 }}
    >
      <div className="container d-flex justify-content-between align-items-center flex-wrap">
        <h4 className="fw-bold mb-2 mb-md-0 d-flex align-items-center gap-2">
          🧑‍💻 eVote Control Hub
        </h4>

        <div className="d-flex flex-wrap gap-3">
          {links.map((link, idx) => (
            <div key={idx} className="position-relative text-center">
              <button
                onClick={() => handleClick(link)}
                onMouseEnter={() => setHoveredBtn(idx)}
                onMouseLeave={() => setHoveredBtn(null)}
                className={`btn btn-sm px-3 py-2 rounded-pill fw-semibold ${
                  location.pathname === link.path
                    ? "bg-white text-success border border-light"
                    : "btn-outline-light text-white"
                }`}
                style={{
                  transition: "all 0.3s ease",
                  boxShadow:
                    hoveredBtn === idx ? "0px 4px 12px rgba(255,255,255,0.4)" : "none",
                }}
              >
                {link.icon}
              </button>

              {hoveredBtn === idx && (
                <div
                  className="position-absolute top-100 start-50 translate-middle-x text-white small mt-1 px-2 py-1 rounded"
                  style={{
                    backgroundColor: "rgba(0,0,0,0.75)",
                    whiteSpace: "nowrap",
                    zIndex: 10,
                  }}
                >
                  {link.name}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
