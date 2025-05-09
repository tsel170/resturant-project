import React from "react"

const DashboardContentManager = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-lg bg-white px-4 text-center shadow-md">
      <h1 className="mb-4 text-4xl font-bold">Coming Soon!</h1>
      <div className="bg-primary mb-8 h-1 w-24"></div>
      <p className="mb-6 text-xl text-gray-600">
        We're working hard to bring you something amazing.
      </p>
      <div className="flex items-center gap-2 text-gray-500">
        <div className="animate-bounce delay-100">⚡</div>
        <div className="animate-bounce delay-200">⚡</div>
        <div className="animate-bounce delay-300">⚡</div>
      </div>
    </div>
  )
}

export default DashboardContentManager
