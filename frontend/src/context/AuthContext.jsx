import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axios.get("/api/user/verify");
        setIsAuthenticated(res.data.status);
        if (!res.data.status) {
          navigate("/");
        }
      } catch (error) {
        console.error("Verification failed:", error);
        setIsAuthenticated(false);
        navigate("/");
      }
    };

    verifyUser();
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
