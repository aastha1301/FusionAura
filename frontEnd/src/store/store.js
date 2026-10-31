import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../slices/authSlice"
import serviceReducer from "../slices/serviceSlice"
import bookingReducer from "../slices/bookingSlice"
import reviewReducer from "../slices/reviewSlice"

export default configureStore({
  reducer: {
    auth: authReducer,
    services: serviceReducer,
    bookings: bookingReducer,
    reviews: reviewReducer
  }
})
