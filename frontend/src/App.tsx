import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './features/auth/pages/login'
import Register from './features/auth/pages/register'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
