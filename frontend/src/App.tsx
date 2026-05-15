import { Route, Routes } from 'react-router-dom'
import { AppErrorBoundary, ProtectedRoute } from './components'
import { ArticlePage, MainPage, NotFoundPage, SignInPage } from './pages'

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
