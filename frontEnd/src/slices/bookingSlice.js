import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { apiRequest } from "../api"
import { logoutAdmin, logoutUser, setAdminSession, setCustomerSession } from "./authSlice"

export const fetchMyBookings = createAsyncThunk("bookings/mine", async (token) => apiRequest("/bookings/mine", {}, token))
export const fetchAllBookings = createAsyncThunk("bookings/all", async (token) => apiRequest("/bookings", {}, token))
export const addBooking = createAsyncThunk("bookings/add", async ({ data, token }, { rejectWithValue }) => {
  try {
    return await apiRequest("/bookings", { method: "POST", body: JSON.stringify(data) }, token)
  } catch (error) {
    return rejectWithValue(error.message || "Could not create booking.")
  }
})
export const updateBookingStatus = createAsyncThunk("bookings/status", async ({ id, status, token }) =>
  apiRequest(`/bookings/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }, token)
)
export const deleteBooking = createAsyncThunk("bookings/delete", async ({ id, token }) => {
  await apiRequest(`/bookings/${id}`, { method: "DELETE" }, token)
  return id
})

const bookingSlice = createSlice({
  name: "bookings",
  initialState: { myBookings: [], allBookings: [], loadingMy: false, loadingAll: false, errorMy: "", errorAll: "", customerId: null, myRequestId: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setCustomerSession, (state, action) => {
        const nextCustomerId = action.payload.user?._id || action.payload.user?.id || null
        if (String(state.customerId || "") !== String(nextCustomerId || "")) state.myBookings = []
        state.customerId = nextCustomerId
        state.loadingMy = false
        state.errorMy = ""
        state.myRequestId = null
      })
      .addCase(logoutUser, (state) => {
        state.myBookings = []
        state.customerId = null
        state.loadingMy = false
        state.errorMy = ""
        state.myRequestId = null
      })
      .addCase(setAdminSession, (state) => { state.allBookings = [] })
      .addCase(logoutAdmin, (state) => { state.allBookings = []; state.loadingAll = false; state.errorAll = "" })
      .addCase(fetchMyBookings.pending, (state, action) => { state.loadingMy = true; state.errorMy = ""; state.myBookings = []; state.myRequestId = action.meta.requestId })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        if (state.myRequestId !== action.meta.requestId) return
        state.loadingMy = false
        state.myRequestId = null
        state.myBookings = action.payload
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        if (state.myRequestId !== action.meta.requestId) return
        state.loadingMy = false
        state.myRequestId = null
        state.errorMy = action.error.message || "Could not load your bookings."
      })
      .addCase(fetchAllBookings.pending, (state) => { state.loadingAll = true; state.errorAll = "" })
      .addCase(fetchAllBookings.fulfilled, (state, action) => { state.loadingAll = false; state.allBookings = action.payload })
      .addCase(fetchAllBookings.rejected, (state, action) => { state.loadingAll = false; state.errorAll = action.error.message || "Could not load bookings." })
      .addCase(addBooking.fulfilled, (state, action) => {
        if (String(action.payload.user || "") === String(state.customerId || "")) {
          state.myBookings = [action.payload, ...state.myBookings.filter((booking) => booking._id !== action.payload._id)]
        }
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        const index = state.allBookings.findIndex((b) => b._id === action.payload._id)
        if (index !== -1) state.allBookings[index] = action.payload
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.allBookings = state.allBookings.filter((b) => b._id !== action.payload)
        state.myBookings = state.myBookings.filter((b) => b._id !== action.payload)
      })
  }
})
export default bookingSlice.reducer
