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
  const [showDinersModal, setShowDinersModal] = useState(false)
  const [selectedDiners, setSelectedDiners] = useState(1)
  const [isAssigning, setIsAssigning] = useState(false)
  const [isFreeing, setIsFreeing] = useState(false)
  const [isCanceling, setIsCanceling] = useState(false)
  const [isDinersModalVisible, setIsDinersModalVisible] = useState(false)
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false)

  useEffect(() => {
    setOrders(tableOrders)
  }, [tableOrders])

  const handleAssignClick = async () => {
    setIsAssigning(true)
    try {
      await onAssign(selectedDiners)
      setShowDinersModal(false)
      setSelectedDiners(1)
    } catch (error) {
      console.error("Error assigning table:", error)
    } finally {
      setIsAssigning(false)
    }
  }

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
      const unpaidDeliveredOrders = orders.filter((localOrder) => {
        const fullOrder = allOrders.find((order) => order.canceled === true)
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

      await axios.put(
        import.meta.env.VITE_SERVER + "/api/branches/updateTableOccupied",
        {
          branchId: branchId,
          tableNumber: tableNumber,
        }
      )
      fetchTables()
      setIsConfirmationVisible(false)
      setTimeout(() => {
        setShowConfirmation(false)
      }, 300)
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

      // Start closing animation
      setIsPaymentModalVisible(false)
      setTimeout(() => {
        // If all payments successful, clear orders and close modal
        setOrders([])
        updateTable(tableNumber, {
          tableOrders: [],
        })
        setShowPaymentModal(false)
        setOrders([])
      }, 300)
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

  const handleDinersSubmit = async () => {
    setIsAssigning(true)
    try {
      await onAssign(selectedDiners)
      setIsDinersModalVisible(false)
      setTimeout(() => {
        setShowDinersModal(false)
        setSelectedDiners(1)
      }, 300)
    } catch (error) {
      console.error("Error assigning table:", error)
    } finally {
      setIsAssigning(false)
    }
  }

  const handleCancelOrder = async (order) => {
    setIsCanceling(true)
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER}/api/bons/toggleCancelBon/${order.bonNumber}`
      )

      // Refresh the orders list
      const updatedOrders = orders.map((o) =>
        o.number === order.bonNumber ? { ...o, canceled: !o.canceled } : o
      )
      setOrders(updatedOrders)
    } catch (error) {
      console.error("Error updating order status:", error)
    } finally {
      setIsCanceling(false)
    }
  }

  // Add this helper function to check if all orders are canceled
  const areAllOrdersCanceled = (orders) => {
    return (
      orders.length > 0 &&
      orders.every((order) => {
        const fullOrder = allOrders.find((o) => o.bonNumber === order.number)
        return fullOrder?.canceled
      })
    )
  }

  const handleOpenDinersModal = () => {
    setShowDinersModal(true)
    setTimeout(() => setIsDinersModalVisible(true), 50)
  }

  const handleCloseDinersModal = () => {
    setIsDinersModalVisible(false)
    setTimeout(() => setShowDinersModal(false), 300)
  }

  const handleOpenPaymentModal = () => {
    setShowPaymentModal(true)
    setTimeout(() => setIsPaymentModalVisible(true), 50)
  }

  const handleClosePaymentModal = () => {
    setIsPaymentModalVisible(false)
    setTimeout(() => setShowPaymentModal(false), 300)
  }

  const handleOpenConfirmation = () => {
    setShowConfirmation(true)
    setTimeout(() => setIsConfirmationVisible(true), 50)
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
            <ul className="space-y-2">
              {orders.length > 0
                ? orders.map((order, index) => {
                    // Add debug logging
                    console.log("Processing order:", order)

                    const fullOrder = allOrders.find(
                      (o) => o.bonNumber === order.number
                    )
                    console.log("Found full order in render:", fullOrder)

                    return (
                      <li
                        key={order.number || index}
                        className={`flex items-center justify-between ${
                          fullOrder?.canceled
                            ? "rounded-md bg-gray-50 p-2 text-gray-400"
                            : !fullOrder?.delivered
                              ? "font-medium text-red-600"
                              : "text-gray-600"
                        }`}
                      >
                        <div className="flex items-center">
                          {order.number}
                          {fullOrder &&
                            !fullOrder.delivered &&
                            !fullOrder.canceled && (
                              <span className="ml-2 text-xs text-red-500">
                                (Not Delivered)
                              </span>
                            )}
                          {fullOrder?.canceled && (
                            <span className="ml-2 text-xs text-gray-500">
                              (Canceled)
                            </span>
                          )}
                        </div>
                        {fullOrder && !fullOrder.delivered && (
                          <button
                            onClick={() => handleCancelOrder(fullOrder)}
                            disabled={isCanceling}
                            className={`ml-2 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                              isCanceling
                                ? "cursor-not-allowed bg-gray-100 text-gray-400"
                                : fullOrder.canceled
                                  ? "bg-green-100 text-green-600 hover:bg-green-200"
                                  : "bg-red-100 text-red-600 hover:bg-red-200"
                            }`}
                          >
                            {isCanceling
                              ? "Processing..."
                              : fullOrder.canceled
                                ? "Add Back"
                                : "Cancel"}
                          </button>
                        )}
                      </li>
                    )
                  })
                : "None"}
            </ul>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 space-y-2">
          {!occuipied && (
            <button
              onClick={handleOpenDinersModal}
              disabled={isAssigning}
              className={`w-full rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors ${
                isAssigning
                  ? "cursor-not-allowed opacity-75"
                  : "hover:bg-blue-600"
              }`}
            >
              {isAssigning ? "Assigning..." : "Assign Table"}
            </button>
          )}

          {occuipied && (
            <button
              onClick={handleAddOrder}
              className="w-full rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
            >
              Add Order
            </button>
          )}

          {occuipied && orders.length > 0 && !areAllOrdersCanceled(orders) && (
            <button
              onClick={handleOpenPaymentModal}
              disabled={isPaymentLoading}
              className={`w-full rounded-lg bg-yellow-500 px-4 py-2 text-white transition-colors ${
                isPaymentLoading
                  ? "cursor-not-allowed opacity-75"
                  : "hover:bg-yellow-600"
              }`}
            >
              Pay Orders
            </button>
          )}

          {/* Show Free Table button if there are no unpaid orders OR if all orders are canceled */}
          {occuipied &&
            (orders.length === 0 || areAllOrdersCanceled(orders)) && (
              <button
                onClick={handleOpenConfirmation}
                disabled={isFreeingTable}
                className={`w-full rounded-lg bg-red-600 px-4 py-2 text-white transition-colors ${
                  isFreeingTable
                    ? "cursor-not-allowed opacity-75"
                    : "hover:bg-red-700"
                }`}
              >
                {isFreeingTable ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="h-5 w-5 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Freeing Table...</span>
                  </div>
                ) : (
                  "Free Table"
                )}
              </button>
            )}
        </div>
      </div>

      <OrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        onSubmit={handleSubmitOrder}
        tableNumber={tableNumber}
        meals={meals}
      />

      {/* Diners Selection Modal */}
      {showDinersModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
            isDinersModalVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`relative w-full max-w-md transform rounded-lg bg-white p-6 shadow-xl transition-all duration-300 ${
              isDinersModalVisible
                ? "scale-100 opacity-100"
                : "scale-95 opacity-0"
            }`}
          >
            <h3 className="mb-4 text-xl font-semibold">
              Select Number of Diners
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Number of Diners
              </label>
              <input
                type="number"
                min="1"
                value={selectedDiners}
                onChange={(e) =>
                  setSelectedDiners(parseInt(e.target.value) || 1)
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={handleCloseDinersModal}
                className="rounded-lg bg-gray-100 px-4 py-2 text-gray-600 hover:bg-gray-200"
                disabled={isAssigning}
              >
                Cancel
              </button>
              <button
                onClick={handleDinersSubmit}
                disabled={isAssigning}
                className={`rounded-lg px-4 py-2 text-white transition-colors ${
                  isAssigning
                    ? "cursor-not-allowed bg-blue-400"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isAssigning ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="h-5 w-5 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Assigning...</span>
                  </div>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
            isPaymentModalVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`relative w-full max-w-md transform rounded-lg bg-white p-6 shadow-xl transition-all duration-300 ${
              isPaymentModalVisible
                ? "scale-100 opacity-100"
                : "scale-95 opacity-0"
            }`}
          >
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
                onClick={handleClosePaymentModal}
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
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="h-5 w-5 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Confirm Payment"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
            isConfirmationVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`relative w-full max-w-md transform rounded-lg bg-white p-6 shadow-xl transition-all duration-300 ${
              isConfirmationVisible
                ? "scale-100 opacity-100"
                : "scale-95 opacity-0"
            }`}
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
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="h-5 w-5 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Freeing Table...</span>
                  </div>
                ) : (
                  "Free Table"
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
