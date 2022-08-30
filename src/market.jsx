import { useEffect, useMemo, useState } from "react";
import { multiStore } from "./state/store";
import { marketState } from "./state/MarketState";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { useFetchCryptoApi, useFetchCryptoPrice } from "./customhooks/useFetchApi";
import { Link, useParams } from "react-router-dom";
import searchLogo from "./assets/SVG/searchIcon.svg";
import tradeArrows from "./assets/SVG/tradeArrows.svg";
import "./market.css";
import Select from "react-select";
import { AssetState } from "./state/AssetState";
import { filteredArray, numberOfMarkets } from "./Asset";

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

  const [pending, setPending] = useState(true);

  const {
    symbols: symbols24h,
    error: error24h,
    isLoading: isLoading24h,
    onRefresh: onRefresh24h,
  } = useFetchCryptoPrice(tikers24h);

  const {
    symbols: symbolsPrice,
    error: errorPrice,
    isLoading: isLoadingPrice,
    onRefresh: onRefreshPrice,
  } = useFetchCryptoPrice(tickersEndpoint);

  const {
    symbols: symbolsInfo,
    error: errorInfo,
    isLoading: isLoadingInfo,
    onRefresh: onRefreshInfo,
  } = useFetchCryptoApi(exchangeInfoEndpoint);

  const filteredItems = multiStore.getState().market.filter((item) => {
    return item.symbol && item.symbol.includes(filterText.toUpperCase());
  });

  const columns = [
    {
      name: "Market",
      selector: (row) => (
        <div className="flex justify-between w-full">
          <img className="h-5 mr-3" src={`//logo.chainbit.xyz/${row.baseAsset}`} alt="🉑" />
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
      sortable: true,
    },

    {
      name: "Quote Asset",
      selector: (row) => row.quoteAsset,
      sortable: true,
    },

    {
      name: "Price",
      selector: (row) => (
        <div className="flex justify-between w-full ">
          <div className="w-12">
            <img className="h-5" src={`//logo.chainbit.xyz/${row.quoteAsset}`} alt="🉑" />
          </div>
          {row.price < 1 ? (
            <div className="font-bold text-yellow-500 w-full text-right">
              {parseFloat(row.price).toFixed(6)}
            </div>
          ) : (
            <div className="font-bold text-yellow-500 w-full text-right">
              {parseFloat(row.price).toFixed(2)}
            </div>
          )}
        </div>
      ),
    },

    {
      name: "24h Change",
      selector: (row) =>
        row.priceChangePercent?.includes("-") ? (
          <div className="text-red-900 text-right font-bold w-20 before:content-['▼']">
            {row.priceChangePercent} %
          </div>
        ) : (
          <div className="text-green-900 text-right font-bold w-20 before:content-['▲']">
            {row.priceChangePercent} %
          </div>
        ),
      sortable: true,
      sortFunction: (a, b) => {
        const nameA = a.priceChangePercent;
        const nameB = b.priceChangePercent;
        return nameA - nameB;
      },
    },
  ];

  const customStyles = {
    cells: {
      style: {
        display: "flex",
        justifyContent: "flex-start",
        minWidth: "fit-content",
        padding: "5px",
        width: "100%",
      },
    },
    columns: {
      style: {
        minWidth: "fit-content",
      },
    },
  };

  const options = [
    { value: "ALL ASSETS", label: <Link to={`/`}>ALL ASSETS</Link> },
    ...multiStore.getState().asset.map((symbol) => {
      return {
        value: symbol.baseAsset,
        label: <Link to={`/${symbol.baseAsset.toLowerCase()}`}>{symbol.baseAsset}</Link>,
      };
    }),
  ];
  
  const subHeaderComponentMemo = useMemo(() => {
    return (
      <>
        <div className="flex justify-between w-full">
          <label className="relative block">
            <span className="sr-only w-10 h-10">Search</span>
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <img className="h-5 w-5 fill-slate-300" src={searchLogo} alt="searchLogo"></img>
            </span>
            <input
              onKeyUp={(e) => setFilterText(e.target.value)}
              className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 text-sm"
              placeholder="Search ..."
              type="text"
              name="search"
            />
          </label>
          <div className="h-full">
            <Select
            className="w-40 h-full sm:text-sm "
              options={options}
              placeholder={base_asset === "" ? "ALL ASSETS" : base_asset.toUpperCase()}
            />
          </div>
          
        </div>
      </>
    );
  }, []);

  useEffect(() => {
    const PriceMerger = (s) => {
      const found = symbols24h.find((p) => s === p.symbol);
      const priceFound = symbolsPrice.find((p) => s === p.symbol);
      return (
        found &&
        priceFound && {
          price: priceFound.price,
          priceChangePercent: parseFloat(found.priceChangePercent).toFixed(2),
          volume: found.volume,
          priceChange: found.priceChange,
          lowPrice: found.lowPrice,
          askPrice: found.askPrice,
          askQty: found.askQty,
          bidPrice: found.bidPrice,
          bidQty: found.bidQty,
        }
      );
    };

    if (symbolsInfo && symbols24h && symbolsPrice) {
      const MarketMap = symbolsInfo.symbols
        .filter((s) => s.status === "TRADING")
        .map(
          (symbol) =>
            (symbol = {
              ...symbol,
              ...PriceMerger(symbol.symbol),
            })
        )
        .filter((s) => s.baseAsset.toLowerCase().includes(base_asset.toLowerCase()));
      dispatch(marketState.actions.set(MarketMap));
      setPending(false);
      const a = symbolsInfo.symbols
      .filter((s) => s.status === "TRADING").map((s) => numberOfMarkets(s.baseAsset));
      dispatch(AssetState.actions.set(filteredArray(a)))
    }
  });

  const ExpandedComponent = ({ data }) => (
    <div>
      <div className="flex pl-20 pt-4 gap-4">
        <img className="h-10 w-10" src={`//logo.chainbit.xyz/${data.baseAsset}`} alt="🉑" />
        <img className="h-10 w-10" src={tradeArrows} alt="" />
        <img className="h-10 w-10" src={`//logo.chainbit.xyz/${data.quoteAsset}`} alt="🉑" />
      </div>
      <div className="text-xs p-4 pl-16">
        <div className="flex justify-between">
          <div className="p-2 w-full">
            <div className="p-1 font-bold">VOLUME</div>
            <div className="p-1">{parseFloat(data.volume).toFixed(4)}</div>
          </div>
          <div className="p-2 w-full">
            <div className="p-1 font-bold">PRICE CHANGE</div>
            <div className="p-1">{parseFloat(data.priceChange).toFixed(6)}</div>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="p-2 w-full">
            <div className="p-1 text-red-900 font-bold">ASK PRICE</div>
            <div className="p-1">{parseFloat(data.askPrice).toFixed(6)}</div>
          </div>
          <div className="p-2 w-full">
            <div className="p-1 text-red-900 font-bold">ASK QUANTITY</div>
            <div className="p-1">{parseFloat(data.askQty).toFixed(4)}</div>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="p-2 w-full">
            <div className="p-1 text-green-900 font-bold">BID PRICE</div>
            <div className="p-1">{parseFloat(data.bidQty).toFixed(4)}</div>
          </div>
          <div className="p-2 w-full">
            <div className="p-1 text-green-900 font-bold">BID QUANTITY</div>
            <div className="p-1">{parseFloat(data.bidPrice).toFixed(6)}</div>
          </div>
        </div>
      </div>
    </div>
  );

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
        progressPending={pending}
        expandableRows
        expandableRowsComponent={ExpandedComponent}
      />
    </div>
  );
}
