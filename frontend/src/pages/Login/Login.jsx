import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/user/login", {
        email,
        password,
      });

      if (res.data.error) {
        toast.error(res.data.error);
      } else {
        toast.success(res.data.success);

        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to login");
    }
  };

  return (
    <div className="p-5" id="login-container">
      <form
        onSubmit={handleSubmit}
        className="py-10 px-5  backdrop-blur-xs bg-main-bg/50 shadow-black shadow-xl border-[0.5px] rounded-md border-white/20"
      >
        <div className="text-5xl text-center pb-10 font-medium">
          <span className="block">
            Z<span className="text-highlight">L</span>C
          </span>
          COLLECTION
        </div>

        <div className="flex flex-col gap-5">
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className=" relative placeholder:text-primary w-full"
              autoComplete="off"
            />
            <FontAwesomeIcon
              icon={faEnvelope}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 "
            />
          </div>

          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className=" placeholder:text-primary w-full"
            />
            <FontAwesomeIcon
              icon={faLock}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 "
            />
          </div>
        </div>

        <button className="mt-5 btn-primary w-full" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
