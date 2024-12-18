import React from "react"
import GeneralEmployee from "./GeneralEmployee"
import Navbar from "../general/Navbar"
import Footer from "../general/Footer"
import Waiter from "./Waiter"
import Chef from "./Chef"
import Barista from "./Barista"

const EmployeeComponent = () => {
  const jobs = ["waiter", "chef", "barista"]

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Navbar role={"Employee"} />
      <div className="flex flex-grow">
        <main className="container mx-auto my-8 flex-grow bg-white p-6">
          {jobs.includes("waiter") && <Waiter />}
          {jobs.includes("chef") && <Chef />}
          {jobs.includes("barista") && <Barista />}
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default EmployeeComponent
