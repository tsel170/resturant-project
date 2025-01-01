import React, { useState } from "react"
import Header from "../../components/general/Header"
import Sidebar from "../../components/general/Sidebar"
import Footer from "../../components/general/Footer"
import axios from "axios"
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"

const clientId = import.meta.env.VITE_CLIENT_ID

const ShiftsManagement = () => {
  const [events, setEvents] = useState([])
  const [accessToken, setAccessToken] = useState(null)

  const handleGoogleSuccess = async (credentialResponse) => {
    setAccessToken(credentialResponse.access_token)
    await loadEvents()
  }

  const loadEvents = async () => {
    if (!accessToken) return

    try {
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

      const calendarEvents = response.data.items.map((event) => ({
        title: event.summary,
        start: event.start.dateTime || event.start.date,
        end: event.end.dateTime || event.end.date,
      }))

      setEvents(calendarEvents)
    } catch (error) {
      console.error("Error loading calendar events:", error)
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

          <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.log("Login Failed")}
              scope="https://www.googleapis.com/auth/calendar.readonly"
            />
          </GoogleOAuthProvider>

          <div className="mt-6">
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={events}
              height="500px"
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ShiftsManagement
