import { createSlice } from "@reduxjs/toolkit"

export const AssetState = createSlice({
 name: "asset",
 initialState: [],
 reducers: {
  set: (state,action) => {
   if (state !== undefined) {
    return state = action.payload
  }},
 }
})