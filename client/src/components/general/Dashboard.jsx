import React from "react"

const Dashboard = () => (
  <section className="rounded-lg bg-white p-6 shadow-lg">
    <h2 className="mb-4 text-xl font-bold">Dashboard</h2>
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div className="rounded bg-gray-50 p-4 duration-200 hover:bg-gray-100 hover:shadow">
        <h3 className="mb-2 font-semibold">Sales Performance</h3>
        <div className="h-40 rounded bg-gray-200">Chart Placeholder</div>
      </div>
      <div className="rounded bg-gray-50 p-4 duration-200 hover:bg-gray-100 hover:shadow">
        <h3 className="mb-2 font-semibold">Branch Activity</h3>
        <p>Summary of recent branch activities.</p>
      </div>
      <div className="rounded bg-gray-50 p-4 duration-200 hover:bg-gray-100 hover:shadow">
        <h3 className="mb-2 font-semibold">Quick Actions</h3>
        <ul>
          <li>
            <a href="#" className="text-green-600 hover:underline">
              Manage Branches
            </a>
          </li>
          <li>
            <a href="#" className="text-green-600 hover:underline">
              Manage Menus
            </a>
          </li>
          <li>
            <a href="#" className="text-green-600 hover:underline">
              Manage Employees
            </a>
          </li>
        </ul>
      </div>
    </div>
  </section>
)

export default Dashboard
