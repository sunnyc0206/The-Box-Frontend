import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
      // Server responded with error status
      throw new Error(error.response.data?.message || `HTTP ${error.response.status}`);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('No response from server');
    } else {
      // Something else happened
      throw new Error('Request failed');
    }
  }
);

export const apiService = {
  // Countries
  getCountries: async () => {
    return await apiClient.get('/iptv/countries');
  },

  // Channels
  getChannelsByCountry: async (countryCode) => {
    return await apiClient.get(`/iptv/countries/${countryCode}/channels`);
  },

  getChannelsByCategory: async (countryCode, category) => {
    return await apiClient.get(`/iptv/countries/${countryCode}/categories/${encodeURIComponent(category)}/channels`);
  },

  getChannel: async (channelId) => {
    return await apiClient.get(`/iptv/channels/${channelId}`);
  },

  getChannelStream: async (channelId) => {
    return await apiClient.get(`/iptv/channels/${channelId}/stream`);
  },

  // Categories
  getCategoriesByCountry: async (countryCode) => {
    return await apiClient.get(`/iptv/countries/${countryCode}/categories`);
  },

  // Search
  searchChannels: async (query, countryCode = null) => {
    const params = new URLSearchParams({ query });
    if (countryCode) {
      params.append('countryCode', countryCode);
    }
    return await apiClient.get(`/iptv/search?${params.toString()}`);
  },

  // Admin
  refreshChannels: async () => {
    return await apiClient.post('/iptv/refresh');
  },
};

export default apiService; 