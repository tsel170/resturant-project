import { useContext, useEffect, useRef } from "react"
import { AuthContext } from "../../context/AuthContext"

const NotificationHandler = () => {
  const { orders, user } = useContext(AuthContext)
  const previousOrders = useRef([])
  const activeNotifications = useRef(new Set()) // Track active notification IDs

  // Check for newly ready orders
  useEffect(() => {
    // Only show notifications for waiters
    if (user?.jobTitle !== "waiter") return

    const newlyReadyOrders = orders.filter((order) => {
      const previousOrder = previousOrders.current.find(
        (prev) => prev._id === order._id
      )

      // Only show notification if:
      // 1. Order is ready and not delivered
      // 2. Either no previous state OR wasn't ready before
      // 3. Haven't shown a notification for this order yet
      return (
        order.ready &&
        !order.delivered &&
        (!previousOrder || !previousOrder.ready) &&
        !activeNotifications.current.has(order._id)
      )
    })

    // Create alert for each newly ready order
    newlyReadyOrders.forEach((order) => {
      // Add to active notifications set
      activeNotifications.current.add(order._id)

      const alertDiv = document.createElement("div")
      alertDiv.id = `notification-${order._id}` // Add ID to track this specific alert
      alertDiv.className =
        "fixed top-4 right-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-lg z-50"
      alertDiv.innerHTML = `
        <div class="flex items-center">
          <div class="py-1">
            <svg class="h-6 w-6 text-yellow-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <div>
            <p class="font-bold">New Order Ready!</p>
            <p class="text-sm">Order #${order.bonNumber} for Table ${order.tableNumber} is ready for delivery</p>
          </div>
        </div>
      `

      // Add close button
      const closeButton = document.createElement("button")
      closeButton.className =
        "absolute top-0 right-0 mt-2 mr-2 text-yellow-700 hover:text-yellow-900"
      closeButton.innerHTML = "×"
      closeButton.onclick = () => {
        document.body.removeChild(alertDiv)
        activeNotifications.current.delete(order._id) // Remove from active notifications
      }
      alertDiv.appendChild(closeButton)

      // Add to document
      document.body.appendChild(alertDiv)
    })

    // Update previous orders reference
    previousOrders.current = JSON.parse(JSON.stringify(orders))
  }, [orders, user])

  return null // This component doesn't render anything
}

export default NotificationHandler
