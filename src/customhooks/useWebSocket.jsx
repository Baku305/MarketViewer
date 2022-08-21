import { useState } from "react";
import { useEffect } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { socketState } from "../state/MarketState";


export function UseWebSocket() {

  return async function(dispatch,getState) {
  
  const client = new W3CWebSocket(`wss://stream.binance.com:9443/ws`);

  var msg2 = {
    method: "SUBSCRIBE",
    params: ["!ticker@arr"],
    id: 1,
  };

  client.onopen = () => client.send(JSON.stringify(msg2));
  
  client.onmessage = (e) => {
    const value = JSON.parse(e.data);
    const response =  value
    //console.log(response);
    //const mappedResponse = response.map(s => { return {s.symbol : s}})
    dispatch(socketState.actions.socketTrade(response))
    }
  
  return ()=> client.close()
  };

}



 export function UseWebSocketSinglePair(symbol) {

  const [state,setState]= useState({})

  const client = new W3CWebSocket(`wss://stream.binance.com:9443/ws`);

  var msg = {
    method: "SUBSCRIBE",
    params: [`${symbol}@trade`],
    id: 1,
  };

  useEffect(()=>{
  client.onopen = () => client.send(JSON.stringify(msg));
  
  client.onmessage = async (e) => {
    const value = await JSON.parse(e.data);
    const response = await value
    if (response !== {} & response !== undefined ) {
      setState((s)=>s = response)
    }
  }
})
return state 
 }