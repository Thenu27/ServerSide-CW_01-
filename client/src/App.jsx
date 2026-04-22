import { Route, Routes } from 'react-router-dom'
import './App.css'
import DashboardPage from './pages/DashboardPage/DashboardPage'
import LoginPage from './pages/LoginPage/LoginPage'
import RegisterPage from './pages/RegisterPage/RegisterPage'
import ViewAlumniPage from './pages/ViewAlumniPage/ViewAlumniPage'
import VerifySuccess from './pages/VerifySuccess/VerifySuccess'
import VerifyError from './pages/VerifyError/VerifyError'
import ResetPasswordPage from './pages/ResetPasswordPage/ResetPasswordPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage/ForgotPasswordPage'
import Sidebar from './components/Sidebar/Sidebar'
import ReportPage from './pages/ReportPage/ReportPage'
import ChartSection from './components/ChartSection/ChartSection'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import AlumniPreviewSection from './components/AlumniPreviewSection/AlumniPreviewSection'
import AlumniProfilePage from './pages/AlumniProfilePage/AlumniProfilePage'
import NoAccess from './components/NoAccess/NoAccess'

function App() {

  return (
    <div className='app'>
      <Sidebar/>
        <Routes>

          <Route path="/" element={<LoginPage/>} />
          <Route path="/register" element={<RegisterPage/>} />
          <Route path="/verify-success" element={<VerifySuccess/>}/>
          <Route path="/verify-error" element={<VerifyError/>}/>
          <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
          <Route path="/reset-password" element={<ResetPasswordPage/>}/>          
        <Route element={<ProtectedRoute/>}>
          <Route path="/dashboard" element={<DashboardPage/>}/>
          <Route path="/view-alumni" element={<ViewAlumniPage/>}/>    
          <Route path="/report" element={<ReportPage/>}/>
          <Route path="/view-analytics" element={<ChartSection/>}/>
          <Route path='/profile' element={<AlumniProfilePage/>}/>
          <Route path='/forbidden' element={<NoAccess/>}/>

        </Route>  
      </Routes>

    </div>
  )
}

export default App
