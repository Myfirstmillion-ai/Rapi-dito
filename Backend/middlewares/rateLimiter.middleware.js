const rateLimit = require('express-rate-limit');

// Strict rate limiter for login endpoints - prevent brute force attacks
// 5 attempts per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Demasiados intentos de inicio de sesión. Por favor, intente nuevamente en 15 minutos.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip successful requests
  skipSuccessfulRequests: false,
  // Skip failed requests (only count successful requests)
  skipFailedRequests: false,
});

// Registration rate limiter - prevent spam registrations
// 3 attempts per hour
const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 registration attempts per hour
  message: {
    success: false,
    message: 'Demasiados intentos de registro. Por favor, intente nuevamente en 1 hora.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Password reset rate limiter - prevent abuse
// 3 attempts per hour
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per hour
  message: {
    success: false,
    message: 'Demasiadas solicitudes de restablecimiento de contraseña. Por favor, intente nuevamente en 1 hora.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiter - prevent abuse of API endpoints
// 100 requests per 15 minutes (reasonable for normal usage)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Demasiadas solicitudes. Por favor, intente nuevamente más tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Map API rate limiter - prevent abuse of third-party APIs
// 30 requests per minute (geocoding can be expensive)
const mapApiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 requests per minute
  message: {
    success: false,
    message: 'Demasiadas solicitudes de mapas. Por favor, espere un momento.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Email verification rate limiter - prevent spam
// 5 attempts per hour
const emailVerificationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 verification email requests per hour
  message: {
    success: false,
    message: 'Demasiadas solicitudes de verificación de correo. Por favor, intente nuevamente en 1 hora.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  loginLimiter,
  registrationLimiter,
  passwordResetLimiter,
  apiLimiter,
  mapApiLimiter,
  emailVerificationLimiter,
};
