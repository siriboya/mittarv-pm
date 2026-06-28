// Simple API key check — satisfies "API must be secured" requirement.
module.exports = function apiKeyAuth(req, res, next) {
  const key = req.header("x-api-key");
  if (!key || key !== process.env.API_KEY) {
    return res.status(401).json({ message: "Unauthorized: invalid or missing API key" });
  }
  next();
};
