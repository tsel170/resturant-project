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

  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [branchId, setBranchId] = useState(null)
  const fetchTables = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_SERVER + "/api/branches/allBranches"
      )
      console.log(response.data[0].tables)

      if (response.data[0].tables) {
        const sortedTables = response.data[0].tables.sort(
          (a, b) => a.tableNumber - b.tableNumber
        )
        setTables(sortedTables)
        setBranchId(response.data[0]._id)
        setLoading(false)
      }
    } catch (err) {
      setError("Failed to fetch tables")
      setLoading(false)
      console.error("Error fetching tables:", err)
    }
  }
  useEffect(() => {
    fetchTables()
  }, [])

  const fetchOrsers = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_SERVER + "/api/bons/allBons"
      )
      // console.log("Response data:", response.data.bons) // Log the raw response
      setOrders(response.data.bons)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }
  useEffect(() => {
    fetchOrsers()
  }, [])

  // Add this useEffect to monitor orders state
  // useEffect(() => {
  //   console.log(orders)
  // }, [orders])

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
  }
  const [meals, setMeals] = useState([])
  const [isLoadingMeals, setIsLoadingMeals] = useState(true)
  const fetchMeals = async () => {
    setIsLoadingMeals(true)
    try {
      const response = await axios.get(
        import.meta.env.VITE_SERVER + "/api/meals/getAllMeals"
      )
      setMeals(response.data.Meals)
    } catch (error) {
      console.error("Error fetching meals:", error)
    } finally {
      setIsLoadingMeals(false)
    }
  }
  useEffect(() => {
    fetchMeals()
  }, [])

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
        fetchOrsers,
        tables,
        setTables,
        fetchTables,
        updateTable,
        navigate,
        employees,
        setEmployees,
        isLoading,
        loading,
        error,
        branchId,
        fetchMeals,
        meals,
        setMeals,
        isLoadingMeals,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
