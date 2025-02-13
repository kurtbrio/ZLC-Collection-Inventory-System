const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.json({ error: "All fields must be filled" });
    }

    if (password.length < 6) {
      return res.json({ error: "Password must be at least 6 characters" });
    }

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.json({ error: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ error: "Wrong email or password" });
    }

    const isPassMatch = await bcrypt.compare(password, user.password);

    if (!isPassMatch) {
      return res.json({ error: "Wrong email or password" });
    }

    jwt.sign(
      { name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "10hr" },
      (err, token) => {
        if (err) throw err;

        return res
          .status(200)
          .cookie("token", token, { httpOnly: true, maxAge: 3600000 })
          .json({ user, success: "Login successful" });
      }
    );
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

exports.verifyLogin = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.json({ status: false });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.json({ status: false });
    }

    return res.status(200).json({ status: true, message: "Authorized" });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

exports.logout = async (req, res) => {
  res.clearCookie("token");

  return res.status(200).json({ status: true });
};
