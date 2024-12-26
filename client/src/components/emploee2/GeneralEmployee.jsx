import React from "react"

const GeneralEmployee = () => {
  return (
    <aside className="h-screen w-full flex-shrink-0 overflow-y-auto bg-green-600 text-white md:w-1/4">
      <ul className="space-y-4 p-4">
        <li className="flex cursor-pointer items-center rounded px-4 py-2 hover:bg-green-500">
          Notification
        </li>
        <li className="flex cursor-pointer items-center rounded px-4 py-2 hover:bg-green-500">
          Update
        </li>
        <li className="flex cursor-pointer items-center rounded px-4 py-2 hover:bg-green-500">
          Profile
        </li>
      </ul>
    </aside>
  )
}

export default GeneralEmployee
