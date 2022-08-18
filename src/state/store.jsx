import { applyMiddleware, combineReducers, createStore } from "redux";
import { marketState } from "./MarketState";
import thunkMiddleware from "redux-thunk";
import {} from "@redux-devtools/extension";
import { composeWithDevTools } from "@redux-devtools/extension";

const rootReducer = combineReducers({
  market: marketState.reducer,
});

export const store = createStore(marketState.reducer);
export const multiStore = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunkMiddleware)));
