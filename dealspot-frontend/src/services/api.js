import axios from 'axios';

const API_URL = 'http://localhost:8081/api';

// Configuration axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ========== AUTHENTIFICATION ==========
export const register = (userData) => {
  return api.post('/auth/register', userData);
};

export const login = (credentials) => {
  return api.post('/auth/login', credentials);
};

// ========== OFFRES ==========
export const getAllOffres = () => {
  return api.get('/offres');
};

export const getOffreById = (id) => {
  return api.get(`/offres/${id}`);
};

export const createOffre = (offreData, userId) => {
  return api.post(`/offres?userId=${userId}`, offreData);
};

export const updateOffre = (id, offreData, userId) => {
  return api.put(`/offres/${id}?userId=${userId}`, offreData);
};

export const deleteOffre = (id, userId) => {
  return api.delete(`/offres/${id}?userId=${userId}`);
};

export const getOffresByCategorie = (categorie) => {
  return api.get(`/offres/categorie/${categorie}`);
};

export const getOffresByLocalisation = (localisation) => {
  return api.get(`/offres/localisation/${localisation}`);
};

// ========== FAVORIS ==========
export const getFavoris = (userId) => {
  return api.get(`/favoris?userId=${userId}`);
};

export const addFavori = (offreId, userId) => {
  return api.post(`/favoris/${offreId}?userId=${userId}`);
};

export const removeFavori = (offreId, userId) => {
  return api.delete(`/favoris/${offreId}?userId=${userId}`);
};

export default api;