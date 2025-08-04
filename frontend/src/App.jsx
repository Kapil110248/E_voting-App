import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./components/Home";

// Voter Pages
import VoterLogin from "./pages/voter/Login";
import VoterDashboard from "./pages/voter/Dashboard";
import Success from "./pages/voter/Success";
import VotePage from "./pages/voter/Vote";
import VoterNavbar from "./pages/voter/Navbar";

// Admin Pages
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import CreateCampaign from "./pages/admin/CreateCampaign";
import Results from "./pages/admin/Results";
import AddCandidates from "./pages/admin/AddCandidates";

// Shared Navbar
import MainNavbar from "./components/Navbar";

// Protected route components
import ProtectedVoterRoute from "./routes/ProtectedVoterRoute";
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute"; // ✅ NEW

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ Public Home */}
        <Route path="/" element={<Home />} />

        {/* ✅ Voter Auth */}
        <Route
          path="/voter/login"
          element={
            <>
              <MainNavbar />
              <VoterLogin />
            </>
          }
        />

        {/* ✅ Protected Voter Routes */}
        <Route
          path="/voter/dashboard"
          element={
            <ProtectedVoterRoute>
              <VoterNavbar />
              <VoterDashboard />
            </ProtectedVoterRoute>
          }
        />
        <Route
          path="/voter/success"
          element={
            <ProtectedVoterRoute>
             
              <Success />
            </ProtectedVoterRoute>
          }
        />
        <Route
          path="/voter/vote/:campaignId"
          element={
            <ProtectedVoterRoute>
              <VoterNavbar />
              <VotePage />
            </ProtectedVoterRoute>
          }
        />

        {/* ✅ Admin Auth */}
        <Route
          path="/admin/login"
          element={
            <>
              <MainNavbar />
              <AdminLogin />
            </>
          }
        />

        {/* ✅ Protected Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/create-campaign"
          element={
            <ProtectedAdminRoute>
              <CreateCampaign />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/results"
          element={
            <ProtectedAdminRoute>
              <Results />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/add-candidates"
          element={
            <ProtectedAdminRoute>
              <AddCandidates />
            </ProtectedAdminRoute>
          }
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;
