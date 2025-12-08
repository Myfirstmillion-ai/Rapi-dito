const axios = require("axios");
const captainModel = require("../models/captain.model");

// Zona de cobertura: San Antonio del Táchira, Cúcuta y alrededores
// Bounding box aproximado para la zona de servicio
const SERVICE_AREA = {
  // Coordenadas del área de servicio (formato: lat, lng)
  // Cubre: San Cristobal, Rubio, Peracal, Ureña, Palotal, San Antonio del Táchira,
  // Llano de Jorge, Villa del Rosario, La Parada, El Escobal, Cúcuta, Los Patios, El Zulia, Chinacota
  bounds: {
    north: 8.2,   // Límite norte (cerca de Cúcuta norte)
    south: 7.5,   // Límite sur (cerca de San Cristóbal)
    east: -72.2,  // Límite este
    west: -72.7   // Límite oeste
  },
  // Ciudades principales para el filtro de autocompletado
  cities: [
    "San Cristóbal",
    "San Cristobal",
    "Rubio",
    "Peracal",
    "Ureña",
    "Palotal",
    "San Antonio del Táchira",
    "San Antonio",
    "Llano de Jorge",
    "Villa del Rosario",
    "La Parada",
    "El Escobal",
    "Cúcuta",
    "Cucuta",
    "Los Patios",
    "El Zulia",
    "Chinacota",
    "Táchira",
    "Tachira",
    "Norte de Santander"
  ]
};

// MAPBOX API CONFIGURATION
const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN || process.env.VITE_MAPBOX_TOKEN;
const MAPBOX_API_BASE = 'https://api.mapbox.com';

if (!MAPBOX_TOKEN) {
  console.warn("⚠️ MAPBOX_TOKEN not found in environment variables. Map services will not work.");
}

// Bounding box for service area in Mapbox format: [minLng, minLat, maxLng, maxLat]
const SERVICE_AREA_BBOX = `${SERVICE_AREA.bounds.west},${SERVICE_AREA.bounds.south},${SERVICE_AREA.bounds.east},${SERVICE_AREA.bounds.north}`;

/**
 * Get coordinates from address using Mapbox Geocoding API
 * @param {string} address - Address to geocode
 * @returns {Promise<{lat: number, lng: number}>} Coordinates
 */
