// frontend/src/config/api.js

// --- MODIFICATION CRUCIALE ---
// On laisse vide pour forcer l'usage du chemin relatif sur Azure.
// En local, si React et FastAPI sont sur le même port (via le "Monolithe"), ça marchera aussi.
export const API_URL = ""; 

export const getEndpoint = (path) => {
  // Nettoie le chemin pour éviter les doubles slashs (//)
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${cleanPath}`;
};


