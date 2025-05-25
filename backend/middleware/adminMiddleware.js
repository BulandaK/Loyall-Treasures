const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: No user data" });
  }

  if (req.user.role_id !== 1) {
    return res
      .status(403)
      .json({ message: "Forbidden: Admin access required" });
  }

  next();
};

module.exports = adminMiddleware;
