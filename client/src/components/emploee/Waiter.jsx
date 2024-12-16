import React from "react"
import Tables from "./Tables"

const Waiter = () => {
  const tables = [
    { number: 1, order: [3] },
    { number: 2, order: [4] },
    { number: 3, order: [5, 6, 6] },
  ]
  const orders = [
    { number: 3, items: ["salmon", "cake", "lemonade"] },
    { number: 4, items: ["salmon", "cake", "lemonade"] },
    { number: 5, items: ["salmon", "cake", "lemonade"] },
    { number: 6, items: ["salmon", "cake", "lemonade"] },
  ]

  return (
    <div className="flex flex-wrap">
      <Tables params={{ tables, orders }} />
      <div></div>
    </div>
  )
}
export default Waiter
