import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { ProtectedRoute } from '@components/ProtectedRoute'

const Login = lazy(() => import('@pages/Login'))
const Register = lazy(() => import('@pages/Register'))
const Debate = lazy(() => import('@pages/Debate'))

function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Debate />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
