import axios from 'axios'

export const axiosInstance = (token?: string) => {
    const headers = {
        'api-version': 1,
    } as any

    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }

    return axios.create({
        baseURL: process.env.REACT_APP_BACKEND_API_URL,
        headers,
    })
}
