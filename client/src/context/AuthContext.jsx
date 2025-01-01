import axios from "axios"
import React, { createContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  let [user, setUser] = useState(null)
  const [employees, setEmployees] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  // Add initial user check from cookies
  useEffect(() => {
    const token = localStorage.getItem("token")
    const savedUser = localStorage.getItem("user")
    if (token && savedUser) {
      user = JSON.parse(savedUser)
      setUser(user.userData)
      // console.log(user.userData)
    }
  }, [])

  const login = (userData) => {
    setUser(userData)
    // console.log(userData)

    localStorage.setItem("token", userData.token)
    localStorage.setItem("user", JSON.stringify(userData)) // Save user data
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/")
  }

  const [isSidebarVisible, setIsSidebarVisible] = useState(true)

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible)
  }

  const [orders, setOrders] = useState([])
  const [tables, setTables] = useState([
    { number: 1, seats: 4, orders: [], isOccupied: false },
    { number: 2, seats: 2, orders: [], isOccupied: false },
    { number: 3, seats: 6, orders: [], isOccupied: false },
    { number: 4, seats: 4, orders: [], isOccupied: false },
    // Add more tables as needed
  ])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_SERVER + "/api/bons/allBons"
        )
        // Handle the response data here
        orders.push(...response.data.Bons)

        setOrders((prev) => [...prev])
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])
  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(
          import.meta.env.VITE_SERVER + "/api/users/users"
        )
        setEmployees(response.data.users)
      } catch (error) {
        console.error("Error fetching employees:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmployees()
  }, [])

  const updateTable = (tableId, updates) => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.number === tableId ? { ...table, ...updates } : table
      )
    )

    // If you're connecting to a backend, add API call here
    // await axios.patch(`/api/tables/${tableId}`, updates);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        isSidebarVisible,
        toggleSidebar,
        orders,
        setOrders,
        tables,
        setTables,
        updateTable,
        navigate,
        employees,
        setEmployees,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
