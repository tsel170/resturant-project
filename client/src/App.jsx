import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext.jsx"
import { GoogleOAuthProvider } from "@react-oauth/google"
import NotificationHandler from "./components/general/NotificationHandler"
import "./App.css"

import Login from "./components/general/Login.jsx"
import ManagerComponent from "./components/manager/ManagerComponent.jsx"
import E404 from "./components/general/E404.jsx"

import OrdersManagement from "./pages/OrdersManagement.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import PersonalSpace from "./pages/PersonalSpace.jsx"
import EnterShift from "./pages/EnterShift.jsx"
import Management from "./pages/Management.jsx"
import Statistics from "./pages/Statistics.jsx"
import ShiftsManagement from "./pages/manage/ShiftsManagement"
import WorkersManagement from "./pages/manage/WorkersManagement"
import MenuManagement from "./pages/manage/MenuManagement"
import TablesManagement from "./pages/TablesManagement"
import ManagementTables from "./pages/manage/ManagementTables.jsx"
import DashboardContentChef from "./components/employee/DashboardContentChef.jsx"
import { useNotifications } from "./hooks/useNotifications"
import { ProtectedRoute } from "./components/general/MyRouts"
import ComingSoon from "./components/general/ComingSoon.jsx"

function App() {
  useNotifications()

  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationHandler />
        <Routes>
          <Route path="/" element={<Login />} />

          {/* General Routes - Now unprotected */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/personal-space" element={<PersonalSpace />} />
          <Route path="/enter-shift" element={<EnterShift />} />
          <Route path="/orders" element={<OrdersManagement />} />
          <Route path="/tables" element={<TablesManagement />} />

          {/* Chef Routes - Now unprotected */}
          <Route path="/dashboard-chef" element={<DashboardContentChef />} />

          {/* Management Routes - Now unprotected */}
          <Route path="/manager" element={<ManagerComponent />} />
          <Route path="/management" element={<Management />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/manage" element={<Management />} />
          <Route path="/manageshifts" element={<ShiftsManagement />} />
          <Route path="/manageworkers" element={<WorkersManagement />} />
          <Route path="/managemenu" element={<MenuManagement />} />
          <Route path="/managetables" element={<ManagementTables />} />

          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/*" element={<E404 />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
