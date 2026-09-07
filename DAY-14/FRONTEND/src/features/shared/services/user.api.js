import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000/api/users",
    withCredentials: true
})

export async function getConnections() {
    const response = await api.get("/connections")
    return response.data
}

export async function followUser(username) {
    const response = await api.post(`/follow/${encodeURIComponent(username)}`)
    return response.data
}

export async function unfollowUser(username) {
    const response = await api.post(`/unfollow/${encodeURIComponent(username)}`)
    return response.data
}
