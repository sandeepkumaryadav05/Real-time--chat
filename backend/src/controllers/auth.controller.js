const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ msg: "User already exists" });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash
    });

    res.json({ success: true, user });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } })
      .select("-password");

    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


exports.searchUsers = async (req, res) => {
  try {
    const keyword = req.query.q;

    const users = await User.find({
      name: { $regex: keyword, $options: "i" }
    }).select("name email");

    res.json(users);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: req.file.path },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
