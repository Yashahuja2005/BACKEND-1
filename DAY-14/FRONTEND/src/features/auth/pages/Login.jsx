import { useState } from 'react'
import "../style/form.scss"
import { Link, Navigate } from "react-router"
import { useAuth } from '../hooks/useAuth'

const Login = () => {

    const [ username, setUsername ] = useState("")
    const [ password, setPassword ] = useState("")

    const {handleLogin, loading, user} = useAuth()

    if (user) {
        return <Navigate to="/" replace />
    }

    if(loading){
        return (
            <h1>Loading...</h1>
        )
    }

    function handleSubmit(e) {
        e.preventDefault()

        handleLogin(username, password)
            .then((res) => {
                console.log(res)
            })
            .catch(() => null)

    }


  return (
    <main className="auth-page">
        <div className="form-container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input 
                onInput={(e)=>{setUsername(e.target.value)}}
                type="text" 
                name="username" 
                placeholder="Enter username" />
                <input 
                onInput={(e) => { setPassword(e.target.value) }}
                type="password" 
                name="password" 
                placeholder="Enter Password" />
                <button className='button primary-button'>Login</button>
            </form>
            <p>Don't have an account? <Link className='toggleAuthForm' to="/register">Register</Link></p>
        </div>
    </main>
  )
}

export default Login