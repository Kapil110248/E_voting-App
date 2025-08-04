import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminNavbar from "../../components/AdminNavbar";

const AdminDashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [editCampaignId, setEditCampaignId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editingCandidateId, setEditingCandidateId] = useState(null);
  const [editingCandidateName, setEditingCandidateName] = useState("");
  const [adminInfo, setAdminInfo] = useState(null);

  const COLORS = ["#198754", "#0d6efd", "#ffc107", "#dc3545", "#6f42c1"];

  useEffect(() => {
    fetchAdminProfile();
    fetchCampaigns();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/admin/me", {
        withCredentials: true,
      });
      setAdminInfo(res.data.admin);
    } catch (err) {
      console.error(" Failed to fetch admin info:", err);
      toast.error(" Failed to fetch admin info.");
    }
  };

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/admin/campaigns-with-candidates", {
        withCredentials: true,
      });
      setCampaigns(res.data.campaigns || []);
    } catch (err) {
      console.error(" Failed to fetch campaigns:", err);
      toast.error(" Failed to fetch campaign data.");
    }
  };

  const handleCampaignUpdate = async (id) => {
    try {
      await axios.put(
        `http://localhost:4000/api/admin/campaign/${id}`,
        { title: editTitle },
        { withCredentials: true }
      );
      toast.success(" Campaign updated successfully!");
      setEditCampaignId(null);
      fetchCampaigns();
    } catch (err) {
      console.error(" Update failed:", err);
      toast.error(" Campaign update failed.");
    }
  };

  const handleCampaignDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this campaign?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/admin/campaign/${id}`, {
        withCredentials: true,
      });
      toast.success("🗑 Campaign deleted successfully!");
      fetchCampaigns();
    } catch (err) {
      console.error(" Delete failed:", err);
      toast.error(" Campaign delete failed.");
    }
  };

  const handleCandidateUpdate = async (id) => {
    try {
      await axios.put(
        `http://localhost:4000/api/admin/candidate/${id}`,
        { name: editingCandidateName },
        { withCredentials: true }
      );
      toast.success(" Candidate updated successfully!");
      setEditingCandidateId(null);
      fetchCampaigns();
    } catch (err) {
      console.error(" Candidate update failed:", err);
      toast.error(" Candidate update failed.");
    }
  };

  const handleCandidateDelete = async (id) => {
    if (!window.confirm("Delete this candidate?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/admin/candidate/${id}`, {
        withCredentials: true,
      });
      toast.success("🗑 Candidate deleted successfully!");
      fetchCampaigns();
    } catch (err) {
      console.error(" Candidate delete failed:", err);
      toast.error(" Candidate delete failed.");
    }
  };

  const handleExportToCSV = () => {
    const rows = [["Campaign", "Candidate", "Votes"]];
    campaigns.forEach((camp) => {
      camp.candidates.forEach((c) => {
        rows.push([camp.title, c.name, c.votes]);
      });
    });
    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "campaign_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("📄 Exported to CSV!");
  };

  return (
    <>
      <AdminNavbar />
      <ToastContainer position="top-right" autoClose={3000} />
   <div className="container pt-5 pb-4 mt-5">


        <div className="text-center mb-4">
          <h2 className="text-success fw-bold display-5">
            <i className="bi bi-bar-chart-line-fill me-2"></i> 🧑‍💻 eVote Control Center
          </h2>
          <p className="text-muted">
            Monitor campaigns, manage candidates and view results
          </p>
        </div>

        {/* ✅ Logged-in Admin Info */}
        <div className="text-end mb-3">
          <p className="text-muted small">
            Logged in as:{" "}
            <span className="fw-semibold text-success">
              {adminInfo?.fullname || "Admin"}
            </span>
          </p>
        </div>

        {/* 📋 Campaigns Section */}
        <div className="row">
          <h4 className="fw-bold mb-4 text-secondary">📋 Campaigns & Candidates</h4>
          {campaigns.length === 0 ? (
            <p className="text-muted text-center">No campaigns added yet.</p>
          ) : (
            campaigns.map((camp) => (
              <div key={camp._id} className="col-md-6">
                <div className="card mb-4 shadow-sm border-0">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      {editCampaignId === camp._id ? (
                        <>
                          <input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="form-control me-2"
                          />
                          <button
                            onClick={() => handleCampaignUpdate(camp._id)}
                            className="btn btn-sm btn-success"
                          >
                            ✅ Save
                          </button>
                        </>
                      ) : (
                        <>
                          <div>
                            <h5 className="fw-bold text-success mb-1">{camp.title}</h5>
                            <p className="text-muted small mb-0">
                              🗓{" "}
                              {camp.startDate && camp.endDate ? (
                                <>
                                  {new Date(camp.startDate).toLocaleString("en-IN", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                  })}{" "}
                                  →{" "}
                                  {new Date(camp.endDate).toLocaleString("en-IN", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                  })}
                                </>
                              ) : (
                                "Invalid or missing date"
                              )}
                            </p>
                          </div>
                          <div className="dropdown">
                            <button
                              className="btn btn-sm dropdown-toggle bg-white"
                              type="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                              style={{ border: "none" }}
                            >
                              ⋮
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() => {
                                    setEditCampaignId(camp._id);
                                    setEditTitle(camp.title);
                                  }}
                                >
                                  ✏️ Edit
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item text-danger"
                                  onClick={() => handleCampaignDelete(camp._id)}
                                >
                                  🗑 Delete
                                </button>
                              </li>
                            </ul>
                          </div>
                        </>
                      )}
                    </div>

                    <hr />
                    <p className="mb-2 text-muted small">Candidates:</p>
                    {camp.candidates.length === 0 ? (
                      <p className="text-muted fst-italic">No candidates yet</p>
                    ) : (
                      <ul className="list-group">
                        {camp.candidates.map((c) => (
                          <li
                            key={c._id}
                            className="list-group-item d-flex justify-content-between align-items-center"
                          >
                            <div className="d-flex align-items-center">
                              {c.image && (
                                <img
                                  src={c.image}
                                  alt={c.name}
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    objectFit: "cover",
                                    borderRadius: "50%",
                                    marginRight: "10px",
                                  }}
                                />
                              )}
                              {editingCandidateId === c._id ? (
                                <>
                                  <input
                                    value={editingCandidateName}
                                    onChange={(e) => setEditingCandidateName(e.target.value)}
                                    className="form-control me-2"
                                  />
                                  <button
                                    className="btn btn-sm btn-success"
                                    onClick={() => handleCandidateUpdate(c._id)}
                                  >
                                    ✅
                                  </button>
                                </>
                              ) : (
                                <span>{c.name}</span>
                              )}
                            </div>
                            <div className="dropdown">
                              <button
                                className="btn btn-sm dropdown-toggle bg-white"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                style={{ border: "none" }}
                              >
                                ⋮
                              </button>
                              <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => {
                                      setEditingCandidateId(c._id);
                                      setEditingCandidateName(c.name);
                                    }}
                                  >
                                    ✏️ Edit
                                  </button>
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item text-danger"
                                    onClick={() => handleCandidateDelete(c._id)}
                                  >
                                    🗑 Delete
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 📊 Analytics Section */}
        <div className="mt-5">
          <h4 className="text-secondary fw-bold mb-3">📊 Campaign Analytics</h4>
          <button className="btn btn-outline-dark btn-sm mb-3" onClick={handleExportToCSV}>
            ⬇️ Export as CSV
          </button>
          {campaigns.map((campaign) => {
            const data = campaign.candidates.map((c) => ({
              name: c.name,
              votes: Number(c.votes) || 0,
            }));
            return (
              <div key={campaign._id} className="mb-5 p-3 rounded shadow-sm bg-white">
                <h5 className="text-success fw-semibold mb-3">{campaign.title}</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="votes" fill="#198754" />
                  </BarChart>
                </ResponsiveContainer>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data}
                      dataKey="votes"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
