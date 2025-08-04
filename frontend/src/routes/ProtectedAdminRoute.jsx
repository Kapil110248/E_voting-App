import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/admin/me", {
          withCredentials: true,
        });
        if (res.data.admin) {
          setIsAuth(true);
        }
      } catch {
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };
    checkAdmin();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!isAuth) return <Navigate to="/admin/login" />;

  return children;
};

export default ProtectedAdminRoute;
