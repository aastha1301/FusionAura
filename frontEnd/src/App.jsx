import { useEffect, useLayoutEffect } from "react"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import AdminLayout from "./components/AdminLayout"
import ProtectedRoute from "./components/ProtectedRoute"

import Home from "./pages/Home"
import Services from "./pages/Services"
import About from "./pages/About"
import Reviews from "./pages/Reviews"
import Contact from "./pages/Contact"
import Booking from "./pages/Booking"
import MyBookings from "./pages/MyBookings"
import Login from "./pages/Login"
import Signup from "./pages/Signup"

import AdminLogin from "./pages/admin/AdminLogin"
import Dashboard from "./pages/admin/Dashboard"
import ManageServices from "./pages/admin/ManageServices"
import ManageBookings from "./pages/admin/ManageBookings"

import { fetchReviews } from "./slices/reviewSlice"
import { fetchServices } from "./slices/serviceSlice"

function CustomerLayout({ children }) {
  const { pathname } = useLocation()
  return <><Navbar /><div key={pathname} className="page-enter">{children}</div><Footer /></>
}

function ScrollManager() {
  const { pathname, hash, key } = useLocation()

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual"
    window.scrollTo(0, 0)

    if (!hash) return undefined
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ block: "start" })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [pathname, hash, key])

  return null
}

function AppDataLoader() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchServices())
    dispatch(fetchReviews())
  }, [dispatch])

  return null
}

function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <AppDataLoader />
      <Routes>
        <Route path="/" element={<CustomerLayout><Home /></CustomerLayout>} />
        <Route path="/services" element={<CustomerLayout><Services /></CustomerLayout>} />
        <Route path="/about" element={<CustomerLayout><About /></CustomerLayout>} />
        <Route path="/reviews" element={<CustomerLayout><Reviews /></CustomerLayout>} />
        <Route path="/contact" element={<CustomerLayout><Contact /></CustomerLayout>} />
        <Route path="/booking" element={<CustomerLayout><Booking /></CustomerLayout>} />
        <Route path="/my-bookings" element={<CustomerLayout><MyBookings /></CustomerLayout>} />
        <Route path="/login" element={<CustomerLayout><Login /></CustomerLayout>} />
        <Route path="/signup" element={<CustomerLayout><Signup /></CustomerLayout>} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/services" element={<ProtectedRoute><AdminLayout><ManageServices /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/bookings" element={<ProtectedRoute><AdminLayout><ManageBookings /></AdminLayout></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
export default App
