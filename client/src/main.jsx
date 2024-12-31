import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.jsx"
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext.jsx"
// import App2 from "./App 2.jsx"

createRoot(document.getElementById("root")).render(<App />)
