function requireAuth(req, res, next) {
  if (req.session.user) return next();
  if (req.path.startsWith("/api/")) return res.status(401).json({ message: "Please login first" });
  return res.redirect("/login");
}

function requireAdmin(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  if (req.session.user.role !== "ADMIN") return res.redirect("/app");
  next();
}

module.exports = { requireAuth, requireAdmin };
