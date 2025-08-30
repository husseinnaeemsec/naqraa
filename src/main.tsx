import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import IndexPage from './pages/student/DashboardIndex.tsx'
import StudentCoursesPage from './pages/student/StudentCoursePage.tsx'
import ExamsPage from './pages/student/ExamsPage.tsx'
import FilesPage from './pages/student/FilesPage.tsx'
import OrgPage from './pages/student/OrgPage.tsx'
import SettingsPage from './pages/student/SettingsPage.tsx'
import ChatPage from './pages/student/ChatPage.tsx'
import CommunityPage from './pages/student/CommunityPage.tsx'
import ClassroomPage from './pages/student/ClassroomPage.tsx'
import BoardPage from './pages/student/BoardPage.tsx'
import LoginPage from './pages/public/Login.tsx'
import { Provider } from 'react-redux';
import store from './store/store.tsx'
import AuthProvider from './AuthProvider.tsx'
import ProtectedRoute from './ProtectedRoute.tsx'
import './i18n.tsx';
import Dashboard from './Dashboard.tsx'
import CoursesPage from './pages/public/CoursesPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store} >
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<App />} >
              <Route path='/dashboard' element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} >
                <Route index element={<IndexPage />} />
                <Route path='courses' element={<StudentCoursesPage />} />
                <Route path='exams' element={<ExamsPage />} />
                <Route path='files' element={<FilesPage />} />
                <Route path='org' element={<OrgPage />} />
                <Route path='settings' element={<SettingsPage />} />
                <Route path='chat' element={<ChatPage />} />
                <Route path='community' element={<CommunityPage />} />
                <Route path='classroom/:enrollment_id' element={<ClassroomPage />} />
                <Route path='board' element={<BoardPage />} />
              </Route>
              {/* Authentication and user related pages */}
              <Route path='login' element={<LoginPage />} />
              {/* Course pages */}
              <Route path='courses' element={<CoursesPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  </StrictMode>,
)
