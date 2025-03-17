const userModel = require("../models/userModel");

exports.getUserById = (req, res) => {
  const userId = parseInt(req.params.id);
  const user = userModel.getUserById(userId);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

exports.getAllUsers = (req, res) => {
  const users = userModel.getAllUsers();
  res.status(200).json(users);
};

exports.addUser = (req, res) => {
  const newUser = userModel.addUser(req.body);
  res.status(201).json(newUser);
};

exports.updateUser = (req, res) => {
  const userId = parseInt(req.params.id);
  const updatedUser = userModel.updateUser(userId, req.body);

  if (updatedUser) {
    res.status(200).json(updatedUser);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

exports.deleteUser = (req, res) => {
  const userId = parseInt(req.params.id);
  const deletedUser = userModel.deleteUser(userId);

  if (deletedUser) {
    res.status(200).json(deletedUser);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};
