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

module.exports.getAddressCoordinate = async (address) => {
  const apiKey = process.env.GOOGLE_MAPS_API;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}&components=country:CO|country:VE&bounds=${SERVICE_AREA.bounds.south},${SERVICE_AREA.bounds.west}|${SERVICE_AREA.bounds.north},${SERVICE_AREA.bounds.east}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      const location = response.data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
      };
    } else {
      throw new Error("No se pudieron obtener las coordenadas");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Nueva función para obtener dirección desde coordenadas (geocodificación inversa)
module.exports.getAddressFromCoordinates = async (lat, lng) => {
  const apiKey = process.env.GOOGLE_MAPS_API;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}&language=es`;

  try {
    const response = await axios.get(url);
    if (response.data.status === "OK" && response.data.results.length > 0) {
      // Devolver la dirección formateada
      return response.data.results[0].formatted_address;
    } else {
      throw new Error("No se pudo obtener la dirección");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports.getDistanceTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error("Origen y destino son requeridos");
  }
  const apiKey = process.env.GOOGLE_MAPS_API;

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
    origin
  )}&destinations=${encodeURIComponent(destination)}&key=${apiKey}&language=es`;

  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      if (response.data.rows[0].elements[0].status === "ZERO_RESULTS") {
        throw new Error("No se encontraron rutas");
      }

      return response.data.rows[0].elements[0];
    } else {
      throw new Error("No se pudo obtener la distancia y tiempo");
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports.getAutoCompleteSuggestions = async (input) => {
  if (!input) {
    throw new Error("La consulta es requerida");
  }

  const apiKey = process.env.GOOGLE_MAPS_API;
  
  // Centrar las sugerencias en la zona de servicio
  const centerLat = (SERVICE_AREA.bounds.north + SERVICE_AREA.bounds.south) / 2;
  const centerLng = (SERVICE_AREA.bounds.east + SERVICE_AREA.bounds.west) / 2;
  
  // Radio de búsqueda en metros (aproximadamente 50km para cubrir toda el área)
  const radius = 50000;
  
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    input
  )}&key=${apiKey}&location=${centerLat},${centerLng}&radius=${radius}&strictbounds=true&components=country:co|country:ve&language=es`;

  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      // Filtrar solo resultados dentro del área de servicio
      const filteredPredictions = response.data.predictions.filter(prediction => {
        const description = prediction.description.toLowerCase();
        // Verificar si la predicción contiene alguna de las ciudades del área de servicio
        return SERVICE_AREA.cities.some(city => 
          description.includes(city.toLowerCase())
        );
      });

      return filteredPredictions
        .map((prediction) => prediction.description)
        .filter((value) => value);
    } else if (response.data.status === "ZERO_RESULTS") {
      return [];
    } else {
      throw new Error("No se pudieron obtener sugerencias");
    }
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};

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
