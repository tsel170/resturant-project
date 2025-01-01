import React, { useState, useEffect } from "react"
import Header from "../../components/general/Header"
import Sidebar from "../../components/general/Sidebar"
import Footer from "../../components/general/Footer"
import axios from "axios"
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"

const ShiftsManagement = () => {
  const [calendarData, setCalendarData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [accessToken, setAccessToken] = useState(null)

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        setLoading(true)
        const response = await axios.get(
          "https://www.googleapis.com/calendar/v3/calendars/primary/events",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              timeMin: new Date().toISOString(),
              maxResults: 10,
              singleEvents: true,
              orderBy: "startTime",
            },
          }
        )
        setCalendarData(response.data)
        setError(null)
      } catch (err) {
        setError(err.message)
        console.error("Error fetching calendar:", err)
      } finally {
        setLoading(false)
      }
    }

    if (accessToken) {
      fetchCalendar()
    }
  }, [accessToken])

  const handleLoginSuccess = (credentialResponse) => {
    console.log("Login success:", credentialResponse)
    if (credentialResponse.access_token) {
      setAccessToken(credentialResponse.access_token)
    } else {
      setError("No access token received")
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-gray-100">
      <Header role={"manager"} />
      <div className="flex flex-1">
        <Sidebar />
        <div className="mx-auto flex-1 content-center p-6">
          <h2 className="mb-6 text-2xl font-bold text-gray-800">
            Calendar View
          </h2>

          {!accessToken && (
            <div className="mb-4">
              <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
                <GoogleLogin
                  onSuccess={handleLoginSuccess}
                  onError={() => {
                    console.error("Login Failed")
                    setError("Login Failed")
                  }}
                  scope="https://www.googleapis.com/auth/calendar.readonly"
                />
              </GoogleOAuthProvider>
            </div>
          )}

          <div className="rounded-lg bg-white p-4 shadow">
            {loading ? (
              <div>Loading calendar...</div>
            ) : error ? (
              <div>Error: {error}</div>
            ) : calendarData ? (
              <pre>{JSON.stringify(calendarData, null, 2)}</pre>
            ) : (
              <div>Please log in to view calendar</div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ShiftsManagement
