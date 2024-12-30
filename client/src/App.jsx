import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext.jsx"
import "./App.css"

import Login from "./components/general/Login.jsx"
// import EmployeeComponent from "./components/emploee/EmployeeComponent.jsx"
import AdminComponent from "./components/admin/AdminComponent.jsx"
import ManagerComponent from "./components/manager/ManagerComponent.jsx"
import E404 from "./components/general/E404.jsx"
import Home from "./pages/Dashboard.jsx"
import OrdersManagement from "./pages/OrdersManagement.jsx"
import TablesManagement from "./pages/TablesManagement.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import PersonalSpace from "./pages/PersonalSpace.jsx"
import EnterShift from "./pages/EnterShift.jsx"
import ShowMenu from "./components/manager/ShowMenu.jsx"
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/enter-shift" element={<EnterShift />} />
          <Route path="/personal-space" element={<PersonalSpace />} />

          {/* <Route path="/employee" element={<EmployeeComponent />} /> */}
          <Route path="/orders" element={<OrdersManagement />} />
          <Route path="/tables" element={<TablesManagement />} />
          <Route path="/manager" element={<ManagerComponent />} />
          <Route path="/admin" element={<AdminComponent />} />
          <Route path="/showMenu" element={<ShowMenu />} />
          <Route path="/*" element={<E404 />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
