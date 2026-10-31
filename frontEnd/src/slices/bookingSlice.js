import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { apiRequest } from "../api"

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
  initialState: { bookings: [], loading: false, error: "" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyBookings.pending, (state) => { state.loading = true })
      .addCase(fetchMyBookings.fulfilled, (state, action) => { state.loading = false; state.bookings = action.payload })
      .addCase(fetchMyBookings.rejected, (state, action) => { state.loading = false; state.error = action.error.message })
      .addCase(fetchAllBookings.fulfilled, (state, action) => { state.bookings = action.payload })
      .addCase(addBooking.fulfilled, (state, action) => { state.bookings.unshift(action.payload) })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        const index = state.bookings.findIndex((b) => b._id === action.payload._id)
        if (index !== -1) state.bookings[index] = action.payload
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.filter((b) => b._id !== action.payload)
      })
  }
})
export default bookingSlice.reducer
