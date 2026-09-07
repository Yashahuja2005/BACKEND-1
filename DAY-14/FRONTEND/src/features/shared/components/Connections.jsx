import { useEffect, useState } from "react"
import { followUser, getConnections, unfollowUser } from "../services/user.api"

const Connections = () => {
    const [connections, setConnections] = useState({ followers: [], following: [] })
    const [username, setUsername] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getConnections().then(setConnections).catch(() => null)
    }, [])

    async function toggleFollow(event) {
        event.preventDefault()
        const target = username.trim()
        if (!target || loading) return
        setLoading(true)
        setMessage("")
        try {
            const isFollowing = connections.following.includes(target)
            const response = isFollowing ? await unfollowUser(target) : await followUser(target)
            setMessage(response.message)
            if (isFollowing) {
                setConnections((current) => ({ ...current, following: current.following.filter((item) => item !== target) }))
            } else {
                setMessage(`${response.message} - pending`)
            }
            setUsername("")
        } catch (error) {
            setMessage(error.response?.data?.message || "Could not update follow status")
        } finally {
            setLoading(false)
        }
    }

    return <aside className="connections-panel">
        <div className="profile-summary"><div className="profile-avatar">{connections.followers.length + connections.following.length}</div><div><strong>Your network</strong><span>Stay close to the people you follow</span></div></div>
        <div className="connection-stats"><div><strong>{connections.followers.length}</strong><span>Followers</span></div><div><strong>{connections.following.length}</strong><span>Following</span></div></div>
        <form className="follow-form" onSubmit={toggleFollow}><input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Username to follow" /><button type="submit" disabled={loading}>{connections.following.includes(username.trim()) ? "Unfollow" : "Follow"}</button></form>
        {message && <p className="connection-message">{message}</p>}
        {connections.following.length > 0 && <div className="following-list"><span>Following</span>{connections.following.slice(0, 5).map((item) => <button type="button" key={item} onClick={() => setUsername(item)}>@{item}</button>)}</div>}
    </aside>
}

export default Connections
