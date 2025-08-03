const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Ruta consultada: ${req.method} ${req.url}`);
  next();
};

module.exports = logger;
