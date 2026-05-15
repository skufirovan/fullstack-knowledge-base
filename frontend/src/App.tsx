import { Route, Routes } from 'react-router-dom'
import { AppErrorBoundary } from './components/app-error-boundary'
import { ProtectedRoute } from './components/protected-route'
import ArticlePage from './pages/article-page'
import MainPage from './pages/main-page'
import { NotFoundPage } from './pages/not-found-page'
import SignInPage from './pages/sign-in-page'

function App() {
  return (
    <AppErrorBoundary>
      <Routes>
        <Route element={<ProtectedRoute onlyUnAuth />}>
          <Route path="/login" element={<SignInPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainPage />}>
            <Route
              path=":categorySlug/:articleSlug"
              element={<ArticlePage />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </AppErrorBoundary>
  )
}

export default App
