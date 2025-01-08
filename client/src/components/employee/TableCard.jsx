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
  const {
    fetchTables,
    meals,
    orders: allOrders,
    user,
  } = useContext(AuthContext)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [orders, setOrders] = useState(tableOrders)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [totalAmount, setTotalAmount] = useState(0)
  const [mealsSummary, setMealsSummary] = useState({})
  const [isPaymentLoading, setIsPaymentLoading] = useState(false)
  const [paymentError, setPaymentError] = useState(null)
  const [isFreeingTable, setIsFreeingTable] = useState(false)
  const [freeTableError, setFreeTableError] = useState(null)
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false)

  useEffect(() => {
    setOrders(tableOrders)
  }, [tableOrders])

  const handleFreeTable = () => {
    setShowConfirmation(true)
    setTimeout(() => setIsConfirmationVisible(true), 50)
  }

  const handleCloseConfirmation = () => {
    setIsConfirmationVisible(false)
    setTimeout(() => setShowConfirmation(false), 300)
    setFreeTableError(null)
  }

  const confirmFreeTable = async () => {
    setIsFreeingTable(true)
    setFreeTableError(null)

    try {
      await axios.put(
        import.meta.env.VITE_SERVER + "/api/branches/updateTableOccupied",
        {
          branchId: branchId,
          tableNumber: tableNumber,
        }
      )
      fetchTables()
      setShowConfirmation(false)
    } catch (error) {
      console.error("Error freeing table:", error)
      setFreeTableError(
        error.response?.data?.message ||
          "Failed to free table. Please try again."
      )
    } finally {
      setIsFreeingTable(false)
    }
  }

  const handleAddOrder = () => {
    setShowOrderModal(true)
  }

  const handleSubmitOrder = async (newOrder) => {
    console.log("newOrder", newOrder)
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
    // Get full order details from allOrders and filter for delivered AND unpaid orders only
    const fullOrderDetails = orders
      .map((localOrder) => {
        return allOrders.find(
          (order) =>
            order.bonNumber === localOrder.number &&
            order.delivered === true &&
            order.paid === false // Add this condition
        )
      })
      .filter((order) => order) // Remove any undefined orders

    console.log("Unpaid delivered orders:", fullOrderDetails)

    const summary = fullOrderDetails.reduce((acc, order) => {
      if (order && Array.isArray(order.meals)) {
        order.meals.forEach((meal) => {
          if (meal && meal.mealTitle) {
            if (!acc[meal.mealTitle]) {
              acc[meal.mealTitle] = {
                quantity: 0,
                price: meal.meal.price,
              }
            }
            acc[meal.mealTitle].quantity += meal.quantity || 1
          }
        })
      }
      return acc
    }, {})

    setMealsSummary(summary)
    setShowPaymentModal(true)
  }

  const confirmPayment = async () => {
    setIsPaymentLoading(true)
    setPaymentError(null)

    try {
      // Get delivered and unpaid orders only
      const unpaidDeliveredOrders = orders.filter((localOrder) => {
        const fullOrder = allOrders.find(
          (order) =>
            order.bonNumber === localOrder.number &&
            order.delivered === true &&
            order.paid === false
        )
        return fullOrder
      })

      // Process each order payment sequentially
      for (const order of unpaidDeliveredOrders) {
        try {
          await axios.put(
            `${import.meta.env.VITE_SERVER}/api/Bons/updatePaidBon/${order.number}`,
            {
              tableNumber,
              branchId,
              bonNumber: order.number,
            }
          )
        } catch (orderError) {
          throw new Error(
            `Failed to process payment for order #${order.number}: ${orderError.message}`
          )
        }
      }

      // If all payments successful, clear orders and close modal
      setOrders([])
      updateTable(tableNumber, {
        tableOrders: [],
      })
      setShowPaymentModal(false)
      setOrders([])
    } catch (error) {
      console.error("Error processing payments:", error)
      setPaymentError(
        error.response?.data?.message ||
          error.message ||
          "Failed to process payments. Please try again."
      )
    } finally {
      setIsPaymentLoading(false)
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
          <p className="rounded-full bg-gray-200 px-4 py-2 text-base font-semibold text-gray-600">
            <span className="mr-1 text-gray-500">served by</span>
            {user.name}
          </p>
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
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ease-in-out ${isConfirmationVisible ? "bg-black bg-opacity-50" : "bg-black bg-opacity-0"}`}
        >
          <div
            className={`rounded-lg bg-white p-6 shadow-xl transition-all duration-300 ease-in-out ${isConfirmationVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
          >
            <h3 className="mb-4 text-lg font-semibold">
              Are you sure you want to free this table?
            </h3>

            {freeTableError && (
              <div className="mb-4 rounded-md bg-red-50 p-4 text-red-600">
                <p className="font-medium">Error</p>
                <p className="text-sm">{freeTableError}</p>
              </div>
            )}

            <div className="flex justify-end gap-4">
              <button
                onClick={handleCloseConfirmation}
                className="rounded-lg bg-gray-100 px-4 py-2 text-gray-600 hover:bg-gray-200"
                disabled={isFreeingTable}
              >
                Cancel
              </button>
              <button
                onClick={confirmFreeTable}
                disabled={isFreeingTable}
                className={`rounded-lg px-4 py-2 text-white transition-colors ${
                  isFreeingTable
                    ? "cursor-not-allowed bg-red-400"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isFreeingTable ? (
                  <div className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </div>
                ) : (
                  "Free Table"
                )}
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

            {paymentError && (
              <div className="mb-4 rounded-md bg-red-50 p-4 text-red-600">
                <p className="font-medium">Payment Error</p>
                <p className="text-sm">{paymentError}</p>
              </div>
            )}

            <div className="mb-4">
              <div className="mt-4">
                <p className="mb-2 font-medium">Meals Summary:</p>
                <div className="max-h-48 overflow-y-auto">
                  {Object.entries(mealsSummary).map(([mealTitle, details]) => {
                    const subtotal = details.price * details.quantity
                    return (
                      <div
                        key={mealTitle}
                        className="mb-2 flex items-center justify-between rounded-lg bg-gray-50 p-2"
                      >
                        <span>{mealTitle}</span>
                        <span>
                          ₪{details.price} x{details.quantity} = ₪{subtotal}
                        </span>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-4 border-t pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span>
                      ₪
                      {Object.values(mealsSummary).reduce(
                        (total, details) =>
                          total + details.price * details.quantity,
                        0
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowPaymentModal(false)
                  setPaymentError(null)
                }}
                className="rounded-lg bg-gray-100 px-4 py-2 text-gray-600 hover:bg-gray-200"
                disabled={isPaymentLoading}
              >
                Cancel
              </button>
              <button
                onClick={confirmPayment}
                disabled={isPaymentLoading}
                className={`rounded-lg px-4 py-2 text-white transition-colors ${
                  isPaymentLoading
                    ? "cursor-not-allowed bg-green-400"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isPaymentLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </div>
                ) : (
                  "Confirm Payment"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TableCard
