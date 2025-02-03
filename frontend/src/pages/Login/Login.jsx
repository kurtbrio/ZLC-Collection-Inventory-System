import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

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
    <div className="min-h-screen py-20 text-center text-primary-500 ]">
      <form onSubmit={handleSubmit}>
        <h1>
          Z<span className="text-secondary-500">L</span>C COLLECTION
        </h1>

        <div className="">
          <input
            className="rounded-full bg-secondary-700 py-2 px-2 mt-5"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="rounded-full bg-secondary-700 py-2 px-1.5 mt-2.5"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="rounded-full bg-secondary-200 py-2 px-1.5 min-h-10 min-w-52 mt-5"
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
