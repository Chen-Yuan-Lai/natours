class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    // errors created using this classs are operational errors
    // some programming errors are not have this property
    this.isOperational = true;

    // preserve the error add into err.stack
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
