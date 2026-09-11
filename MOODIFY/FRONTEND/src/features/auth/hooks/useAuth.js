import { login, register, getMe, logout } from "../services/auth.api";
import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { useEffect } from "react";


export const useAuth = () => {
    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context

    async function handleRegister({ username, email, password }) {
        setLoading(true)
        const data = await register({ username, email, password })
        setUser(data.user)
        setLoading(false)
    }

    async function handleLogin({ username, email, password }) {
        setLoading(true)
        const data = await login({ username, email, password })
        setUser(data.user)
        setLoading(false)
    }

    async function handleGetMe() {
        setLoading(true)
        const data = await getMe()
        setUser(data.user)
        setLoading(false)
    }

    async function handleLogout() {
        setLoading(true)
        await logout()
        setUser(null)
        setLoading(false)
    }

    useEffect(() => {
        let active = true
        setLoading(true)
        getMe()
            .then((data) => {
                if (active) setUser(data.user)
            })
            .catch(() => {
                if (active) setUser(null)
            })
            .finally(() => {
                if (active) setLoading(false)
            })

        return () => { active = false }
    }, [setLoading, setUser])

    return ({
        user, loading, handleRegister, handleLogin, handleLogout, handleGetMe
    })
}