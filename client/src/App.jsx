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

function App() {

  return (
    <div className='app'>
      <Routes>
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/verify-success" element={<VerifySuccess/>}/>
        <Route path="/verify-error" element={<VerifyError/>}/>
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/dashboard" element={<DashboardPage/>}/>
        <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
        <Route path="/reset-password" element={<ResetPasswordPage/>}/>
        <Route path="/view-alumni" element={<ViewAlumniPage/>}/>
       
      </Routes>
      {/* <RegisterPage/> */}
      {/* <ViewAlumniPage/> */}
      {/* <DashboardPage/> */}
    </div>
  )
}

export default App
