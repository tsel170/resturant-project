import React from "react"
import Dashboard from "./Dashboard"
import Employees from "./emploee/Employees"
import Footer from "./Footer"
import Navbar from "./Navbar"

const Home = () => {
  return (
    <>
      <div className="flex min-h-screen flex-col bg-gray-100">
        <Navbar />
        <main className="container mx-auto my-8 flex-grow">
          <Dashboard />
          <Employees />
        </main>
        <Footer />
      </div>
    </>
  )
}

export default Home
