import { useRef, useState } from "react"
import "../style/createpost.scss"
import { usePost } from "../hook/usePost"
import { useNavigate } from "react-router"
import Nav from "../../shared/components/Nav"

const CreatePost = () => {

    const [caption, setCaption] = useState("")

    const postImageFieldRef = useRef(null)

    const navigate = useNavigate()

    const {loading, handleCreatePost} = usePost()

    async function handleSubmit(e){
        e.preventDefault()

        const file = postImageFieldRef.current.files[0]

        if (!file) {
            return
        }

        await handleCreatePost(file, caption)

        navigate('/')

    }

    if(loading){
        return (
            <main>
                <h1>Creating Post</h1>
            </main>
        )
    }


  return (
    <main className="create-post-page">
        <Nav />
        <div className="create-post-shell">
          <div className="create-post-intro"><span className="eyebrow">Make something memorable</span><h1>Share a moment.</h1><p>Turn a thought, image, or small win into something your circle can keep.</p></div>
          <div className="form-container">
            <form onSubmit={handleSubmit}>
                <label className="post-image-label" htmlFor="postImage"><span>+</span><strong>Choose an image</strong><small>JPG, PNG or WEBP</small></label>
                <input ref={postImageFieldRef} hidden type="file" name="postImage" id="postImage" />
                <label className="caption-label" htmlFor="caption">Caption</label><textarea value={caption} onChange={(e)=>{setCaption(e.target.value)}} name="caption" id="caption" placeholder="What is this moment about?" rows="4" />
                <button className="create-submit" type="submit">Publish post <span>→</span></button>
            </form>
          </div>
        </div>
    </main>
  )
}

export default CreatePost