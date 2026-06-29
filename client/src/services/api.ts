import axios from 'axios'

const baseUrl = import.meta.env.VITE_SERVER_API_URL || "localhost:3001"

const api = axios.create({
    baseURL: baseUrl,
    timeout: 1000
})

export default api