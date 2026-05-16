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

      <pre>{JSON.stringify(user, null, 2)}</pre>

      <hr />
      <h3>Push. Coffee. Production</h3>
    </>
  )
}

export default App
