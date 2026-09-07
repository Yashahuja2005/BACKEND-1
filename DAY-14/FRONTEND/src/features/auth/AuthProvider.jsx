import AuthContext from "./auth.context";
import { useEffect, useState } from "react";

import { login, register, getMe } from "./services/auth.api";

export function AuthProvider({children}){
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [authLoading, setAuthLoading] = useState(true)

    useEffect(() => {
        getMe()
            .then((response) => {
                if (response?.user) {
                    setUser(response.user)
                }
            })
            .finally(() => setAuthLoading(false))
    }, [])

    const handleLogin = async (username, password) => {
        setLoading(true)
        try{
            const response = await login(username, password)
            setUser(response.user)
                return response
        }
        catch(err){
           console.log(err); 
              throw err
        }
        finally{
            setLoading(false)
        }
    }

    const handleRegister = async (username, email, password) => {
        setLoading(true)
        try{
            const response = await register(username, email, password)
            setUser(response.user)
        }
        catch(err){
           console.log(err); 
        }
        finally{
            setLoading(false)
        }
    }

    

    return (
        <AuthContext.Provider value={{user, loading, authLoading, handleLogin, handleRegister}}>
            {children}
        </AuthContext.Provider>
    )
}