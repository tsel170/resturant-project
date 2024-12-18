import React, { useState } from "react"
import Tables from "./Tables"
import Orders from "./orders"
import AddOrder from "./AddOrder"
import Delivered from "./Delivered.jsx"

const Waiter = () => {
  const [AddOrderObject, setAddOrderObject] = useState(null)
  const [deliveredOrderes, setDeliveredOrderes] = useState([])
  console.log()

  const [tables, setTables] = useState([
    { number: 1, order: [3] },
    { number: 2, order: [4] },
    { number: 3, order: [5, 6, 7] },
  ])
  const [orders, setOrders] = useState([
    {
      table: 1,
      number: 3,
      items: ["salmon", "cake", "lemonade"],
      ready: true,
      delivered: true,
    },
    {
      table: 2,
      number: 4,
      items: ["salmon", "cake", "lemonade"],
      ready: false,
      delivered: false,
    },
    {
      table: 3,
      number: 5,
      items: ["salmon", "cake", "lemonade"],
      delivered: false,
      ready: true,
    },
    {
      table: 3,
      number: 6,
      items: ["salmon", "cake", "lemonade"],
      ready: false,
      delivered: false,
    },
    {
      table: 3,
      number: 7,
      items: ["salmon", "cake", "lemonade"],
      ready: false,
      delivered: false,
    },
  ])

  const delivered = (i) => {
    setDeliveredOrderes((prev) => [...prev, orders[i]])
    const newArr = [...orders]
    newArr.splice(i, 1)
    setOrders([...newArr])
    console.log(orders + i)
  }

  return (
    <div className="flex flex-wrap justify-around">
      <Tables params={{ tables, orders, setAddOrderObject }} />
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
      <Delivered params={{ deliveredOrderes }} />
    </div>
  )
}
export default Waiter
