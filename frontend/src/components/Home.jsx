import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="bg-light text-dark py-5">
        <div className="container d-flex flex-column-reverse flex-lg-row align-items-center justify-content-between gap-4">
          <div className="col-lg-6 text-center text-lg-start">
            <h1 className="display-4 fw-bold mb-3 text-success">Empower Your Voice!</h1>
            <p className="lead">
              Join the digital democracy revolution. Cast your vote securely, anytime, anywhere.
              One click can make a difference.
            </p>
            <button
              className="btn btn-success btn-lg mt-3 px-4 py-2 transition"
              onClick={() => navigate("/voter/login")}
              style={{ transition: "all 0.3s ease-in-out" }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#218838";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#28a745";
              }}
            >
              🚀 Get Started
            </button>
          </div>

          <div className="col-lg-5 text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/10365/10365542.png"
              alt="e-voting"
              className="img-fluid"
              style={{ maxHeight: "320px" }}
            />
          </div>
        </div>
      </section>

      {/* Quote & Features Section */}
    {/* Quote & Features Section */}
<section className="bg-white text-center py-5">
  <div className="container">
    <h2 className="text-success fw-bold mb-4">🗳️ Why Vote Online?</h2>
    <p className="lead mb-5">
      "Voting is the expression of our commitment to ourselves, one another, this country,
      and this world." – Sharon Salzberg
    </p>

    <div className="row">
      {[
        {
          title: "Fast & Secure",
          text: "Vote with confidence and ease. Our system ensures integrity and encryption.",
          border: "success",
          color: "success",
          icon: "https://cdn-icons-png.flaticon.com/512/3064/3064197.png",
        },
        {
          title: "Accessible Anywhere",
          text: "From cities to villages, vote from your mobile, laptop or any device.",
          border: "primary",
          color: "primary",
          icon: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
        },
        {
          title: "Transparency First",
          text: "Real-time results. No fraud. No delay. Just fair elections.",
          border: "warning",
          color: "warning",
          icon: "https://cdn-icons-png.flaticon.com/512/5957/5957811.png",
        },
      ].map((feature, idx) => (
        <div className="col-md-4 mb-4" key={idx}>
          <div
            className={`card border-${feature.border} h-100 shadow-sm p-3`}
            style={{
              transition: "all 0.3s ease-in-out",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)";
              e.currentTarget.style.transform = "translateY(-5px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div className="card-body text-center">
              <img
                src={feature.icon}
                alt={feature.title}
                className="mb-3"
                style={{ width: "60px", height: "60px" }}
              />
              <h5 className={`card-title text-${feature.color} fw-bold`}>{feature.title}</h5>
              <p className="card-text">{feature.text}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


      {/* Footer */}
      <footer className="bg-success text-white text-center py-4">
        <div className="container">
          <small className="fw-light">
            © 2025 <strong>eVote System</strong> | Designed for Smart Democracy
          </small>
        </div>
      </footer>
    </>
  );
};

export default Home;
