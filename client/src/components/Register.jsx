import React, { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const Register = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [cities, setCities] = useState([])
  const [cityId, setCityId] = useState("")
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  // Fetch cities when the component mounts
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get("http://localhost:5000/cities")
        setCities(response.data)
      } catch (error) {
        console.error("Failed to fetch cities", error)
      }
    }

    // fetchCities()
    setCities([{ name: "city", _id: "cityID" }])
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    console.log(email)
    console.log(password)
    console.log(cityId)

    try {
      const response = await axios.post("http://localhost:5000/auth/register", {
        email,
        password,
        cityId,
      })

      if (response.status === 201) {
        alert("User registered successfully!")
        navigate("/login")
      }
    } catch (error) {
      console.error("Registration failed:", error)
      setError(error.response?.data?.message || "Registration failed")
    }
  }

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label>City:</label>
          <select
            value={cityId}
            onChange={(e) => setCityId(e.target.value)}
            required
          >
            <option value="">Select a city</option>
            {cities.map((city) => (
              <option key={city._id} value={city._id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit">Register</button>
      </form>
    </div>
  )
}

export default Register
