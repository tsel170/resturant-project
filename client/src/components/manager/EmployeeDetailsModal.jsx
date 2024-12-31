import React from "react"

const EmployeeDetailsModal = ({ isOpen, onClose, employee }) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-300"
      style={{ animation: "fadeIn 0.3s ease-out" }}
    >
      <div
        className="w-full max-w-2xl transform rounded-xl bg-white p-8 shadow-2xl transition-all duration-300 hover:shadow-blue-500/10"
        style={{ animation: "slideIn 0.5s ease-out" }}
      >
        <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
          <h3 className="text-2xl font-bold text-gray-900">
            {employee?.name}'s Profile
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-700"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {employee && (
          <div className="grid grid-cols-2 gap-6">
            <InfoCard label="Name" value={employee.name} />
            <InfoCard label="Role" value={employee.role} />
            <InfoCard label="Job Title" value={employee.jobTitle} />
            <InfoCard label="Email" value={employee.email} />
            <InfoCard label="Phone" value={employee.phone} />
            <InfoCard label="Department" value={employee.department} />
          </div>
        )}

        <div className="mt-8 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-100 px-6 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-200 hover:shadow-md"
          >
            Close
          </button>
          <button className="rounded-lg bg-blue-500 px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-600 hover:shadow-md">
            Edit Profile
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

const InfoCard = ({ label, value }) => (
  <div className="rounded-lg bg-gray-50 p-4 transition-all duration-200 hover:bg-gray-100">
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="mt-2 text-lg font-semibold text-gray-900">{value || "N/A"}</p>
  </div>
)

export default EmployeeDetailsModal
