import { useState } from "react"
import { usePost } from "../hook/usePost"

const Post = ({ user, post }) => {
    const { handleLike, handleUnlike, handleSave, handleGetComments, handleComment, handleShare } = usePost()
    const [likeLoading, setLikeLoading] = useState(false)
    const [commentsOpen, setCommentsOpen] = useState(false)
    const [comments, setComments] = useState([])
    const [commentText, setCommentText] = useState("")
    const [actionLoading, setActionLoading] = useState(false)

    async function handleLikeClick() {
        if (likeLoading) return
        setLikeLoading(true)
        try {
            if (post.isLiked) await handleUnlike(post._id)
            else await handleLike(post._id)
        } finally {
            setLikeLoading(false)
        }
    }

    async function toggleComments() {
        if (!commentsOpen) setComments(await handleGetComments(post._id))
        setCommentsOpen(!commentsOpen)
    }

    async function submitComment(event) {
        event.preventDefault()
        if (!commentText.trim() || actionLoading) return
        setActionLoading(true)
        try {
            const comment = await handleComment(post._id, commentText)
            setComments((current) => [...current, comment])
            setCommentText("")
        } finally {
            setActionLoading(false)
        }
    }

    async function share() {
        if (actionLoading) return
        setActionLoading(true)
        try {
            await handleShare(post._id, post.isShared)
            if (navigator.clipboard) await navigator.clipboard.writeText(`${window.location.origin}/posts/${post._id}`)
        } finally {
            setActionLoading(false)
        }
    }

    return (
        <article className="post">
            <div className="user">
                <img src={user.profileImage} alt="" />
                <div><strong>{user.username}</strong><span>Creator</span></div>
            </div>
            <img className="post-image" src={post.imgUrl} alt={post.caption || `Post by ${user.username}`} />
            <div className="icons">
                <div className="left">
                    <button type="button" aria-label="Like post" disabled={likeLoading} onClick={handleLikeClick}><span className={post.isLiked ? "icon like" : "icon"}>♡</span></button>
                    <button type="button" aria-label="Comment on post" onClick={toggleComments}><span className="icon">◌</span></button>
                    <button type="button" aria-label="Share post" onClick={share}><span className="icon">↗</span></button>
                </div>
                <button type="button" aria-label={post.isSaved ? "Unsave post" : "Save post"} onClick={() => handleSave(post._id, post.isSaved)}><span className={post.isSaved ? "icon saved" : "icon"}>▱</span></button>
            </div>
            <div className="metrics"><strong>{post.likeCount || 0} likes</strong><span>{post.commentCount || 0} comments</span><span>{post.shareCount || 0} shares</span></div>
            <p className="caption"><strong>{user.username}</strong> {post.caption}</p>
            {commentsOpen && <div className="comments"><div className="comment-list">{comments.map((comment) => <p key={comment._id}><strong>{comment.user}</strong>{comment.text}</p>)}</div><form onSubmit={submitComment}><input value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder="Add a comment..." /><button type="submit" disabled={actionLoading}>Post</button></form></div>}
        </article>
    )
}

export default Post
