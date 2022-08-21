
import useSWR from "swr";


const binancePublicEndpoint = "https://api.binance.com";
const exchangeInfoEndpoint = binancePublicEndpoint + "/api/v3/exchangeInfo";
const tickersEndpoint = binancePublicEndpoint + "/api/v3/ticker/price";
const tikers24h = binancePublicEndpoint + "/api/v3/ticker/24hr";
const stremSoketEndPoint = "wss://stream.binance.com:9443/stream";
const IconEndPoint = "GET https://cryptoicons.org/api/:style/:currency/:size"


export function useFetchCryptoApi(endPoint) {
  const fetcher = (url) => fetch(url).then((response) => response.json());
  const { data, error, mutate } = useSWR(endPoint, fetcher);

  const handleRefresh = () => mutate();

  return {
    symbols: data,
    error,
    isLoading: !data && !error,
    onRefresh: handleRefresh,
  };
}

export function useFetchCryptoPrice(endPoint) {
  const fetcher = (url) => fetch(url).then((response) => response.json());
  const { data, error, mutate } = useSWR(endPoint, fetcher, {refreshInterval:2000});

  const handleRefresh = () => mutate();

  return {
    symbols: data,
    error,
    isLoading: !data && !error,
    onRefresh: handleRefresh,
  };
}
