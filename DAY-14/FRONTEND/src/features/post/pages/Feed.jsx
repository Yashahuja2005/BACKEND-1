import Post from '../components/Post'
import '../style/feed.scss'
import { usePost } from '../hook/usePost'
import { useEffect } from 'react'
import { Navigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'
import Nav from '../../shared/components/Nav'
import Connections from '../../shared/components/Connections'

const Feed = () => {

    const {feed, handleGetFeed, loading} = usePost()
    const {user, authLoading} = useAuth()

    useEffect(()=>{
        if (user) {
            handleGetFeed().catch(() => null)
        }
    }, [user, handleGetFeed])

    if (authLoading) {
        return <main><h1>Loading...</h1></main>
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if(loading || !feed){
        return (
            <main><h1>Feed is Loading...</h1></main>
        )
    }

  return (
    <main className="feed-page">
        <Nav />
                <div className="feed-layout">
                    <div className="feed">
                        <div className="feed-heading"><div><span className="eyebrow">Your daily loop</span><h1>Fresh from your circle</h1></div><span className="post-count">{feed.length} posts</span></div>
            <div className="posts">
               {feed.map(post=>{
                return <Post key={post._id} user={post.user} post={post} />
               })}
            </div>
                    </div>
                    <Connections />
        </div>
    </main>
  )
}

export default Feed