import React, { useState } from "react"
import "./LoginForm.css"
import logo from "../dembrane-logo.png"

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [status, setStatus] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    setStatus("Logging in...")
    onLogin(username, password)
      .then(() => {
        setStatus("Login successful!")
      })
      .catch(() => {
        setStatus("Invalid username or password")
      })
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <img src={logo} className="login-logo" alt="logo" />

        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        <button type="submit" className="login-button">
          Login
        </button>
        {status && <p className="login-status">{status}</p>}
      </form>
    </div>
  )
}

export default LoginForm
