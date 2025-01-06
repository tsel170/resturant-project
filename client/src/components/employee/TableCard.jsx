import { useContext, useEffect, useState } from "react"
import OrderModal from "./OrderModal"
import axios from "axios"
import { AuthContext } from "../../context/AuthContext"

const TableCard = ({
  tableNumber,
  seats,
  occuipied,
  tableOrders,
  ordersNumber,
  setOrdersNumber,
  onAssign,
  updateTable,
  branchId,
}) => {
  const { fetchTables, meals, orders: allOrders } = useContext(AuthContext)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [orders, setOrders] = useState(tableOrders)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [totalAmount, setTotalAmount] = useState(0)

  useEffect(() => {
    setOrders(tableOrders)
  }, [tableOrders])

  const handleFreeTable = () => {
    setShowConfirmation(true)
  }

  const confirmFreeTable = async () => {
    await axios.put(
      import.meta.env.VITE_SERVER + "/api/branches/updateTableOccupied",
      {
        branchId: branchId,
        tableNumber: tableNumber,
      }
    )
    fetchTables()
    setShowConfirmation(false)
  }

  const handleAddOrder = () => {
    setShowOrderModal(true)
  }

  const handleSubmitOrder = async (newOrder) => {
    try {
      await axios.post(
        import.meta.env.VITE_SERVER + "/api/Bons/addBon",
        newOrder
      )
      const updatedOrders = [...orders, newOrder]
      setOrders(updatedOrders)
      updateTable(tableNumber, {
        tableOrders: updatedOrders,
      })
      setShowOrderModal(false)
    } catch (error) {
      console.error("Error submitting order:", error)
      alert("Error submitting order")
    }
  }

  const handlePayment = () => {
    const randomAmount = Math.floor(Math.random() * (500 - 50 + 1)) + 50
    setTotalAmount(randomAmount)

    // Add debug logs
    console.log("Local table orders:", orders)
    console.log("All orders from context:", allOrders)

    // Get full order details by matching order numbersnow - make that the filal
    const fullOrderDetails = orders
      .map((localOrder) => {
        return allOrders.find((order) => order.bonNumber === localOrder.number)
      })
      .filter((order) => order)

    console.log("Full order details:", fullOrderDetails)

    // Log the meals summary calculation with safety checks
    const mealsSummary = fullOrderDetails.reduce((acc, order) => {
      console.log("Processing order:", order)

      if (order && Array.isArray(order.meals)) {
        console.log("Order meals:", order.meals)

        order.meals.forEach((meal) => {
          if (meal && meal.mealTitle) {
            if (!acc[meal.mealTitle]) {
              acc[meal.mealTitle] = 0
            }
            acc[meal.mealTitle] += meal.quantity || 1
          }
        })
      }

      return acc
    }, {})

    console.log("Meals summary:", mealsSummary)

    setShowPaymentModal(true)
  }

  const confirmPayment = async () => {
    try {
      await axios.post(import.meta.env.VITE_SERVER + "/api/Bons/payOrders", {
        tableNumber,
        branchId,
        orders,
      })
      setOrders([])
      updateTable(tableNumber, {
        tableOrders: [],
      })
      setShowPaymentModal(false)
    } catch (error) {
      console.error("Error processing payment:", error)
      alert("Error processing payment")
    }
  }

  return (
    <>
      <div
        className={`rounded-xl border-2 ${
          occuipied ? "bg-red-50" : "bg-white"
        } p-6 shadow-sm transition-all hover:shadow-md`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            Table {tableNumber}
          </h2>
          <div
            className={`h-4 w-4 rounded-full ${
              occuipied ? "bg-red-500" : "bg-green-500"
            }`}
          ></div>
        </div>

        <div className="space-y-2">
          <p className="text-gray-600">
            <span className="font-medium">Seats:</span> {seats}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Active Orders:</span>{" "}
            <ul>
              {orders.length > 0
                ? orders.map((order, index) => (
                    <li key={order.number || index}>{order.number}</li>
                  ))
                : "None"}
            </ul>
          </p>
        </div>

        {!occuipied && (
          <button
            onClick={onAssign}
            className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
          >
            Assign Table
          </button>
        )}

        {occuipied && (
          <div className="mt-4 space-y-2">
            <button
              onClick={handleAddOrder}
              className="w-full rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
            >
              Add Order
            </button>

            {orders.length > 0 && (
              <button
                onClick={handlePayment}
                className="w-full rounded-lg bg-yellow-600 px-4 py-2 text-white transition-colors hover:bg-yellow-700"
              >
                Pay Orders
              </button>
            )}

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
        meals={meals}
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

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-xl font-semibold">Payment Details</h3>
            <div className="mb-4">
              <p className="text-lg">
                Total Amount: <span className="font-bold">₪{totalAmount}</span>
              </p>

              {/* Meals Summary */}
              <div className="mt-4">
                <p className="mb-2 font-medium">Meals Summary:</p>
                <div className="max-h-48 overflow-y-auto">
                  {Object.entries(
                    orders.reduce((acc, order) => {
                      order.meals?.forEach((meal) => {
                        if (!acc[meal.name]) {
                          acc[meal.name] = 0
                        }
                        acc[meal.name] += meal.quantity
                      })
                      return acc
                    }, {})
                  ).map(([mealName, quantity]) => (
                    <div
                      key={mealName}
                      className="mb-2 flex items-center justify-between rounded-lg bg-gray-50 p-2"
                    >
                      <span>{mealName}</span>
                      <span className="font-medium">x{quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Orders List */}
              <div className="mt-4">
                <p className="mb-2 font-medium">
                  Orders for Table {tableNumber}:
                </p>
                <div className="max-h-48 overflow-y-auto">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="mb-2 flex items-center justify-between rounded-lg bg-gray-50 p-2"
                    >
                      <span>Order #{order.number}</span>
                      <span
                        className={`text-sm ${
                          order.ready ? "text-green-600" : "text-yellow-600"
                        }`}
                      >
                        {order.ready ? "Ready" : "Preparing"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="rounded-lg bg-gray-100 px-4 py-2 text-gray-600 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmPayment}
                className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TableCard
