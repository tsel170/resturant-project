import { useEffect, useCallback } from "react"

export const useNotifications = () => {
  const requestNotificationPermission = useCallback(async () => {
    try {
      // Check if the browser supports notifications
      if (!("Notification" in window)) {
        console.log("This browser does not support notifications")
        return false
      }

      // Check if we already have permission
      if (Notification.permission === "granted") {
        return true
      }

      // Request permission
      const permission = await Notification.requestPermission()
      console.log("Notification permission:", permission)
      return permission === "granted"
    } catch (error) {
      console.error("Error requesting notification permission:", error)
      return false
    }
  }, [])

  const sendNotification = useCallback(
    (title, options = {}) => {
      console.log("Attempting to send notification:", title)

      if (!("Notification" in window)) {
        console.log("This browser does not support notifications")
        return
      }

      if (Notification.permission !== "granted") {
        console.log("Notification permission not granted")
        requestNotificationPermission()
        return
      }

      try {
        const notification = new Notification(title, {
          ...options,
          silent: false, // Enable sound
        })

        notification.onclick = function () {
          window.focus()
          notification.close()
        }

        console.log("Notification sent successfully")
      } catch (error) {
        console.error("Error sending notification:", error)
      }
    },
    [requestNotificationPermission]
  )

  useEffect(() => {
    requestNotificationPermission()
  }, [requestNotificationPermission])

  return { sendNotification, requestNotificationPermission }
}
