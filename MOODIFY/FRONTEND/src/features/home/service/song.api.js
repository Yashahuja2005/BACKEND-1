import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

export async function getSong({mood}) {
    const response = await api.get("/api/songs", { params: { mood, limit: 12 } });
    return response.data;
}