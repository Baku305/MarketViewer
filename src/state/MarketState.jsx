
import {createSlice} from '@reduxjs/toolkit'


export const marketState = createSlice({
  
  name: 'market',
  initialState: [],
  reducers: {

    filter: (state,action) => state.forEach((s) => console.log(s.symbol.includes(action.payload.toUpperCase()))),
    
    reset: (state,action) => [],

    set: (state,action) => {
      if (state !== undefined) {
       return state = action.payload
     }},

    sortAZ : (state,action) => {
    
      return state.slice().sort(function(a, b) {
          var nameA = a.symbol,
            nameB = b.symbol
          if (nameA < nameB)
            return -1
          if (nameA > nameB)
            return 1
          return 0
        })
    },

    sortZA : (state,action) => {
      return state.slice().sort(function(a, b) {
            var nameA = a.symbol,
              nameB = b.symbol
            if (nameA > nameB)
              return -1
            if (nameA < nameB)
              return 1
            return 0
          })
      },

  }
})


export const socketState = createSlice({
  name : 'socket',
  initialState:[],
  reducers:{

    socketTrade: (state,action) => {
      if (action.payload !== undefined & action.payload.result !== null) {
        console.log(action.payload);
        return state = action?.payload
      }
      
      }
  }
})

// const defoultList = [];

// const FILTER = "MARKET@FILTER";
// const SORT = "MARKET@SORT";
// const SEARCH = "MARKET@SEARCH";
// const RESET = "MARKET@RESET";
// const SET = "MARKET@SET";
// const ADDPRICE = "MARKET@ADDPRICE";

// export function filterMarket(asset) {
//   return {
//     type: FILTER,
//     payload: asset,
//   };
// }

// export function sortMarket(asset) {
//   return {
//     type: SORT,
//     payload: asset,
//   };
// }

// export function resetMarket() {
//   return {
//     type: RESET,
//   };
// }

// export function setMaker(list) {
//   return {
//     type: SET,
//     payload: list,
//   };
// }

// export function marketReducer(state = [], action) {
//   switch (action.type) {

//     case FILTER: {
//       return state.filter((s) => s.includes(action.payload));
//     }

//     case SORT: {
//       return state.sort();
//     }
//     case RESET:
//       return defoultList;

//     case SET:
//       if (state !== undefined) {
//        const a = action.payload
//         return state = a
//       }
//       break;
//     default: {
//       return state;
//     }
//   }
// }
