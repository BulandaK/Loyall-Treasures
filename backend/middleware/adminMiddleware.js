const adminMiddleware = (req, res, next) => {
  // Sprawdź, czy dane użytkownika są dostępne w req.user
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: No user data" });
  }

  // Sprawdź, czy użytkownik ma rolę "admin"
  if (req.user.role_id !== 1) {
    return res
      .status(403)
      .json({ message: "Forbidden: Admin access required" });
  }

  // Jeśli użytkownik ma rolę admina, przejdź dalej
  next();
};

module.exports = adminMiddleware;
