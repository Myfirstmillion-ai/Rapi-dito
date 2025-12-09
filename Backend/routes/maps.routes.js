const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const mapController = require('../controllers/map.controller');
const { query } = require('express-validator');
const { mapApiLimiter } = require('../middlewares/rateLimiter.middleware');

// SECURITY: Protected and rate-limited to prevent API abuse - 30 requests per minute
router.get('/get-coordinates',
    mapApiLimiter,
    authMiddleware.authUser,
    query('address').isString().isLength({ min: 3 }),
    mapController.getCoordinates
);

router.get('/get-distance-time',
    mapApiLimiter,
    query('origin').isString().isLength({ min: 3 }),
    query('destination').isString().isLength({ min: 3 }),
    authMiddleware.authUser,
    mapController.getDistanceTime
);

router.get('/get-suggestions',
    mapApiLimiter,
    query('input').isString().isLength({ min: 3 }),
    authMiddleware.authUser,
    mapController.getAutoCompleteSuggestions
);

// Nueva ruta para obtener dirección desde coordenadas
router.get('/get-address',
    mapApiLimiter,
    query('lat').isNumeric(),
    query('lng').isNumeric(),
    authMiddleware.authUser,
    mapController.getAddressFromCoordinates
);

module.exports = router;
