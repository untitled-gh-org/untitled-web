import "./App.css"
import { useAuth } from "./auth/useAuth"

function App() {
  const { loading, user, login, logout } = useAuth()

  return (
    <>
      <div>
        {loading ? null : user ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <button onClick={login}>Login</button>
        )}
      </div>

      <p>
        Welcome, {loading ? "loading..." : user ? user.username : "anonymous"}
      </p>
    </>
  )
}

export default App
