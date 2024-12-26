import React, { useEffect, useState } from "react"
import Tables from "./Tables"
import Orders from "./orders"
import AddOrder from "./AddOrder"
import Delivered from "./Delivered.jsx"
import axios from "axios"

const Waiter = ({ params }) => {
  const [AddOrderObject, setAddOrderObject] = useState(null)
  const { orders, setOrders } = params
  const [tables, setTables] = useState([
    { number: 1, order: [3] },
    { number: 2, order: [4] },
    { number: 3, order: [5, 6, 7] },
  ])

  const delivered = (i) => {
    orders[i].delivered = true
    setOrders((prev) => [...prev])
  }

  const pay = (i) => {
    console.log("pay")

    tables[i].order.forEach((order) => {
      for (let i = 0; i < orders.length; i++) {
        console.log(order)
        if (order == orders[i].number && !orders[i].paid) {
          orders[i].paid = true
        }
      }
    })
    setOrders((prev) => [...prev])
  }

  return (
    <div className="flex flex-wrap justify-around">
      <Tables params={{ tables, orders, setAddOrderObject, pay }} />
      <AddOrder
        params={{
          AddOrderObject,
          setAddOrderObject,
          tables,
          setTables,
          setOrders,
        }}
      />
      <Orders key={orders.length} params={{ orders, delivered }} />
      <Delivered params={{ orders }} />
    </div>
  )
}
export default Waiter
