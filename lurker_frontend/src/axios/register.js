import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:8080/api/auth/register'
})

export default instance