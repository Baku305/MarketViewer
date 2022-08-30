import { useEffect, useMemo, useState } from "react";
import { multiStore } from "./state/store";
import { marketState } from "./state/MarketState";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { useFetchCryptoApi } from "./customhooks/useFetchApi";
import { Link } from "react-router-dom";
import searchLogo from "./assets/SVG/searchIcon.svg";
import { AssetState } from "./state/AssetState";

const binancePublicEndpoint = "https://api.binance.com";
const exchangeInfoEndpoint = binancePublicEndpoint + "/api/v3/exchangeInfo";
const tickersEndpoint = binancePublicEndpoint + "/api/v3/ticker/price";
const tikers24h = binancePublicEndpoint + "/api/v3/ticker/24hr";
const stremSoketEndPoint = "wss://stream.binance.com:9443/stream";

 export const filteredArray = (array) =>
    array.filter((value, index) => {
      const _value = JSON.stringify(value);
      return (
        index ===
        array.findIndex((obj) => {
          return JSON.stringify(obj) === _value;
        })
      );
    });

  export const numberOfMarkets = (baseAsset) => {
    const a = multiStore.getState().market.filter((m) => m.baseAsset === baseAsset.toUpperCase());

    return {
      baseAsset: baseAsset,
      markets: a.length,
    };
  };

  
export function Assets() {

  const dispatch = useDispatch();

  const [filterText, setFilterText] = useState("");

  const columns = [
    {
      name: "Base Asset",
      selector: (row) => (
        <div className="flex justify-between w-full">
          <div>
            <img className="h-5 mr-3" src={`//logo.chainbit.xyz/${row.baseAsset}`} alt="" />
          </div>
          <Link to= {`/${row.baseAsset.toLowerCase()}`} >{row.baseAsset}</Link>
        </div>
      ),
      sortable: true,
      sortFunction: (a, b) => {
        const nameA = a.baseAsset;
        const nameB = b.baseAsset;
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      },
    },
    {
      name: "Markets",
      selector: (row) => row.markets,
      sortable: true,
    },
  ];

  const {
    symbols: symbolsInfo,
    error: errorInfo,
    isLoading: isLoadingInfo,
    onRefresh: onRefreshInfo,
  } = useFetchCryptoApi(exchangeInfoEndpoint);



  const filteredItems = useSelector(state => state.asset).filter((item) => {
    return item.baseAsset && item.baseAsset.includes(filterText.toUpperCase());
  });

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <>
      <div className="flex justify-between w-full">
        <label className="relative block">
          <span className="sr-only">Search</span>
          <span className="absolute inset-y-0 left-0 flex items-center pl-2">
            <img className="h-5 w-5 fill-slate-300" src={searchLogo} alt="searchLogo"></img>
          </span>
          <input
            onKeyUp={(e) => setFilterText(e.target.value)}
            className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
            placeholder="Search ..."
            type="text"
            name="search"
          />
        </label>
      </div>
      </>
    );
  }, []);

  // useEffect(() => {
  //   if (symbolsInfo) {
  //     //dispatch(marketState.actions.set(symbolsInfo.symbols.filter((s) => s.status === "TRADING")));
  //     const a = multiStore.getState().market.map((s) => numberOfMarkets(s.baseAsset));
  //     dispatch(AssetState.actions.set(filteredArray(a)))
  //   }
  // }, [dispatch, symbolsInfo]);

  return (
    <div className="box-border 2xl:container mx-auto">
      <DataTable
        className=""
        columns={columns}
        data={filteredItems}
        pagination
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        persistTableHead
      />
    </div>
  );
}
