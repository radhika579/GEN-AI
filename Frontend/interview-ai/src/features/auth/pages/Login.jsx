import React, { useEffect } from 'react'

const Login = () => {
    useEffect(() => {
        console.log('Login flow initiated - user navigated to login page')
    }, [])

    return (
        <div>Login</div>
    )
}

export default Login