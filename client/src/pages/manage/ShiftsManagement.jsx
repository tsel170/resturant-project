import React, { useState, useEffect } from "react"
import DefaultPage from "../../components/general/DefaultPage"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import axios from "axios"
import AddShiftModal from "../../components/manager/AddShiftModal"
import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"

const ShiftsManagement = () => {
  return <DefaultPage role="manager" title="Shifts Management"></DefaultPage>
}

export default ShiftsManagement
