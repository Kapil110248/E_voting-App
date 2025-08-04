import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VoterDashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/voter/campaigns", {
          withCredentials: true,
        });
        setCampaigns(res.data.campaigns || []);
      } catch (err) {
        console.error("Failed to fetch campaigns:", err);
        setError("Failed to load campaigns. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) {
    return (
      <div className="container text-center py-5">
        <h4>⏳ Loading campaigns...</h4>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center py-5">
        <h4 className="text-danger">{error}</h4>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="text-success fw-bold text-center mb-4">📋 Available Campaigns</h2>

      {campaigns.length === 0 ? (
        <p className="text-muted text-center">No campaigns available for voting.</p>
      ) : (
        <div className="row">
          {campaigns.map((campaign) => {
            const start = new Date(campaign.startDate);
            const end = new Date(campaign.endDate);
            const now = new Date();
            const isOngoing = now >= start && now <= end;

            return (
              <div key={campaign._id} className="col-md-6 mb-4">
                <div className="card shadow-sm border-0">
                  <div className="card-body">
                    <h5 className="fw-bold text-success">{campaign.title}</h5>
                    <p className="mb-2 text-muted">
                      🗓 {start.toLocaleString()} → {end.toLocaleString()}
                    </p>
                    <p className="text-muted small mb-2">
                      👥 {campaign.candidates.length} candidates
                    </p>
                    {isOngoing ? (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => navigate(`/voter/vote/${campaign._id}`)}
                      >
                        🗳 Vote Now
                      </button>
                    ) : (
                      <span className="badge bg-secondary">⏳ Not active yet</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VoterDashboard;
