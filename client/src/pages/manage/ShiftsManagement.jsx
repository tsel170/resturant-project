import React, { useState, useEffect } from "react"
import DefaultPage from "../../components/general/DefaultPage"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import axios from "axios"
import AddShiftModal from "../../components/manager/AddShiftModal"
import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"

const ShiftsManagement = () => {
  const [events, setEvents] = useState([
    // You can add some sample events here, or load them from your own API
    {
      title: "Sample Shift",
      start: "2024-03-20",
      end: "2024-03-21",
    },
  ])
  const { employees, setEmployees } = useContext(AuthContext)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)

  const fetchShifts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/shifts/allShifts"
      )
      console.log("All shifts:", response.data)

      // Transform the shifts data into FullCalendar event format
      const calendarEvents = response.data.map((shift) => ({
        title: `Shift ${shift.shiftType || ""}`,
        start: shift.date,
        end: shift.date, // If it's same-day shift
        // You can add more properties here like:
        // backgroundColor: shift.status === 'filled' ? '#4CAF50' : '#FFA726',
        // extendedProps: { shiftId: shift._id }
      }))

      setEvents(calendarEvents) // Update the calendar events
    } catch (error) {
      console.error("Error fetching shifts:", error)
    }
  }

  useEffect(() => {
    fetchShifts()
  }, [])

  // Add this new function to handle shift creation
  const handleAddShift = (date) => {
    setSelectedDate(date)
    setIsModalOpen(true)
  }

  // Add this function to render custom cell content
  const renderDayCellContent = (args) => {
    return (
      <div className="relative flex h-full min-h-[50px] flex-col justify-between p-1">
        <div className="text-sm">{args.dayNumberText}</div>
        <button
          onClick={(e) => {
            e.preventDefault()
            handleAddShift(args.date)
          }}
          className="absolute bottom-1 right-1 rounded-full bg-blue-500 p-1 text-white opacity-70 transition-opacity duration-200 hover:opacity-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
    )
  }

  return (
    <DefaultPage role="manager" title="Shifts Management">
      <h2 className="mb-4 text-xl font-bold text-gray-800">Calendar View</h2>
      <div className="mt-2 rounded-lg bg-white p-3 shadow-lg [&_.fc-button-active:hover]:bg-blue-800 [&_.fc-button-active]:bg-blue-800 [&_.fc-button:hover]:bg-blue-700 [&_.fc-button]:border-0 [&_.fc-button]:bg-blue-600 [&_.fc-button]:px-3 [&_.fc-button]:py-1 [&_.fc-button]:font-medium [&_.fc-col-header]:p-1 [&_.fc-day-today]:bg-blue-50 [&_.fc-daygrid-day]:min-h-[50px] [&_.fc-daygrid-day]:p-1 [&_.fc-event]:rounded-md [&_.fc-event]:bg-blue-500 [&_.fc-event]:p-1 [&_.fc-header-toolbar]:mb-2 [&_.fc-scrollgrid-section-header]:bg-gray-50 [&_.fc-toolbar-title]:text-lg [&_.fc-toolbar-title]:font-bold [&_.fc-toolbar-title]:text-blue-900 [&_.fc-toolbar]:flex [&_.fc-toolbar]:flex-wrap [&_.fc-toolbar]:gap-2 [&_.fc-view]:rounded-lg">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          height="400px"
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
          dayCellContent={renderDayCellContent}
        />
      </div>

      <AddShiftModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
      />
    </DefaultPage>
  )
}

export default ShiftsManagement
