import React from "react";
import {
  DashboardOutlined,
  Inventory2Outlined,
  CurrencyExchangeOutlined,
  TodayOutlined,
} from "@mui/icons-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
      path: "/dashboard",
    },
    {
      text: "Products",
      icon: <Inventory2Outlined />,
      path: "/products",
    },
    {
      text: "Sales",
      icon: <CurrencyExchangeOutlined />,
      path: "/sales",
    },
    {
      text: "Reports",
      icon: <TodayOutlined />,
      path: "/reports",
    },
  ];

  return (
    <div className="h-full min-h-screen max-w-fit pt-10 lg:pt-0 bg-main-bg lg:bg-transparent">
      <h1
        className="text-md text-center pb-10 font-medium px-5"
        style={{ color: "#f1f1f1" }}
      >
        <span className="block">
          Z<span className="text-highlight">L</span>C
        </span>
        COLLECTION
      </h1>

      <ul className="flex flex-col gap-2">
        {navLinks.map((link, index) => (
          <li key={index}>
            <a
              href={link.path}
              className={`text-xs flex items-center gap-2 py-2 pl-5 w-full  text-primary/70  ${
                location.pathname === link.path
                  ? "text-primary/100 font-bold bg-white/10 border-r-2 border-highlight"
                  : "font-extralight"
              }`}
            >
              {link.icon} {link.text}
            </a>
          </li>
        ))}
      </ul>
      <div className="flex justify-center">
        <button
          onClick={handleLogout}
          className="mt-5 w-[90%] gap-2 flex items-center justify-center text-sm"
          id="btn-primary"
        >
          Logout
          <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
