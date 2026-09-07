import "../nav.scss"
import { useNavigate } from "react-router"
import { useTheme } from "../theme.hook"

const Nav = () => {

    const navigate = useNavigate()
    const { theme, toggleTheme } = useTheme()

  return (
    <nav className="nav-bar">
        <div className="nav-inner">
          <button className="brand" type="button" onClick={() => navigate("/")}><span className="brand-mark">Y</span><strong>Yosta</strong></button>
          <span className="nav-note">A quieter place to share</span>
          <div className="nav-actions"><button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`} title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}><span aria-hidden="true">{theme === "light" ? "☾" : "☼"}</span></button><button className="nav-button primary" type="button" onClick={() => navigate("/create-post")}>+ New post</button></div>
        </div>
    </nav>
  )
}

export default Nav