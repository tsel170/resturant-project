import React from "react"
import Navbar from "../general/Header"
import Footer from "../general/Footer"
import EmployeeManagement from "./EmployeeManagement"
import MenuManagement from "./MenuManagement"
import TableManagement from "./TableManagement"

const ManagerComponent = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Navbar role={"manager"} />
      <div className="flex flex-grow">
        <main className="container mx-auto my-8 flex-grow rounded-lg bg-white p-6 shadow-lg">
          <h1 className="mb-6 text-center text-3xl font-bold">
            Manager Dashboard
          </h1>
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3">
            <EmployeeManagement />
            <MenuManagement />
            <TableManagement />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default ManagerComponent
