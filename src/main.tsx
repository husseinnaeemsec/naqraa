import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import IndexPage from './pages/student/DashboardIndex.tsx'
import CoursesPage from './pages/student/CoursePage.tsx'
import ExamsPage from './pages/student/ExamsPage.tsx'
import FilesPage from './pages/student/FilesPage.tsx'
import OrgPage from './pages/student/OrgPage.tsx'
import SettingsPage from './pages/student/SettingsPage.tsx'
import ChatPage from './pages/student/ChatPage.tsx'
import CommunityPage from './pages/student/CommunityPage.tsx'
import ClassroomPage from './pages/student/ClassroomPage.tsx'
import BoardPage from './pages/student/BoardPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />} >
      <Route index element={<IndexPage />} />
      <Route path='courses' element={<CoursesPage />} />
      <Route path='exams' element={<ExamsPage />} />
      <Route path='files' element={<FilesPage />} />
      <Route path='org' element={<OrgPage />} />
      <Route path='settings' element={<SettingsPage />} />
      <Route path='chat' element={<ChatPage />} />
      <Route path='community' element={<CommunityPage />} />
      <Route path='classroom' element={<ClassroomPage />} />
      <Route path='board' element={<BoardPage />} />
      </Route>
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
