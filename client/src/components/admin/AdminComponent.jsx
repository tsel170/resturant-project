import React from "react"
import Navbar from "../general/Navbar"
import Footer from "../general/Footer"

const AdminComponent = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Navbar role={"Admin"} />
      <div className="flex flex-grow">
        <main className="container mx-auto my-8 flex-grow bg-white p-6">
          <h1 className="text-2xl font-bold">Main Content</h1>
          <p>This is the main content area for admin.</p>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default AdminComponent
