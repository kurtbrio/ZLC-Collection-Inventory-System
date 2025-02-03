import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const authVerification = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/user/verify");

        if (!res.data.status) {
          navigate("/");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [navigate]);
};

export default authVerification;
