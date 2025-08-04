import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "react-bootstrap-icons";

const Results = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/admin/results", {
          withCredentials: true,
        });
        setCampaigns(res.data.campaigns || []);
      } catch (err) {
        console.error("Error fetching results:", err);
        setError("Failed to load results.");
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="container py-5">
      {/* 🔙 Back Button */}
      <div
        className="mb-3 d-flex align-items-center"
        style={{ cursor: "pointer", width: "fit-content" }}
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="me-2 text-success" size={24} />
        <span className="fw-bold text-success">Back</span>
      </div>

      <h2 className="text-success text-center mb-4 fw-bold">📊 Election Results</h2>

      {error && <p className="text-danger text-center">{error}</p>}

      {campaigns.length === 0 ? (
        <p className="text-center text-muted">No results available yet.</p>
      ) : (
        campaigns.map((campaign) => {
          // winner candidate = max vote
          const sortedCandidates = [...campaign.candidates].sort(
            (a, b) => b.votes - a.votes
          );
          const winnerId = sortedCandidates[0]?._id;

          return (
            <div className="card mb-5 shadow border-0" key={campaign._id}>
              <div className="card-body">
                <h4 className="text-success fw-bold mb-4">
                  🗳️ {campaign.title}
                </h4>
                <div className="row g-4">
                  {sortedCandidates.map((candidate) => (
                    <div key={candidate._id} className="col-md-6 col-lg-4">
                      <div
                        className={`border rounded p-3 d-flex align-items-center shadow-sm ${
                          candidate._id === winnerId
                            ? "border-success border-3 bg-light"
                            : "border-secondary"
                        }`}
                        style={{ transition: "all 0.3s" }}
                      >
                        {candidate.image ? (
                          <img
                            src={candidate.image}
                            alt={candidate.name}
                            className="me-3"
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            className="me-3 bg-secondary text-white d-flex justify-content-center align-items-center"
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "50%",
                              fontWeight: "bold",
                              fontSize: "18px",
                            }}
                          >
                            {candidate.name[0]}
                          </div>
                        )}

                        <div className="flex-grow-1">
                          <h6 className="mb-0 fw-semibold text-dark">
                            {candidate.name}{" "}
                            {candidate._id === winnerId && "🏆"}
                          </h6>
                          <small className="text-muted">
                            Total Votes: {candidate.votes}
                          </small>
                        </div>

                        <span
                          className={`badge ${
                            candidate._id === winnerId
                              ? "bg-success"
                              : "bg-secondary"
                          } ms-2`}
                        >
                          {candidate.votes}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Results;
