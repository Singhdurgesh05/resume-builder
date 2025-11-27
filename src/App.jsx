import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/dashboard'
import Editor from './pages/Editor'
import JobMatcher from './pages/JobMatcher'
import SignIn from './components/Auth/SignIn'
import SignUp from './components/Auth/SignUp'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        {/* Home route */}
        <Route path="/" element={<Home />} />

        {/* Auth routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Dashboard route */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Editor route */}
        <Route path="/editor" element={<Editor />} />

        {/* Job Matcher route */}
        <Route path="/job-matcher" element={<JobMatcher />} />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
