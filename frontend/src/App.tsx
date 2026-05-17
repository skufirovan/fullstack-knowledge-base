import { Route, Routes } from 'react-router-dom'
import { AppErrorBoundary, EmptyDashboard, ProtectedRoute } from './components'
import {
  ArticlePage,
  CategoryPage,
  CreateArticlePage,
  CreateCategoryPage,
  CreateUserPage,
  EditArticlePage,
  MainPage,
  MediatekaPage,
  NotFoundPage,
  SignInPage,
} from './pages'

function App() {
  return (
    <AppErrorBoundary>
      <Routes>
        <Route element={<ProtectedRoute onlyUnAuth />}>
          <Route path="/login" element={<SignInPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainPage />}>
            <Route index element={<EmptyDashboard />} />
            <Route path="mediateka" element={<MediatekaPage />} />
            <Route path="create-category" element={<CreateCategoryPage />} />
            <Route path="create-article" element={<CreateArticlePage />} />
            <Route path="create-user" element={<CreateUserPage />} />
            <Route path=":categorySlug" element={<CategoryPage />} />
            <Route
              path=":categorySlug/:articleSlug"
              element={<ArticlePage />}
            />
            <Route
              path=":categorySlug/:articleSlug/edit"
              element={<EditArticlePage />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </AppErrorBoundary>
  )
}

export default App
