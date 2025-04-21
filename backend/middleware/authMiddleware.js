const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Sprawdź, czy nagłówek Authorization istnieje i zaczyna się od "Bearer"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1]; // Pobierz token po "Bearer"

  try {
    // Zweryfikuj token za pomocą klucza JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Dodaj dane użytkownika do obiektu req
    req.user = decoded;

    // Przekaż kontrolę do następnego middleware lub kontrolera
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
