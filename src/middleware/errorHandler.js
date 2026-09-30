const errorHandler = (err, req, res, next) => {
  console.error("Server error:", err.message);

  res.status(err.status || 500).json({
    message: err.status
      ? err.message
      : "Internal server error",
  });
};

module.exports = errorHandler;