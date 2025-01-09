import React, { useState, useEffect, useContext } from "react"
import DefaultPage from "../components/general/DefaultPage"
import { AuthContext } from "../context/AuthContext"
import axios from "axios"

const EnterShift = () => {
  const [currentTime, setCurrentTime] = useState("")
  const { user, setUser } = useContext(AuthContext)
  const [showTipsModal, setShowTipsModal] = useState(false)
  const [tipsAmount, setTipsAmount] = useState("")

  useEffect(() => {
    // Update time every second
    const interval = setInterval(() => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      )
    }, 1000)

    return () => clearInterval(interval) // Cleanup interval on component unmount
  }, [])

  const handleToggleShift = async () => {
    try {
      if (user?.enteredShift) {
        // Show modal instead of immediately ending shift
        if (user?.jobTitle === "waiter") {
          setShowTipsModal(true)
        } else {
          await axios.put(
            `${import.meta.env.VITE_SERVER}/api/users/toggleShift/${user._id}`
          )

          // Update user data
          const newUser = await axios.get(
            `${import.meta.env.VITE_SERVER}/api/users/user/${user._id}`
          )
          setUser(newUser.data.user)
        }
        return
      }

      // Regular shift start logic
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER}/api/users/toggleShift/${user._id}`
      )
      if (response.data.success) {
        // You might want to update the user context here with the new shift status
        const newUser = await axios.get(
          `${import.meta.env.VITE_SERVER}/api/users/user/${user._id}`
        )
        console.log("newUser", newUser.data.user)
        setUser(newUser.data.user)
        console.log("Shift toggled successfully")
      }
    } catch (error) {
      console.error("Error toggling shift:", error)
    }
  }

  const handleSubmitTips = async () => {
    try {
      // First update the tips
      await axios.put(
        `${import.meta.env.VITE_SERVER}/api/users/updateTips/${user._id}`,
        { tipsAmount: Number(tipsAmount) },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      // Then end the shift
      await axios.put(
        `${import.meta.env.VITE_SERVER}/api/users/toggleShift/${user._id}`
      )

      // Update user data
      const newUser = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/users/user/${user._id}`
      )
      setUser(newUser.data.user)

      // Close modal and reset tips amount
      setShowTipsModal(false)
      setTipsAmount("")
    } catch (error) {
      console.error("Error submitting tips:", error)
    }
  }

  const content = (
    <>
      {/* Header Section */}
      <div className="mb-10 flex items-center justify-between rounded-lg bg-white p-6 shadow-md backdrop-blur-md">
        <div className="flex items-center gap-4">
          <img
            src={`https://avatar.iran.liara.run/username?username=${user?.name.replace(" ", "+")}+${user?.jobTitle.replace(" ", "+")}`}
            alt={`${user?.name}'s avatar`}
            className="h-12 w-12 rounded-full"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{user?.name}</h1>
            <p className="text-lg text-gray-600">{user?.jobTitle}</p>
          </div>
        </div>
        <div className="text-2xl font-medium text-blue-600">{currentTime}</div>
      </div>

      {/* Main Content */}
      <div className="flex h-2/4 flex-col items-center justify-center rounded-lg bg-white p-6 shadow-md backdrop-blur-md">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-gray-800">Welcome Back!</h2>
          <p className="mt-2 text-lg text-gray-600">
            Ready to start your shift? Click the button below.
          </p>
        </div>
        <button
          onClick={handleToggleShift}
          className={`transform rounded-lg ${user?.enteredShift ? "bg-red-500 hover:bg-red-600 active:bg-red-700" : "bg-blue-500 hover:bg-blue-600 active:bg-blue-700"} px-8 py-4 text-2xl font-semibold text-white shadow-lg transition-transform hover:scale-105 active:scale-95`}
        >
          {user?.enteredShift ? "End Shift" : "Start Shift"}
        </button>
      </div>

      {/* Decorative Section */}
      <div
        className={`mt-10 grid ${
          user?.jobTitle === "waiter" ? "grid-cols-3" : "grid-cols-2"
        } gap-6`}
      >
        <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-md">
          <p className="text-lg text-gray-600">Last Shift Duration</p>
          <p className="mt-2 text-2xl font-bold text-blue-600">
            {user?.lastShiftDuration?.hours || 0}h{" "}
            {user?.lastShiftDuration?.minutes || 0}m
          </p>
        </div>
        {user?.jobTitle === "waiter" ? (
          <>
            <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-md">
              <p className="text-lg text-gray-600">Tips Earned (Last Shift)</p>
              <p className="mt-2 text-2xl font-bold text-blue-600">
                ₪{user.tipsLastShift || 0}
              </p>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-md">
              <p className="text-lg text-gray-600">Tips Earned (This Month)</p>
              <p className="mt-2 text-2xl font-bold text-blue-600">
                ₪{user.tipsTotal || 0}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-md">
              <p className="text-lg text-gray-600">Hours Worked (This Month)</p>
              <p className="mt-2 text-2xl font-bold text-blue-600">
                {user?.workedThisMonth?.hours || 0}h{" "}
                {user?.workedThisMonth?.minutes || 0}m
              </p>
            </div>
            {/* <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-md">
              <p className="text-lg text-gray-600">Average Shift Duration</p>
              <p className="mt-2 text-2xl font-bold text-blue-600">
                {user.workedThisMonth
                  ? (
                      (user.workedThisMonth.hours +
                        user.workedThisMonth.minutes / 60) /
                      30
                    ).toFixed(1)
                  : 0}
                h
              </p>
            </div> */}
          </>
        )}
      </div>

      {/* Tips Modal */}
      {showTipsModal && user?.jobTitle === "waiter" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-8 shadow-xl">
            <h3 className="mb-4 text-xl font-bold">Enter Tips Amount</h3>
            <input
              type="number"
              value={tipsAmount}
              onChange={(e) => setTipsAmount(e.target.value)}
              className="mb-4 w-full rounded border p-2"
              placeholder="Enter amount in ₪"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowTipsModal(false)}
                className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitTips}
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Submit & End Shift
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )

  return (
    <DefaultPage role="employee" backButton>
      {content}
    </DefaultPage>
  )
}

export default EnterShift
