import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import CandidateCard from "../../components/CandidateCard";

const VotePage = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [campaignInfo, setCampaignInfo] = useState(null);
  const [voted, setVoted] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isVotingActive, setIsVotingActive] = useState(false);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/vote/${campaignId}/candidates`,
          { withCredentials: true }
        );

        const campaign = res.data?.campaign;
        const candidateList = res.data?.candidates;

        if (!campaign) {
          setError("❌ Campaign not found.");
          setLoading(false);
          return;
        }

        const start = new Date(campaign.startDate);
        const end = new Date(campaign.endDate);
        const now = new Date();

        setIsVotingActive(now >= start && now <= end);
        setCampaignInfo(campaign);
        setCandidates(candidateList || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load candidates:", err);
        setError("Failed to load candidates.");
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [campaignId]);

  const handleVote = async (candidateId) => {
    if (!isVotingActive) {
      setError("Voting is not active right now.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:4000/api/vote/cast",
        { campaignId, candidateId },
        { withCredentials: true }
      );

      if (res.data.success) {
        setSelectedId(candidateId);
        setVoted(true);

        // ✅ Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate("/voter/login");
        }, 2000);
      } else {
        setError("❌ Vote failed. Try again.");
      }
    } catch (err) {
      console.error("❌ Vote failed:", err);
      setError(err?.response?.data?.message || "❌ Vote failed. Try again.");
    }
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <h4>⏳ Loading campaign info...</h4>
      </div>
    );
  }

  if (!campaignInfo) {
    return (
      <div className="container text-center py-5">
        <h4 className="text-danger">❌ Campaign not found</h4>
      </div>
    );
  }

  const start = new Date(campaignInfo.startDate);
  const end = new Date(campaignInfo.endDate);

  return (
    <div className="container py-5">
      <h2 className="text-center text-success fw-bold mb-2">
        🗳 Voting - {campaignInfo?.title || `Campaign #${campaignId}`}
      </h2>

      <p className="text-center text-muted mb-4">
        🗓 Voting window: <strong>{start.toLocaleString()}</strong> to{" "}
        <strong>{end.toLocaleString()}</strong>
      </p>

      {error && <p className="text-danger text-center fw-semibold">{error}</p>}

      {!isVotingActive && (
        <p className="text-danger text-center fw-bold">
          🚫 Voting is not active at this time.
        </p>
      )}

      {voted && (
        <p className="text-success text-center fw-bold">
          ✅ You have successfully voted! Redirecting to login...
        </p>
      )}

      {candidates.length === 0 ? (
        <p className="text-muted text-center">No candidates available</p>
      ) : (
        <div className="row">
          {candidates.map((c) => (
            <div className="col-md-6 mb-4" key={c._id}>
              <CandidateCard
                id={c._id}
                name={c.name}
                image={c.image || "https://via.placeholder.com/150"}
                onVote={handleVote}
                voted={voted}
                selectedId={selectedId}
                isVotingActive={isVotingActive}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VotePage;