module.exports.getAddressCoordinate = async (address) => {
  if (!MAPBOX_TOKEN) {
    throw new Error("MAPBOX_TOKEN no configurado");
  }

  const url = `${MAPBOX_API_BASE}/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`;
  
  try {
    const response = await axios.get(url, {
      params: {
        access_token: MAPBOX_TOKEN,
        country: 'co,ve', // Colombia y Venezuela
        bbox: SERVICE_AREA_BBOX,
        limit: 1,
        language: 'es'
      }
    });

    if (response.data.features && response.data.features.length > 0) {
      const [lng, lat] = response.data.features[0].center; // Mapbox returns [lng, lat]
      return { lat, lng }; // ES6 shorthand
    } else {
      throw new Error("No se pudieron obtener las coordenadas");
    }
  } catch (error) {
    console.error("Mapbox geocoding error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get address from coordinates using Mapbox Reverse Geocoding
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<string>} Formatted address
 */
module.exports.getAddressFromCoordinates = async (lat, lng) => {
  if (!MAPBOX_TOKEN) {
    throw new Error("MAPBOX_TOKEN no configurado");
  }

  const url = `${MAPBOX_API_BASE}/geocoding/v5/mapbox.places/${lng},${lat}.json`;

  try {
    const response = await axios.get(url, {
      params: {
        access_token: MAPBOX_TOKEN,
        language: 'es'
      }
    });

    if (response.data.features && response.data.features.length > 0) {
      return response.data.features[0].place_name;
    } else {
      throw new Error("No se pudo obtener la dirección");
    }
  } catch (error) {
    console.error("Mapbox reverse geocoding error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get distance and time between two locations using Mapbox Directions API
 * @param {string} origin - Origin address
 * @param {string} destination - Destination address
 * @returns {Promise<{distance: {value: number, text: string}, duration: {value: number, text: string}}>}
 */
module.exports.getDistanceTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error("Origen y destino son requeridos");
  }
  
  if (!MAPBOX_TOKEN) {
    throw new Error("MAPBOX_TOKEN no configurado");
  }

  try {
    // First, geocode both addresses to get coordinates
    const originCoords = await module.exports.getAddressCoordinate(origin);
    const destCoords = await module.exports.getAddressCoordinate(destination);

    // Use Mapbox Directions API for driving route
    const coordinates = `${originCoords.lng},${originCoords.lat};${destCoords.lng},${destCoords.lat}`;
    const url = `${MAPBOX_API_BASE}/directions/v5/mapbox/driving/${coordinates}`;

    const response = await axios.get(url, {
      params: {
        access_token: MAPBOX_TOKEN,
        geometries: 'geojson',
        overview: 'full'
      }
    });

    if (response.data.routes && response.data.routes.length > 0) {
      const route = response.data.routes[0];
      
      // Convert to Google Maps-compatible format for backward compatibility
      return {
        distance: {
          value: route.distance, // meters
          text: `${(route.distance / 1000).toFixed(1)} km`
        },
        duration: {
          value: route.duration, // seconds
          text: `${Math.ceil(route.duration / 60)} min`
        }
      };
    } else {
      throw new Error("No se encontraron rutas");
    }
  } catch (err) {
    console.error("Mapbox directions error:", err.response?.data || err.message);
    throw err;
  }
};

/**
 * Get autocomplete suggestions using Mapbox Geocoding API
 * @param {string} input - Search query
 * @returns {Promise<string[]>} Array of place suggestions
 */
module.exports.getAutoCompleteSuggestions = async (input) => {
  if (!input) {
    throw new Error("La consulta es requerida");
  }

  if (!MAPBOX_TOKEN) {
    throw new Error("MAPBOX_TOKEN no configurado");
  }

  const url = `${MAPBOX_API_BASE}/geocoding/v5/mapbox.places/${encodeURIComponent(input)}.json`;

  try {
    const response = await axios.get(url, {
      params: {
        access_token: MAPBOX_TOKEN,
        country: 'co,ve',
        bbox: SERVICE_AREA_BBOX,
        proximity: '-72.443,7.815', // Proximity bias to San Antonio del Táchira/Cúcuta border
        types: 'place,locality,neighborhood,address,poi,poi.landmark', // EXPANDED: Now includes POIs, landmarks, establishments
        limit: 8, // Increased from 5 for better results
        language: 'es',
        autocomplete: true
      }
    });

    if (response.data.features && response.data.features.length > 0) {
      // Filter results to only include locations within service area cities
      const filteredResults = response.data.features.filter(feature => {
        const placeName = feature.place_name.toLowerCase();
        return SERVICE_AREA.cities.some(city => 
          placeName.includes(city.toLowerCase())
        );
      });

      return filteredResults.map(feature => feature.place_name);
    } else {
      return [];
    }
  } catch (err) {
    console.log("Mapbox autocomplete error:", err.response?.data || err.message);
    throw err;
  }
};

/**
 * Get captains within radius using MongoDB geospatial query
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Radius in kilometers
 * @param {string} vehicleType - Vehicle type filter
 * @returns {Promise<Array>} Array of captain documents
 */
module.exports.getCaptainsInTheRadius = async (lat, lng, radius, vehicleType) => {
  // radius en km
  
  try {
    const captains = await captainModel.find({
      location: {
        $geoWithin: {
          $centerSphere: [[lng, lat], radius / 6371],
        },
      },
      "vehicle.type": vehicleType,
    });
    return captains;
  } catch (error) {
    throw new Error("Error obteniendo conductores en el radio: " + error.message);
  }
};
