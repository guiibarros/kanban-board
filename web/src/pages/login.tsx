import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    localStorage.setItem('username', username)
    setUsername('')
    navigate('/tasks')
  }

  return (
    <div className="login__container">
      <form className="login__form" onSubmit={handleSubmit}>
        <label htmlFor="username">Provide a username</label>
        <input
          type="text"
          name="username"
          id="username"
          required
          onChange={(event) => setUsername(event.target.value)}
          value={username}
        />
        <button>SIGN IN</button>
      </form>
    </div>
  )
}
