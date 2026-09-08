const jwt = require("jsonwebtoken");

/**
 * Verifies the Authorization: Bearer <token> header and attaches
 * the decoded payload ({ sub, email, role }) to req.user.
 * Responds 401 if the header is missing or the token is invalid/expired.
 */
function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).send({ error: "Missing or malformed Authorization header" });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).send({ error: "JWT_SECRET is not configured on the server" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { sub, email, role, iat, exp }
    next();
  } catch (err) {
    return res.status(401).send({ error: "Invalid or expired token" });
  }
}

/**
 * Must run after authMiddleware. Allows the request through only if
 * req.user.role === "admin".
 */
function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).send({ error: "Authentication required" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).send({ error: "Admin access required" });
  }
  next();
}

/**
 * Must run after authMiddleware. Allows the request through only if
 * req.user.sub matches the :id route param, OR req.user.role === "admin".
 * Use this for "a user can manage their own account" style routes.
 */
function requireSelfOrAdmin(paramName = "id") {
  return function (req, res, next) {
    if (!req.user) {
      return res.status(401).send({ error: "Authentication required" });
    }
    const targetId = req.params[paramName];
    if (req.user.role === "admin" || String(req.user.sub) === String(targetId)) {
      return next();
    }
    return res.status(403).send({ error: "You can only do this for your own account" });
  };
}

module.exports = { authMiddleware, requireAdmin, requireSelfOrAdmin };
