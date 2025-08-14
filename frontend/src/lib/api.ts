import axios from 'axios'

// Use Vite environment variable when provided, otherwise default to a
// same-origin relative path so the client works when deployed alongside
// the API (avoids falling back to localhost in production).
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api'

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default apiClient


