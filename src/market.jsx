import { useEffect, useMemo, useState } from "react";
import { multiStore } from "./state/store";
import { marketState } from "./state/MarketState";
import { useDispatch } from "react-redux";
import DataTable from "react-data-table-component";
import { useFetchCryptoApi, useFetchCryptoPrice } from "./customhooks/useFetchApi";
import { useParams } from "react-router-dom";
import searchLogo from "./assets/SVG/searchIcon.svg";
import "./market.css";

const binancePublicEndpoint = "https://api.binance.com";
const exchangeInfoEndpoint = binancePublicEndpoint + "/api/v3/exchangeInfo";
const tickersEndpoint = binancePublicEndpoint + "/api/v3/ticker/price";
const tikers24h = binancePublicEndpoint + "/api/v3/ticker/24hr";
const stremSoketEndPoint = "wss://stream.binance.com:9443/stream";
const IconEndPoint = "https://cryptoicons.org/api/:style/:currency/:size";

export function Market() {

  const { base_asset = "" } = useParams();

  const dispatch = useDispatch();

  const [filterText, setFilterText] = useState("");

  const {
    symbols: symbols24h,
    error: error24h,
    isLoading: isLoading24h,
    onRefresh: onRefresh24h,
  } = useFetchCryptoPrice(tikers24h);

  const {
    symbols: symbolsInfo,
    error: errorInfo,
    isLoading: isLoadingInfo,
    onRefresh: onRefreshInfo,
  } = useFetchCryptoApi(exchangeInfoEndpoint);

  const priceViewer = (s) => {
    const found = symbols24h.find((p) => s === p.symbol);
    return (
      found && found.askPrice < 1 ? 
        <div className="font-bold text-yellow-500 w-full text-right">{parseFloat(found.askPrice).toFixed(6)}</div>
       :  <div className="font-bold text-yellow-500 w-full text-right">{parseFloat(found.askPrice).toFixed(2)}</div>
    );
  };

  const Change24hViewer = (s) => {
    const found = symbols24h.find((p) => s === p.symbol);
    return found && parseFloat(found.priceChangePercent).toFixed(2)/*found.priceChangePercent.includes("-") ? (
      <div className="text-red-700">{parseFloat(found.priceChangePercent).toFixed(2)}%</div>
    ) : (
      <div className="text-green-700">{parseFloat(found.priceChangePercent).toFixed(2)}%</div>
    );*/
  };

  const filteredItems = multiStore.getState().market.filter((item) => {
    return item.symbol && item.symbol.includes(filterText.toUpperCase());
  });

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <>
        <label className="relative block">
          <span className="sr-only w-10 h-10">Search</span>
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
      </>
    );
  }, []);


  const columns = [
    {
      name: "Market",
      selector: (row) => (
        <div className="flex justify-between w-full">
          <div >
            <img className = "h-5 mr-3" src={`//logo.chainbit.xyz/${row.baseAsset}`} alt="" />
          </div>
          {row.symbol}
        </div>
      ),
      sortable: true,
      sortFunction: (a, b) => {
        const nameA = a.symbol;
        const nameB = b.symbol;
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      },
    },

    {
      name: "Base Asset",
      selector: (row) => row.baseAsset,
      sortable: true
    },

    {
      name: "Quote Asset",
      selector: (row) => row.quoteAsset,
      sortable: true
    },

    {
      name: "Price",
      selector: (row) => <div className="flex justify-between w-full ">
      <div class="w-12">
        <img className = "h-5" src={`//logo.chainbit.xyz/${row.quoteAsset}`} alt="" />
      </div>
      {row.price}
    </div>
    },

    {
      name: "24h Change",
      selector: (row) => row.priceChangePercent?.includes("-") ? <div className="text-red-900 text-right font-bold w-20 before:content-['▼']">{row.priceChangePercent} %</div> : <div className="text-green-900 text-right font-bold w-20 before:content-['▲']">{row.priceChangePercent} %</div>,
      sortable: true,
       sortFunction: (a, b) => {
        const nameA = a.priceChangePercent;
        const nameB = b.priceChangePercent;
        return nameA - nameB
      },
    },
  ];

  const customStyles = {
    cells: {
      style: {
        display: "flex",
        justifyContent: "flex-start",
        minWidth: "fit-content",
        padding : "5px",
        width: "100%"
      }
    },
    columns: {
      style: {
        minWidth: "fit-content"
      }
    }
  }

  useEffect(() => {
    if (symbolsInfo && symbols24h) {
      const MarketMap = symbolsInfo.symbols
        .filter((s) => s.status === "TRADING")
        .map(
          (symbol) =>
            (symbol = {
              ...symbol,
              price: priceViewer(symbol.symbol),
              priceChangePercent: Change24hViewer(symbol.symbol),
            })
        )
        .filter((s) => s.baseAsset.toLowerCase().includes(base_asset.toLowerCase()));
      dispatch(marketState.actions.set(MarketMap));
      console.log(multiStore.getState());
    }
  });

  return (
    <div className="2xl:container mx-auto border-2 border-t-0 border-slate-900  overflow-x-hidden">
      <DataTable
        columns={columns}
        data={filteredItems}
        pagination
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        persistTableHead
        customStyles={customStyles}
		    pointerOnHover
      />
    </div>
  );
}
