import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setCustomerSession } from "../slices/authSlice"
import { apiRequest } from "../api"

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const returnTo = location.state?.from || "/"
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    if (!formData.email || !formData.password) return setError("Please enter email and password.")

    try {
      setLoading(true)
      const result = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(formData)
      })
      dispatch(setCustomerSession(result))
      navigate(returnTo, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-[#080709] flex items-center justify-center px-4 py-10">
      <div className="bg-[#101014] w-full max-w-md p-5 sm:p-8 rounded-2xl shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
        <h1 className="text-3xl font-bold text-center text-[#f06b91]">Welcome Back</h1>
        <p className="text-center text-zinc-500 mt-2 mb-8">Login to your Fusion Aura account</p> 

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-5">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input type="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Enter your email" className="w-full bg-[#080709] border border-white/10 rounded-lg px-4 py-3" />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input type="password" name="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Enter password" className="w-full bg-[#080709] border border-white/10 rounded-lg px-4 py-3" />
          </div>
          <button disabled={loading} className="w-full bg-[#e85b83] text-white py-3 rounded-lg font-medium hover:bg-[#c9476d] disabled:opacity-60">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-6">
          Don't have an account? <Link to="/signup" state={{ from: location.state?.from }} className="text-[#f06b91] font-medium hover:underline">Signup</Link>
        </p>
      </div>
    </div>
  )
}
export default Login
