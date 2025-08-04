import React from "react";

const CampaignCard = ({ title, startDate, endDate, status, onVoteClick }) => {
  return (
    <div className="card shadow">
      <div className="card-body">
        <h4 className="card-title text-success">{title}</h4>
        <p className="card-text mb-1">
          <strong>Start:</strong> {new Date(startDate).toLocaleString()}
        </p>
        <p className="card-text mb-1">
          <strong>End:</strong> {new Date(endDate).toLocaleString()}
        </p>
        <p className="card-text fw-semibold">{status}</p>
        <button onClick={onVoteClick} className="btn btn-success w-100">
          Vote Now
        </button>
      </div>
    </div>
  );
};

export default CampaignCard;
