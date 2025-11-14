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
import CommunitiesPage from './pages/student/Communities/Communities.tsx'
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
import LandingPage, { Home } from './pages/public/Index.tsx';
import Chat from './components/Chat.tsx';
import RegisterPage from './pages/public/Register.tsx';
import ExploreCourses from './pages/public/ExploreCourses.tsx';
import CourseDetailsPage from './pages/public/CourseDetailsPage.tsx';
import AccountVerified from './pages/public/AccountVerified.tsx';
import VerificationPage from './components/VerificationPage.tsx';
import LogoutPage from './pages/public/Logout.tsx';
import SendVerificationEmailPage from './components/SendVerificationEmailPage.tsx';
import ResourcesPage from './pages/public/ResourcesPage.tsx';
import NaqraaFeatures from './pages/public/ToolsPage.tsx';
import AboutUsPage from './pages/public/AboutUsPage.tsx';
import ContactPage from './pages/public/ContactPage.tsx';
import BlogPage from './pages/public/BlogPage.tsx';
import JoinNaqraaTeamPage from './pages/public/JoinNaqraaTeamPage.tsx';
import NaqraaForOrganizations from './pages/public/NaqraaForOrganizations.tsx';
import SupportPage from './pages/public/ٍSupportPage.tsx';
import FAQPage from './pages/public/FAQPage.tsx';
import ReportIssuePage from './pages/public/ReportIssuePage.tsx';
import NaqraaAppFeaturesPage from './pages/public/NaqraaAppFeaturesPage.tsx';
import PublicCommunitiesPage from './pages/public/Communities.tsx';
import OrganizationsPage from './pages/public/OrganizationsPage.tsx';
import PartenrsPage from './pages/public/PartenrsPage.tsx';
import PageNotFound from './pages/public/404.tsx';


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
                <Route path='communities' element={<CommunitiesPage />} />
                {/* <Route path='todo' element={<TodoPage />} /> */}
                <Route path='settings' element={<SettingsPage />} />
                <Route path='chat' element={<ChatPage />} >
                  <Route path=':chatId' element={<Chat />} />
                </Route>
                <Route path='notifications' >
                  <Route index element={<NotificationsPage />} />
                </Route>
                <Route path='classroom/:enrollment_id' element={<ClassroomPage />} />
                <Route path='board' element={<BoardPage />} />
              </Route>
              <Route path='communities/:communityId' element={<CommunityPage />} />
              {/* Authentication and user related pages */}

              {/* Course pages */}
              <Route path='/' element={<LandingPage />} >
                <Route index element={<Home />} />
                <Route path='courses' >
                  <Route index element={<CoursesPage />} />
                  <Route path='explore' element={<ExploreCourses />} />
                  <Route path=':courseSlug' element={<CourseDetailsPage />} />
                </Route>
                  <Route path='login' element={<LoginPage />} />
                  <Route path='register' element={<RegisterPage />} />
                  <Route path='account-verified' element={<AccountVerified />} />
                  <Route path='verify/:uid/:token' element={<VerificationPage />} />
                  <Route path="resend-verification" element={<SendVerificationEmailPage />} />
                  <Route path='logout' element={<ProtectedRoute> <LogoutPage /> </ProtectedRoute>} />
                  <Route path='tools' element={<NaqraaFeatures />} />
                  <Route path='about' element={<AboutUsPage />} />
                  <Route path='contact' element={<ContactPage />} />
                  <Route path='blog' element={<BlogPage />} />
                  <Route path='join-naqraa-team' element={<JoinNaqraaTeamPage />} />
                  <Route path='naqraa-for-organizations' element={<NaqraaForOrganizations />} />
                  <Route path='support' element={<SupportPage />} /> 
                  <Route path='faq' element={<FAQPage />} />
                  <Route path='report-issue'  element={<ReportIssuePage />} /> 
                  <Route path='app-features' element={<NaqraaAppFeaturesPage />} />
                  <Route path='communities' element={<PublicCommunitiesPage  />} />
                  <Route path='organizations' element={<OrganizationsPage />} />
                  <Route path='partenrs' element={<PartenrsPage />} />
                  <Route path='resources' >
                    <Route index element={<ResourcesPage />} />
                    <Route path='search' element={<div> search page </div>} />
                  </Route>
              </Route>

            </Route>
            <Route path='*' element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  </StrictMode>,
)
