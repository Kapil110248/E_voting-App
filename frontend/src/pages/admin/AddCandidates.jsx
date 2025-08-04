import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "react-bootstrap-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddCandidates = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [candidates, setCandidates] = useState([{ name: "", file: null }]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/admin/campaigns", {
          withCredentials: true,
        });
        setCampaigns(res.data.campaigns || []);
      } catch (err) {
        console.error("Failed to fetch campaigns:", err);
        toast.error("❌ Failed to load campaigns");
      }
    };

    fetchCampaigns();
  }, []);

  const handleNameChange = (index, value) => {
    const updated = [...candidates];
    updated[index].name = value;
    setCandidates(updated);
  };

  const handleFileChange = (index, file) => {
    const updated = [...candidates];
    updated[index].file = file;
    setCandidates(updated);
  };

  const addCandidateField = () => {
    setCandidates([...candidates, { name: "", file: null }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("campaignId", selectedCampaign);

    candidates.forEach((candidate) => {
      formData.append("names", candidate.name);
      formData.append("candidates", candidate.file);
    });

    try {
      await axios.post("http://localhost:4000/api/admin/add-candidates", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(" Candidates added successfully!");
      setCandidates([{ name: "", file: null }]);
    } catch (err) {
      console.error("❌ Error adding candidates:", err);
      toast.error("❌ Failed to add candidates");
    }
  };

  return (
    <div className="container py-5">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* 🔙 Back Button */}
      <div
        className="mb-3 d-flex align-items-center"
        style={{ cursor: "pointer", width: "fit-content" }}
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="me-2 text-success" size={24} />
        Back
      </div>

      <h3 className="text-success fw-bold text-center mb-4">
        Add Candidates with Photo
      </h3>

      <form
        onSubmit={handleSubmit}
        className="shadow p-4 bg-light rounded mx-auto"
        style={{ maxWidth: "600px" }}
      >
        {/* Select Campaign */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Select Campaign</label>
          <select
            className="form-select"
            required
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
          >
            <option value="">-- Select Campaign --</option>
            {campaigns.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        {/* Candidates */}
        <label className="form-label fw-semibold">Candidate Details</label>
        {candidates.map((candidate, index) => (
          <div key={index} className="mb-3">
            <input
              type="text"
              value={candidate.name}
              onChange={(e) => handleNameChange(index, e.target.value)}
              className="form-control mb-2"
              placeholder={`Candidate ${index + 1} Name`}
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(index, e.target.files[0])}
              className="form-control"
              required
            />
          </div>
        ))}

        <button
          type="button"
          className="btn btn-outline-secondary mb-3"
          onClick={addCandidateField}
        >
          + Add More Candidate
        </button>

        <button type="submit" className="btn btn-success w-100">
          Add Candidates
        </button>
      </form>
    </div>
  );
};

export default AddCandidates;
