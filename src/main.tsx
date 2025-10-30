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
import CommunitiesPage from './pages/student/Communities/CommunitiesPage.tsx'
import ClassroomPage from './pages/student/ClassroomPage.tsx'
import BoardPage from './pages/student/BoardPage.tsx'
import LoginPage from './pages/public/Login.tsx'
import { Provider } from 'react-redux';
import store from './store/store.tsx'
import AuthProvider from './AuthProvider.tsx'
import ProtectedRoute from './ProtectedRoute.tsx'
import './i18n.js';
import Dashboard from './Dashboard.tsx'
import CoursesPage from './pages/public/CoursesPage.tsx'
import CommunityPage from './pages/student/Communities/CommunityPage.tsx';
import NotificationsPage from './pages/student/NotificationsPage.tsx';
import TimeTablePage from './pages/student/TimeTablePage.tsx';
import TodoPage from './pages/student/TodoPage.tsx';
import LandingPage, { Home } from './pages/public/Index.tsx';
import Chat from './components/Chat.tsx';
import RegisterPage from './pages/public/Register.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store} >
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<App />} >
                <Route path='dashboard' element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} >
                  <Route index element={<IndexPage />} />
                  <Route path='courses' element={<StudentCoursesPage />} />
                  <Route path='exams' element={<ExamsPage />} />
                  <Route path='files' element={<FilesPage />} />
                  <Route path='org' element={<OrgPage />} />
                  <Route path='timetable' element={<TimeTablePage />} />
                  {/* <Route path='todo' element={<TodoPage />} /> */}
                  <Route path='settings' element={<SettingsPage />} />
                  <Route path='chat' element={<ChatPage />} >
                    <Route path=':chatId' element={<Chat />} />
                  </Route>
                  <Route path='notifications' >
                    <Route index element={<NotificationsPage />} />
                  </Route>
                  <Route path='communties'>
                    <Route index element={<CommunitiesPage />} />
                    <Route path=':communityId' element={<CommunityPage />} />
                  </Route>
                  <Route path='classroom/:enrollment_id' element={<ClassroomPage />} />
                  <Route path='board' element={<BoardPage />} />
                </Route>
                {/* Authentication and user related pages */}
                <Route path='login' element={<LoginPage />} />
                <Route path='register' element={<RegisterPage />} />
                {/* Course pages */}
                <Route path='/' element={<LandingPage />} >
                  <Route index element={<Home />} />
                  <Route path='courses' element={<CoursesPage />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
    </Provider>
  </StrictMode>,
)
