import { createSlice } from "@reduxjs/toolkit";

export const defaultPriceList = []

const FILTER = "PRICE@FILTER";
const SORT = "PRICE@SORT";
const SEARCH = "PRICE@SEARCH";
const RESET = "PRICE@RESET";
const SET = "PRICE@SET";
const ADDPRICE = "PRICE@ADDPRICE";

export function filterprice(asset) {
  return {
    type: FILTER,
    payload: asset,
  };
}

export function sortprice(asset) {
  return {
    type: SORT,
    payload: asset,
  };
}

export function resetprice() {
  return {
    type: RESET,
  };
}

export function setprice(list) {
  return {
    type: SET,
    payload: list,
  };
}

export function priceReducer(state = [], action) {
  switch (action.type) {

    case FILTER: {
      return state.filter((s) => s.includes(action.payload));
    }

    case SORT: {
      return state.sort();
    }
    case RESET:
      return defaultPriceList;

    case SET:
     if (state !== undefined) {
      return state = action.payload
     }
      break
    default: {
      return state;
    }
  }
}

export const priceState = createSlice({
  name : 'price',
  initialState : [],
  reducers : {

    set : (state, action) => {
      if (state !== undefined) {
        return state = action.payload
       }
    },

    filter : (state, action) => state.filter((s) => s.includes(action.payload)),

    sort : (state,action) => state.sort(),

    reset : (state, action) => state = [],
  }
})