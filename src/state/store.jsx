
import { configureStore } from '@reduxjs/toolkit'
import {applyMiddleware, combineReducers, createStore} from 'redux'
import { marketReducer, marketState, socketState } from './MarketState'
import { priceReducer, priceState } from './PriceState'
import  ThunkMiddleware  from 'redux-thunk'
import { UseWebSocket } from '../useWebSocket'


const rootReducer = combineReducers({

 symbols : marketState.reducer,
 price : priceState.reducer,
 socket : socketState.reducer 

})

export const store = createStore(marketState.reducer)
export const priceStore = createStore(priceState.reducer)
export const multiStore = createStore(rootReducer,applyMiddleware(ThunkMiddleware))

