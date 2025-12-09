const asyncHandler = require("express-async-handler");
const userModel = require("../models/user.model");
const { validationResult } = require("express-validator");

// ==================== SAVED LOCATIONS ====================

/**
 * Get all saved locations for authenticated user
 * GET /user/saved-locations
 */
module.exports.getSavedLocations = asyncHandler(async (req, res) => {
  const user = await userModel
    .findById(req.user._id)
    .select("savedLocations")
    .lean();

  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  res.status(200).json({
    savedLocations: user.savedLocations || [],
  });
});

/**
 * Add a new saved location
 * POST /user/saved-locations
 */
module.exports.addSavedLocation = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, address, coordinates, type } = req.body;

  const user = await userModel.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  // Check if user already has max locations (limit to 10)
  if (user.savedLocations && user.savedLocations.length >= 10) {
    return res.status(400).json({
      message: "Has alcanzado el límite máximo de 10 ubicaciones guardadas",
    });
  }

  // Check for duplicate location names
  const duplicateName = user.savedLocations?.find(
    (loc) => loc.name.toLowerCase() === name.toLowerCase()
  );
  if (duplicateName) {
    return res.status(400).json({
      message: "Ya tienes una ubicación guardada con este nombre",
    });
  }

  // Add new location
  const newLocation = {
    name,
    address,
    coordinates,
    type: type || "other",
    createdAt: new Date(),
  };

  user.savedLocations.push(newLocation);
  await user.save();

  res.status(201).json({
    message: "Ubicación guardada exitosamente",
    location: newLocation,
  });
});

/**
 * Update a saved location
 * PUT /user/saved-locations/:id
 */
module.exports.updateSavedLocation = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { name, address, coordinates, type } = req.body;

  const user = await userModel.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  const location = user.savedLocations.id(id);
  if (!location) {
    return res.status(404).json({ message: "Ubicación no encontrada" });
  }

  // Update fields
  if (name) location.name = name;
  if (address) location.address = address;
  if (coordinates) location.coordinates = coordinates;
  if (type) location.type = type;

  await user.save();

  res.status(200).json({
    message: "Ubicación actualizada exitosamente",
    location,
  });
});

/**
 * Delete a saved location
 * DELETE /user/saved-locations/:id
 */
module.exports.deleteSavedLocation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await userModel.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  const location = user.savedLocations.id(id);
  if (!location) {
    return res.status(404).json({ message: "Ubicación no encontrada" });
  }

  // Remove location using pull
  user.savedLocations.pull(id);
  await user.save();

  res.status(200).json({
    message: "Ubicación eliminada exitosamente",
  });
});

// ==================== SEARCH HISTORY ====================

/**
 * Get search history for authenticated user
 * GET /user/search-history
 */
module.exports.getSearchHistory = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  const user = await userModel
    .findById(req.user._id)
    .select("searchHistory")
    .lean();

  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  // Sort by timestamp descending and limit results
  const history = (user.searchHistory || [])
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);

  res.status(200).json({
    searchHistory: history,
  });
});

/**
 * Add search query to history
 * POST /user/search-history
 */
module.exports.addSearchHistory = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { query, coordinates } = req.body;

  const user = await userModel.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  // Check for duplicate recent searches (within last 5 searches)
  const recentSearches = (user.searchHistory || [])
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

  const isDuplicate = recentSearches.some(
    (search) => search.query.toLowerCase() === query.toLowerCase()
  );

  if (!isDuplicate) {
    // Add to beginning of array
    user.searchHistory.unshift({
      query,
      coordinates,
      timestamp: new Date(),
    });

    // Keep only last 20 searches
    if (user.searchHistory.length > 20) {
      user.searchHistory = user.searchHistory.slice(0, 20);
    }

    await user.save();
  }

  res.status(201).json({
    message: "Búsqueda agregada al historial",
  });
});

/**
 * Clear all search history
 * DELETE /user/search-history
 */
module.exports.clearSearchHistory = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  user.searchHistory = [];
  await user.save();

  res.status(200).json({
    message: "Historial de búsqueda eliminado",
  });
});
