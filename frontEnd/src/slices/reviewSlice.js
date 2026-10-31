import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { apiRequest } from "../api"

export const fetchReviews = createAsyncThunk("reviews/fetch", async () => apiRequest("/reviews"))
export const addReview = createAsyncThunk("reviews/add", async ({ data, token }) =>
  apiRequest("/reviews", { method: "POST", body: JSON.stringify(data) }, token)
)

const reviewSlice = createSlice({
  name: "reviews",
  initialState: { reviews: [], loading: false, error: "" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => { state.loading = true })
      .addCase(fetchReviews.fulfilled, (state, action) => { state.loading = false; state.reviews = action.payload })
      .addCase(fetchReviews.rejected, (state, action) => { state.loading = false; state.error = action.error.message })
      .addCase(addReview.fulfilled, (state, action) => { state.reviews.unshift(action.payload) })
  }
})
export default reviewSlice.reducer
