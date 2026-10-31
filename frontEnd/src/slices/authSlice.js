import { createSlice } from "@reduxjs/toolkit"

const savedUser = JSON.parse(localStorage.getItem("fusionAuraUser") || "null")
const savedCustomerToken = localStorage.getItem("fusionAuraToken")
const savedAdmin = JSON.parse(localStorage.getItem("fusionAuraAdmin") || "null")
const savedAdminToken = localStorage.getItem("fusionAuraAdminToken")

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: savedUser,
    token: savedCustomerToken,
    admin: savedAdmin,
    adminToken: savedAdminToken
  },
  reducers: {
    setCustomerSession: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      localStorage.setItem("fusionAuraUser", JSON.stringify(action.payload.user))
      localStorage.setItem("fusionAuraToken", action.payload.token)
    },
    logoutUser: (state) => {
      state.user = null
      state.token = null
      localStorage.removeItem("fusionAuraUser")
      localStorage.removeItem("fusionAuraToken")
    },
    setAdminSession: (state, action) => {
      state.admin = action.payload.admin
      state.adminToken = action.payload.token
      localStorage.setItem("fusionAuraAdmin", JSON.stringify(action.payload.admin))
      localStorage.setItem("fusionAuraAdminToken", action.payload.token)
    },
    logoutAdmin: (state) => {
      state.admin = null
      state.adminToken = null
      localStorage.removeItem("fusionAuraAdmin")
      localStorage.removeItem("fusionAuraAdminToken")
    }
  }
})

export const { setCustomerSession, logoutUser, setAdminSession, logoutAdmin } = authSlice.actions
export default authSlice.reducer
