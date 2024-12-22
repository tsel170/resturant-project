import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext.jsx"
import dotenv from "dotenv"
import "./App.css"

import Login from "./components/general/Login.jsx"
import EmployeeComponent from "./components/emploee/EmployeeComponent.jsx"
import AdminComponent from "./components/admin/AdminComponent.jsx"
import ManagerComponent from "./components/manager/ManagerComponent.jsx"
import E404 from "./components/general/E404.jsx"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/employee" element={<EmployeeComponent />} />
          <Route path="/manager" element={<ManagerComponent />} />
          <Route path="/admin" element={<AdminComponent />} />
          <Route path="/*" element={<E404 />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
