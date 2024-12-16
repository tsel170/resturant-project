import React from "react"

const GeneralComponent = ({ params }) => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Navbar role={params.role || ""} />
      <div className="flex flex-grow">
        <main className="container mx-auto my-8 flex-grow bg-white p-6">
          {params.element}
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default GeneralComponent
