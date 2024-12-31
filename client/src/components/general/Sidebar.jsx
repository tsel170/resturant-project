import React, { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import SidebarEmployee from "./SidebarEmployee"
import SidebarManager from "./SidebarManager"

const Sidebar = () => {
  const { isSidebarVisible, user } = useContext(AuthContext)

  return (
    <aside
      className={`bottom-[64px] left-0 top-[64px] w-64 bg-gradient-to-b from-gray-800 to-gray-900 p-6 text-gray-100 shadow-xl transition-all duration-300 ease-in-out ${
        isSidebarVisible ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {user.role === "manager" ? <SidebarManager /> : <SidebarEmployee />}
    </aside>
  )
}

export default Sidebar
