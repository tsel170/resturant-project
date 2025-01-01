import React, { useState } from "react"
import Header from "../../components/general/Header"
import Sidebar from "../../components/general/Sidebar"
import Footer from "../../components/general/Footer"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
// Add this at the top of your component file
const ShiftsManagement = () => {
  const [events, setEvents] = useState([
    // You can add some sample events here, or load them from your own API
    {
      title: "Sample Shift",
      start: "2024-03-20",
      end: "2024-03-21",
    },
  ])

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-gray-100">
      <Header role={"manager"} />
      <div className="flex flex-1">
        <Sidebar />
        <div className="mx-auto flex-1 content-center p-6">
          <h2 className="mb-6 text-2xl font-bold text-gray-800">
            Calendar View
          </h2>

          <div className="mt-6 rounded-lg bg-white p-6 shadow-lg [&_.fc-button-active:hover]:bg-blue-800 [&_.fc-button-active]:bg-blue-800 [&_.fc-button:hover]:bg-blue-700 [&_.fc-button]:border-0 [&_.fc-button]:bg-blue-600 [&_.fc-button]:px-4 [&_.fc-button]:py-2 [&_.fc-button]:font-medium [&_.fc-col-header]:p-2 [&_.fc-day-today]:bg-blue-50 [&_.fc-daygrid-day]:p-2 [&_.fc-event]:rounded-md [&_.fc-event]:bg-blue-500 [&_.fc-event]:p-1 [&_.fc-header-toolbar]:mb-6 [&_.fc-scrollgrid-section-header]:bg-gray-50 [&_.fc-toolbar-title]:text-2xl [&_.fc-toolbar-title]:font-bold [&_.fc-toolbar-title]:text-blue-900 [&_.fc-toolbar]:flex [&_.fc-toolbar]:flex-wrap [&_.fc-toolbar]:gap-4 [&_.fc-view]:rounded-lg">
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={events}
              height="650px"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,dayGridWeek",
              }}
              buttonText={{
                today: "Today",
                month: "Month",
                week: "Week",
              }}
              dayMaxEvents={true}
              eventDisplay="block"
              contentHeight="auto"
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ShiftsManagement
