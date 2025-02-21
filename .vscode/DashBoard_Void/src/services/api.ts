import axios from 'axios';

const API_BASE_URL = 'https://sonil-dev.void.co.mz/api/v4';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const login = async (username: string, password: string) => {
  const response = await api.post('/users/login', { username, password });
  const token = response.data.token;
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  return response.data;
};

export const getSectors = async () => {
  const response = await api.get('/sectors/all/de190ded-d23c-410c-89ac-89faf4dfb36a');
  return response.data;
};

export const getAreasBySector = async (sectorId: string) => {
  const response = await api.get(`/areas?&sector=${sectorId}`);
  return response.data;
};

export const getProgress = async () => {
  const response = await api.get('/last-week/de190ded-d23c-410c-89ac-89faf4dfb36a?=&_limit=10');
  return response.data;
};

export const getFarmInputs = async () => {
  const response = await api.get('/analytics/farm-inputs/23e9336a-b20a-4478-a58f-875cc065e871?offset=1&limit=10?&filter=&phase=nurseries');
  return response.data;
};