import axios from 'axios'
import 'node'

const baseUrl = process.env.REACT_APP_API_URL || "localhost:3001"

const api = axios.create({
    baseURL: baseUrl,
    timeout: 1000
})

export default api