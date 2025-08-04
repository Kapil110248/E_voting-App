import React from "react";

const CandidateCard = ({
  id,
  name,
  image,
  onVote,
  voted,
  selectedId,
  isVotingActive,
}) => {
  return (
    <div className="card shadow-sm h-100 text-center">
      <div className="card-body">
        <img
          src={image}
          alt={name}
          className="rounded-circle mb-3"
          style={{ width: "100px", height: "100px", objectFit: "cover" }}
        />
        <h5 className="fw-bold text-dark">{name}</h5>

        <button
          disabled={voted || !isVotingActive}
          className={`btn mt-3 ${
            selectedId === id ? "btn-success" : "btn-outline-success"
          }`}
          onClick={() => onVote(id)}
        >
          {selectedId === id ? "✅ Voted" : "Vote"}
        </button>
      </div>
    </div>
  );
};

export default CandidateCard;
