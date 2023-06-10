import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Login } from './pages/login'
import { Comments } from './pages/comments'
import { Tasks } from './pages/tasks'

import './styles/global.css'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Login} />
        <Route path="/tasks" Component={Tasks} />
        <Route path="/comments/:category/:id" Component={Comments} />
      </Routes>
    </BrowserRouter>
  )
}
