import { useEffect, useState } from "react"
import { ThemeContext } from "./theme.context"

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => localStorage.getItem("yosta-theme") || "light")

    useEffect(() => {
        document.documentElement.dataset.theme = theme
        localStorage.setItem("yosta-theme", theme)
    }, [theme])

    function toggleTheme() {
        setTheme((current) => current === "light" ? "dark" : "light")
    }

    return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}
