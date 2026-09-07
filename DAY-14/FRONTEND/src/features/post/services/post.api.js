import axios from 'axios'

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

export async function getFeed(){
    const response = await api.get('/api/posts/feed')
    return response.data
}

export async function createPost(imageFile, caption) {
    const formData = new FormData()

    formData.append("image", imageFile)

    formData.append('caption', caption)

    const response = await api.post("/api/posts/", formData)
    return response.data
}

export async function likePost(postId) {
    const response = await api.post("/api/posts/like/" + postId)
    return response.data
}

export async function unlikePost(postId) {
    const response = await api.post("/api/posts/unlike/" + postId)
    return response.data
}

export async function savePost(postId) {
    const response = await api.post("/api/posts/save/" + postId)
    return response.data
}

export async function unsavePost(postId) {
    const response = await api.post("/api/posts/unsave/" + postId)
    return response.data
}

export async function getComments(postId) {
    const response = await api.get("/api/posts/comments/" + postId)
    return response.data
}

export async function addComment(postId, text) {
    const response = await api.post("/api/posts/comments/" + postId, { text })
    return response.data
}

export async function sharePost(postId) {
    const response = await api.post("/api/posts/share/" + postId)
    return response.data
}