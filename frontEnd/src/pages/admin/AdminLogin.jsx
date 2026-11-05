import { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { setAdminSession } from "../../slices/authSlice"
import { apiRequest } from "../../api"

function AdminLogin() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); setError("")
    try {
      setLoading(true)
      const result = await apiRequest("/auth/admin/login", { method: "POST", body: JSON.stringify(formData) })
      dispatch(setAdminSession(result))
      navigate("/admin")
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  return <div className="flex min-h-screen items-center justify-center bg-[#080709] px-4 py-8 sm:px-6 sm:py-12">
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#101014] p-5 sm:p-8">
      <div className="text-center"><img src="/peacock-feather.svg" className="w-14 h-14 mx-auto" alt="" /><p className="text-[#f06b91] uppercase tracking-widest text-sm mt-3">Fusion Aura</p><h1 className="text-3xl font-bold mt-2">Admin Login</h1><p className="text-zinc-500 text-sm mt-2">Manage services and appointments</p></div>
      {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mt-6">{error}</div>}
      <form onSubmit={handleSubmit} className="mt-6">
        <label className="block text-sm font-medium mb-2">Admin Email</label>
        <input type="email" value={formData.email} onChange={e=>setFormData({...formData,email:e.target.value})} placeholder="Enter your staff email" className="w-full bg-[#080709] border border-white/10 rounded-lg px-4 py-3" required />
        <label className="block text-sm font-medium mb-2 mt-5">Password</label>
        <input type="password" value={formData.password} onChange={e=>setFormData({...formData,password:e.target.value})} placeholder="Enter admin password" className="w-full bg-[#080709] border border-white/10 rounded-lg px-4 py-3" required />
        <button disabled={loading} className="w-full bg-[#e85b83] text-white py-3 rounded-lg mt-6 hover:bg-[#c9476d] disabled:opacity-60">{loading ? "Signing in..." : "Login as Admin"}</button>
      </form>
    </div>
  </div>
}
export default AdminLogin
