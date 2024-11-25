import { useLocation, useNavigate } from "react-router-dom";

type QueryParams<K extends string> = {
  setQueryParams: (newParams: {
    [key in K]: string | number | boolean;
  }) => void;
  removeQueryParams: (keys: K[]) => void;
  clearQueryParams: () => void;
  getQueryParams: <T>(key: K) => T | null;
};

export default function useQueryParams<K extends string>(): QueryParams<K> {
  const location = useLocation();
  const navigate = useNavigate();

  const setQueryParams = (newParams: {
    [key in K]: string | number | boolean;
  }) => {
    const searchParams = new URLSearchParams(location.search);

    for (const key in newParams) {
      searchParams.set(key, newParams[key].toString());
    }

    navigate({
      pathname: location.pathname,
      search: searchParams.toString(),
    });
  };

  const removeQueryParams = (keys: K[]) => {
    const searchParams = new URLSearchParams(location.search);

    for (const key of keys) {
      searchParams.delete(key);
    }

    navigate({
      pathname: location.pathname,
      search: searchParams.toString(),
    });
  };

  const clearQueryParams = () => {
    navigate({
      pathname: location.pathname,
    });
  };

  const getQueryParams = <T>(key: K): T | null => {
    const searchParams = new URLSearchParams(location.search);
    if (!searchParams.has(key)) return null;

    return searchParams.get(key) as T;
  };

  return {
    setQueryParams,
    removeQueryParams,
    clearQueryParams,
    getQueryParams,
  };
}
