import React from "react"
import Navbar from "./Header"
import Footer from "./Footer"

const E404 = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Navbar role={""} />
      <div className="flex flex-grow">
        <main className="container mx-auto my-8 flex-grow bg-white p-6">
          <h1 className="text-2xl font-bold">Error 404</h1>
          <p>pagee not found</p>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default E404
