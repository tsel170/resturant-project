import React from "react"
import Navbar from "../general/Header"
import Footer from "../general/Footer"
import EmployeeManagement from "./EmployeeManagement"
import MenuManagement from "./MenuManagement"
import TableManagement from "./TableManagement"
import ShowMenu from "./ShowMenu"
import { useNavigate } from "react-router-dom"

const ManagerComponent = () => {
  const navigate = useNavigate()
  const onPassPage = () => {
    navigate("/showMenu")
  }
  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Navbar role={"manager"} />
      <div className="flex flex-grow">
        <main className="container mx-auto my-8 flex-grow rounded-lg bg-white p-6 shadow-lg">
          <h1 className="mb-6 text-center text-3xl font-bold">
            Manager Dashboard
          </h1>
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-4">
            <EmployeeManagement />
            <MenuManagement />
            <TableManagement />
          </div>
          <div className="mt-6" onClick={onPassPage} value="showMenu">
            <h3>Show menu</h3>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default ManagerComponent
