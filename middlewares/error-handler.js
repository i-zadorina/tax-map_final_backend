const errorHandler = (err, req, res, next) => {
  console.error('ERROR:', {
    message: err.message,
    name: err.name,
    code: err.code,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'An error occured on the server' : message,
  });
}

module.exports = errorHandler;
