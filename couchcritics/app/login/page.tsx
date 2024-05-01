import React from 'react'
import LoginForm from '../components/loginForm'
import Navbar from '../components/Navbar'

const LoginPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Navbar />
      <LoginForm />
    </main>
  )
}

export default LoginPage