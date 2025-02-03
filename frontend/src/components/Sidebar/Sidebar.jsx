import React from "react";
import {
  DashboardOutlined,
  Inventory2Outlined,
  CurrencyExchangeOutlined,
  TodayOutlined,
} from "@mui/icons-material";
import { Link, Box, Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.get("api/user/logout");
      if (res.data.status) {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const navLinks = [
    {
      text: "Dashboard",
      icon: <DashboardOutlined />,
    },
    {
      text: "Products",
      icon: <Inventory2Outlined />,
    },
    {
      text: "Sales",
      icon: <CurrencyExchangeOutlined />,
    },
    {
      text: "Reports",
      icon: <TodayOutlined />,
    },
  ];

  return (
    <Box sx={{ padding: "2rem" }} className="sidebar-links">
      <h1>ZLC Collections</h1>

      <ul>
        {navLinks.map((link, index) => (
          <li key={index} className={link.text.toLowerCase()}>
            <Link href={"/" + link.text.toLowerCase()}>
              {link.icon} {link.text}
            </Link>
          </li>
        ))}
      </ul>
      <Button onClick={handleLogout}>Logout</Button>
    </Box>
  );
};

export default Sidebar;
