import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { apiRequest } from "../api"

export const fetchServices = createAsyncThunk("services/fetch", async () => apiRequest("/services"))
export const addService = createAsyncThunk("services/add", async ({ formData, token }) =>
  apiRequest("/services", { method: "POST", body: formData }, token)
)
export const updateService = createAsyncThunk("services/update", async ({ id, formData, token }) =>
  apiRequest(`/services/${id}`, { method: "PUT", body: formData }, token)
)
export const deleteService = createAsyncThunk("services/delete", async ({ id, token }) => {
  await apiRequest(`/services/${id}`, { method: "DELETE" }, token)
  return id
})

const serviceSlice = createSlice({
  name: "services",
  initialState: { services: [], loading: false, hasFetched: false, error: "" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => { state.loading = true; state.error = "" })
      .addCase(fetchServices.fulfilled, (state, action) => { state.loading = false; state.hasFetched = true; state.services = action.payload })
      .addCase(fetchServices.rejected, (state, action) => { state.loading = false; state.hasFetched = true; state.error = action.error.message })
      .addCase(addService.fulfilled, (state, action) => { state.services.push(action.payload) })
      .addCase(updateService.fulfilled, (state, action) => {
        const index = state.services.findIndex((s) => s._id === action.payload._id)
        if (index !== -1) state.services[index] = action.payload
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.services = state.services.filter((s) => s._id !== action.payload)
      })
  }
})
export default serviceSlice.reducer
