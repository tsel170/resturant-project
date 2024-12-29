import { useState } from "react"
import OrderModal from "./OrderModal"
import axios from "axios"

const TableCard = ({
  tableNumber,
  seats,
  isOccupied,
  orders = [],
  onAssign,
  updateTable,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)

  const handleFreeTable = () => {
    setShowConfirmation(true)
  }

  const confirmFreeTable = () => {
    updateTable(tableNumber, {
      isOccupied: false,
      orders: [],
    })
    setShowConfirmation(false)
  }

  const handleAddOrder = () => {
    setShowOrderModal(true)
  }

  const handleSubmitOrder = (newOrder) => {
    axios
      .post(import.meta.env.VITE_SERVER + "/api/Bons/addBon", newOrder)
      .then((response) => {
        updateTable(tableNumber, {
          orders: [...orders, newOrder],
        })
        setShowOrderModal(false)
      })
      .catch((error) => {
        console.error("Error submitting order:", error)
        alert("Error submitting order")
      })
    updateTable(tableNumber, {
      orders: [...orders, newOrder],
    })
    setShowOrderModal(false)
  }

  return (
    <>
      <div
        className={`rounded-xl border-2 ${
          isOccupied ? "bg-red-50" : "bg-white"
        } p-6 shadow-sm transition-all hover:shadow-md`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            Table {tableNumber}
          </h2>
          <div
            className={`h-4 w-4 rounded-full ${
              isOccupied ? "bg-red-500" : "bg-green-500"
            }`}
          ></div>
        </div>

        <div className="space-y-2">
          <p className="text-gray-600">
            <span className="font-medium">Seats:</span> {seats}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Active Orders:</span>{" "}
            {orders.length > 0 ? orders.length : "None"}
          </p>
        </div>

        {!isOccupied && (
          <button
            onClick={onAssign}
            className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
          >
            Assign Table
          </button>
        )}

        {isOccupied && (
          <div className="mt-4 space-y-2">
            <button
              onClick={handleAddOrder}
              className="w-full rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
            >
              Add Order
            </button>

            {orders.length === 0 && (
              <button
                onClick={handleFreeTable}
                className="w-full rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
              >
                Free Table
              </button>
            )}
          </div>
        )}
      </div>

      <OrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        onSubmit={handleSubmitOrder}
        tableNumber={tableNumber}
      />

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold">
              Are you sure you want to free this table?
            </h3>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="rounded-lg bg-gray-100 px-4 py-2 text-gray-600 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmFreeTable}
                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Free Table
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TableCard
