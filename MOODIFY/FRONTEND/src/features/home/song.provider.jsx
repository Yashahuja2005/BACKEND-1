import { useState } from "react"
import { SongContext } from "./song.context"
import { getSong } from "./service/song.api"

const DEMO_SONG = {
    id: "demo-moodify-session",
    url: "https://ik.imagekit.io/1gs2aps1a/Backend-1/moodify/songs/Aaraaro_Aararo__From__quot_Bholaa_quot____DownloadMing.WS__T-tst_OIU.mp3",
    posterUrl: "https://ik.imagekit.io/1gs2aps1a/Backend-1/moodify/posters/Aaraaro_Aararo__From__quot_Bholaa_quot____DownloadMing.WS__-qvRvzzKT.jpeg",
    title: "Aaraaro Aararo",
    artist: "Moodify sessions",
    album: "A calm beginning",
    mood: "happy",
}

export const SongContextProvider = ({children})=>{
    const [queue, setQueue] = useState([DEMO_SONG])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const song = queue[currentIndex] || null

    async function loadPlaylist(mood) {
        setLoading(true)
        setError("")
        try {
            const data = await getSong({ mood })
            const songs = data.songs?.length ? data.songs : [{ ...DEMO_SONG, mood }]
            setQueue(songs)
            setCurrentIndex(0)
        } catch {
            setQueue([{ ...DEMO_SONG, mood }])
            setCurrentIndex(0)
            setError("Playing the demo session. Connect the music library to load the full queue.")
        } finally {
            setLoading(false)
        }
    }

    function selectSong(index) {
        if (index >= 0 && index < queue.length) setCurrentIndex(index)
    }

    function nextSong() {
        setCurrentIndex((index) => queue.length ? (index + 1) % queue.length : 0)
    }

    function previousSong() {
        setCurrentIndex((index) => queue.length ? (index - 1 + queue.length) % queue.length : 0)
    }

    return (
        <SongContext.Provider value = {{
            loading, song, queue, currentIndex, error,
            loadPlaylist, selectSong, nextSong, previousSong
        }}>
            {children}
        </SongContext.Provider>
    )
}