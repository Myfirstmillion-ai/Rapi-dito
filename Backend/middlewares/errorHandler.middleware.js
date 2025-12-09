/**
 * Standardized Error Response Middleware
 *
 * Ensures all API errors follow a consistent format:
 * {
 *   success: false,
 *   error: "ERROR_CODE",
 *   message: "User-friendly Spanish message",
 *   details: {} // Optional, development only
 * }
 */

// Standard error codes
const ERROR_CODES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  AUTHENTICATION_ERROR: "AUTHENTICATION_ERROR",
  AUTHORIZATION_ERROR: "AUTHORIZATION_ERROR",
  NOT_FOUND: "NOT_FOUND",
  DUPLICATE_ENTRY: "DUPLICATE_ENTRY",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  SERVER_ERROR: "SERVER_ERROR",
  BAD_REQUEST: "BAD_REQUEST",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
};

// Spanish error messages
const ERROR_MESSAGES = {
  VALIDATION_ERROR: "Los datos proporcionados no son válidos",
  AUTHENTICATION_ERROR: "No estás autenticado. Por favor, inicia sesión",
  AUTHORIZATION_ERROR: "No tienes permisos para realizar esta acción",
  NOT_FOUND: "El recurso solicitado no fue encontrado",
  DUPLICATE_ENTRY: "Este registro ya existe en el sistema",
  RATE_LIMIT_EXCEEDED: "Demasiadas solicitudes. Por favor, intenta más tarde",
  SERVER_ERROR: "Error interno del servidor. Estamos trabajando en solucionarlo",
  BAD_REQUEST: "La solicitud no es válida",
  TOKEN_EXPIRED: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente",
  INVALID_CREDENTIALS: "Credenciales inválidas. Verifica tu correo y contraseña",
};

/**
 * Create standardized error response
 * @param {string} errorCode - Error code from ERROR_CODES
 * @param {string} customMessage - Optional custom message (Spanish)
 * @param {Object} details - Optional error details (development only)
 * @returns {Object} Standardized error response
 */
function createErrorResponse(errorCode, customMessage = null, details = null) {
  const response = {
    success: false,
    error: errorCode,
    message: customMessage || ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.SERVER_ERROR,
  };

  // Include details only in development
  if (process.env.NODE_ENV === "development" && details) {
    response.details = details;
  }

  return response;
}

/**
 * Global error handling middleware
 * Must be placed AFTER all routes
 */
function errorHandler(err, req, res, next) {
  console.error("Error caught by middleware:", err);

  // Default to 500 status code
  let statusCode = err.statusCode || 500;
  let errorCode = err.errorCode || ERROR_CODES.SERVER_ERROR;
  let message = err.message;

  // Handle specific error types

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    errorCode = ERROR_CODES.VALIDATION_ERROR;
    message = Object.values(err.errors).map(e => e.message).join(", ");
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    errorCode = ERROR_CODES.DUPLICATE_ENTRY;
    const field = Object.keys(err.keyPattern)[0];
    message = `Ya existe un registro con este ${field}`;
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    errorCode = ERROR_CODES.BAD_REQUEST;
    message = "ID inválido proporcionado";
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    errorCode = ERROR_CODES.AUTHENTICATION_ERROR;
    message = "Token inválido";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    errorCode = ERROR_CODES.TOKEN_EXPIRED;
    message = ERROR_MESSAGES.TOKEN_EXPIRED;
  }

  // Express-validator errors
  if (err.array && typeof err.array === "function") {
    statusCode = 400;
    errorCode = ERROR_CODES.VALIDATION_ERROR;
    const errors = err.array();
    message = errors.map(e => e.msg).join(", ");
  }

  // Rate limit errors
  if (err.name === "RateLimitError" || statusCode === 429) {
    statusCode = 429;
    errorCode = ERROR_CODES.RATE_LIMIT_EXCEEDED;
    message = ERROR_MESSAGES.RATE_LIMIT_EXCEEDED;
  }

  // Send standardized error response
  res.status(statusCode).json(
    createErrorResponse(
      errorCode,
      message,
      process.env.NODE_ENV === "development" ? {
        stack: err.stack,
        original: err,
      } : null
    )
  );
}

/**
 * Custom error class for application errors
 */
class AppError extends Error {
  constructor(message, statusCode = 500, errorCode = ERROR_CODES.SERVER_ERROR) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 404 Not Found handler
 * Must be placed AFTER all routes but BEFORE error handler
 */
function notFoundHandler(req, res, next) {
  const error = new AppError(
    `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
    404,
    ERROR_CODES.NOT_FOUND
  );
  next(error);
}

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors automatically
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = {
  errorHandler,
  notFoundHandler,
  AppError,
  asyncHandler,
  createErrorResponse,
  ERROR_CODES,
  ERROR_MESSAGES,
};
