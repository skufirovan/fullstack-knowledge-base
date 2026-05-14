import { Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/protected-route'
import SignInPage from './pages/sign-in-page'

function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoute onlyUnAuth />}>
        <Route path="/login" element={<SignInPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<h1>База Знаний</h1>} />
      </Route>
    </Routes>
  )
}

export default App
