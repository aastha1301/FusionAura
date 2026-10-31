import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setCustomerSession } from "../slices/authSlice"
import { apiRequest } from "../api"

function Signup() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) return setError("Passwords do not match.")
    if (!/^\d{10}$/.test(formData.phone)) return setError("Phone number must be 10 digits.")

    try {
      setLoading(true)
      const result = await apiRequest("/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        })
      })
      dispatch(setCustomerSession(result))
      navigate("/")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080709] flex items-center justify-center px-4 py-10">
      <div className="bg-[#101014] w-full max-w-md p-5 sm:p-8 rounded-2xl shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
        <h1 className="text-3xl font-bold text-center text-[#f06b91]">Create Account</h1>
        <p className="text-center text-zinc-500 mt-2 mb-8">Join Fusion Aura</p>
        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-5">{error}</div>}

        <form onSubmit={handleSubmit}>
          {[
            ["name", "Full Name", "text", "Enter your name"],
            ["email", "Email", "email", "Enter your email"],
            ["phone", "Phone Number", "text", "Enter 10 digit phone number"]
          ].map(([name, label, type, placeholder]) => (
            <div className="mb-4" key={name}>
              <label className="block text-sm font-medium mb-2">{label}</label>
              <input type={type} name={name} value={formData[name]} maxLength={name === "phone" ? 10 : undefined} onChange={(e) => setFormData({ ...formData, [name]: e.target.value })} placeholder={placeholder} className="w-full bg-[#080709] border border-white/10 rounded-lg px-4 py-3" required />
            </div>
          ))}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="At least 6 characters" className="w-full bg-[#080709] border border-white/10 rounded-lg px-4 py-3" required />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} placeholder="Confirm password" className="w-full bg-[#080709] border border-white/10 rounded-lg px-4 py-3" required />
          </div>
          <button disabled={loading} className="w-full bg-[#e85b83] text-white py-3 rounded-lg font-medium hover:bg-[#c9476d] disabled:opacity-60">
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <p className="text-center text-sm text-zinc-500 mt-6">Already have an account? <Link to="/login" className="text-[#f06b91] font-medium hover:underline">Login</Link></p>
      </div>
    </div>
  )
}
export default Signup
