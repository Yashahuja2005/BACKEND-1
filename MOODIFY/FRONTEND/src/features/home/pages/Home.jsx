
import FaceExpression from '../../Expression/components/FaceExpression'
import Player from '../components/Player'
import { useSong } from '../hooks/useSong'
import './home.scss'

const MOODS = [
  { name: 'happy', label: 'Bright', note: 'Lift the room', symbol: '✦' },
  { name: 'sad', label: 'Reflective', note: 'Make space for it', symbol: '◒' },
  { name: 'surprised', label: 'Electric', note: 'Follow the spark', symbol: '✹' },
  { name: 'neutral', label: 'Steady', note: 'Find your center', symbol: '◌' },
]

const Home = () => {
  const { loadPlaylist, queue, currentIndex, selectSong, loading, error } = useSong()
  return (
  <main className="home-shell">
    <header className="topbar">
      <div className="brand-mark"><span>m</span> moodify</div>
      <div className="topbar__status"><i /> live mood radio <span>•</span> session 01</div>
      <button className="avatar-button" title="Your profile">YA</button>
    </header>

    <section className="hero-copy">
      <p className="eyebrow">Your soundtrack, in the moment</p>
      <h1>How are you<br /><em>feeling today?</em></h1>
      <p className="hero-copy__sub">Choose a mood or let your camera read the room. We will build a fresh queue for the next chapter of your day.</p>
    </section>

    <section className="mood-grid" aria-label="Choose a mood">
      {MOODS.map((mood) => (
        <button className={`mood-card mood-card--${mood.name}`} key={mood.name} onClick={() => loadPlaylist(mood.name)}>
          <span className="mood-card__symbol">{mood.symbol}</span>
          <span className="mood-card__label">{mood.label}</span>
          <span className="mood-card__note">{mood.note}</span>
          <span className="mood-card__arrow">↗</span>
        </button>
      ))}
    </section>

    <section className="discovery-grid">
      <div className="camera-panel">
        <div className="section-heading"><span>01 / live read</span><b>Camera mood scan</b></div>
        <FaceExpression onClick={(expression) => loadPlaylist(expression)} />
      </div>
      <div className="queue-panel">
        <div className="section-heading"><span>02 / now building</span><b>{loading ? 'Curating your queue...' : `${queue.length} tracks in this session`}</b></div>
        <div className="queue-list">
          {queue.map((track, index) => (
            <button className={`queue-row ${index === currentIndex ? 'is-current' : ''}`} key={track._id || track.id || `${track.url}-${index}`} onClick={() => selectSong(index)}>
              <span className="queue-row__number">{String(index + 1).padStart(2, '0')}</span>
              <img src={track.posterUrl} alt="" />
              <span className="queue-row__details"><strong>{track.title}</strong><small>{track.artist || 'Moodify radio'} · {track.mood}</small></span>
              <span className="queue-row__state">{index === currentIndex ? 'NOW' : 'PLAY'}</span>
            </button>
          ))}
        </div>
        {error && <p className="queue-panel__notice">{error}</p>}
      </div>
    </section>
        <Player />
  </main>
  )
}

export default Home