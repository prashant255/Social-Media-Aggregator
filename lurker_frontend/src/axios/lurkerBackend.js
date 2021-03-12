import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:8080/api'
})

instance.defaults.headers.common['Authorization'] = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjE1NDg4MTE4LCJleHAiOjE2MTYwOTI5MTh9.QsHn7pLVS8bIWN_bDYUThrvt3pi0Q6_EN0I7IWe0TvQ'

export default instance