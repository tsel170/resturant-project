import React, { createContext, useState } from "react"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem("token", userData.token)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("token")
  }

  const [isSidebarVisible, setIsSidebarVisible] = useState(true)

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible)
  }

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isSidebarVisible, toggleSidebar }}
    >
      {children}
    </AuthContext.Provider>
  )
}
