import { addComment, createPost, getComments, getFeed, likePost, savePost, sharePost, unlikePost, unsavePost } from "../services/post.api";
import { useCallback, useContext } from "react";
import { PostContext } from "../post.context";

export const usePost = () => {
    const context = useContext(PostContext);

    const {loading, setLoading, post, setPost, feed, setFeed} = context

    const handleGetFeed = useCallback(async ()=>{
        setLoading(true)
        try {
            const data = await getFeed()
            setFeed(data.posts)
        } finally {
            setLoading(false)
        }
    }, [setFeed, setLoading])


    const handleCreatePost = async (imageFile, caption)=>{
        setLoading(true)
        try {
            const data = await createPost(imageFile, caption)
            setFeed((currentFeed) => [data.post, ...(currentFeed ?? [])])
            return data
        } finally {
            setLoading(false)
        }
    }

    const handleLike = useCallback(async (postId) => {
        const data = await likePost(postId)
        const current = feed?.find((item) => item._id === postId)
        setFeed((currentFeed) => currentFeed?.map((feedPost) => (
            feedPost._id === postId ? {...feedPost, isLiked: true, likeCount: (current?.likeCount || 0) + 1} : feedPost
        )))
        return data
    }, [feed, setFeed])

    const handleUnlike = useCallback(async (postId) => {
        const data = await unlikePost(postId)
        const current = feed?.find((item) => item._id === postId)
        setFeed((currentFeed) => currentFeed?.map((feedPost) => (
            feedPost._id === postId ? {...feedPost, isLiked: false, likeCount: Math.max((current?.likeCount || 1) - 1, 0)} : feedPost
        )))
        return data
    }, [feed, setFeed])

    const updatePost = useCallback((postId, updates) => {
        setFeed((currentFeed) => currentFeed?.map((feedPost) => (
            feedPost._id === postId ? { ...feedPost, ...updates } : feedPost
        )))
    }, [setFeed])

    const handleSave = useCallback(async (postId, saved) => {
        const data = saved ? await unsavePost(postId) : await savePost(postId)
        updatePost(postId, { isSaved: !saved })
        return data
    }, [updatePost])

    const handleGetComments = useCallback(async (postId) => {
        const data = await getComments(postId)
        return data.comments
    }, [])

    const handleComment = useCallback(async (postId, text) => {
        const data = await addComment(postId, text)
        const current = feed?.find((item) => item._id === postId)
        updatePost(postId, { commentCount: (current?.commentCount || 0) + 1 })
        return data.comment
    }, [feed, updatePost])

    const handleShare = useCallback(async (postId, alreadyShared) => {
        const data = await sharePost(postId)
        const current = feed?.find((item) => item._id === postId)
        updatePost(postId, { isShared: true, shareCount: alreadyShared ? current?.shareCount || 0 : (current?.shareCount || 0) + 1 })
        return data
    }, [feed, updatePost])

    return {loading, feed, post, setPost, handleGetFeed, handleCreatePost, handleLike, handleUnlike, handleSave, handleGetComments, handleComment, handleShare}
}