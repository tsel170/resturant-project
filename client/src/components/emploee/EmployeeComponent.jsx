import React, { useEffect, useState } from "react"
import GeneralEmployee from "./GeneralEmployee"
import Navbar from "../general/Navbar"
import Footer from "../general/Footer"
import Waiter from "./Waiter"
import Chef from "./Chef"
import Barista from "./Barista"
import axios from "axios"

const EmployeeComponent = () => {
  const jobs = ["waiter", "chef", "barista"]

  useEffect(() => {
    const f = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/meals/getAllMeals"
        )

        console.log(response.data)
      } catch (error) {
        console.error("Login failed:", error.response.data.message)
      }
    }
    f()
  }, [])

  const [orders, setOrders] = useState([
    {
      table: 1,
      number: 3,
      items: ["salmon", "cake", "lemonade"],
      ready: true,
      paid: false,
      delivered: true,
    },
    {
      table: 2,
      number: 4,
      items: ["salmon", "cake", "lemonade"],
      ready: false,
      paid: false,
      delivered: false,
    },
    {
      table: 3,
      number: 5,
      items: ["salmon", "cake", "lemonade"],
      delivered: false,
      paid: false,
      ready: true,
    },
    {
      table: 3,
      number: 6,
      items: ["salmon", "cake", "lemonade"],
      ready: false,
      paid: false,
      delivered: false,
    },
    {
      table: 3,
      number: 7,
      items: ["salmon", "cake", "lemonade"],
      ready: false,
      paid: false,
      delivered: false,
    },
  ])

  const ready = (i) => {
    orders[i].ready = true
    setOrders((prev) => [...prev])
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Navbar role={"Employee"} />
      <div className="flex flex-grow">
        <main className="container mx-auto my-8 flex-grow bg-white p-6">
          {jobs.includes("waiter") && <Waiter params={{ orders, setOrders }} />}
          {jobs.includes("chef") && (
            <Chef params={{ orders, setOrders, ready }} />
          )}
          {jobs.includes("barista") && (
            <Barista params={{ orders, setOrders, ready }} />
          )}
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default EmployeeComponent
