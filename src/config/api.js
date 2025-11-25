// API Configuration
// Use environment variable in production, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://cardify-club-f121a6960ade.herokuapp.com';

export default API_BASE_URL;

