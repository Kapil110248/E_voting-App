import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateCampaign = () => {
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // ✅ Date validation
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error("❌ End date must be after start date.");
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        "http://localhost:4000/api/admin/campaign",
        {
          title: formData.title,
          startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.endDate).toISOString(),
        },
        {
          withCredentials: true,
        }
      );

      toast.success(" Campaign created successfully!");
      setFormData({ title: "", startDate: "", endDate: "" });
    } catch (err) {
      console.error("❌ Axios error:", err);
      toast.error(err.response?.data?.message || "❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* 🔙 Back Button */}
      <div className="mb-3">
        <button
          className="btn btn-outline-success fw-semibold"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>

      <h2 className="text-success text-center fw-bold mb-4">
        Create New Campaign
      </h2>

      <form
        onSubmit={handleSubmit}
        className="shadow p-4 bg-light rounded mx-auto"
        style={{ maxWidth: "500px" }}
      >
        <div className="mb-3">
          <label className="form-label fw-semibold">Campaign Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-control"
            placeholder="e.g. Election 2025"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Start Date & Time</label>
          <input
            type="datetime-local"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">End Date & Time</label>
          <input
            type="datetime-local"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-success w-100"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Campaign"}
        </button>
      </form>
    </div>
  );
};

export default CreateCampaign;
