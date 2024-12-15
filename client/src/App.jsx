import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import "./App.css"

import Home from "./components/Home"
import Navbar from "./components/Navbar"
import Login from "./components/Login"
import EmployeeComponent from "./components/EmployeeComponent"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/employee" element={<EmployeeComponent />} />
          <Route path="/manager" element={<EmployeeComponent />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
