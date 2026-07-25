"use client";

import { useState, useEffect, useCallback } from "react";

export function useApiData<T>(
  endpoint: string,
  keyName: string,
  deps: any[] = []
): {
  data: T[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
} {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(() => {
    setLoading(true);
    fetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((resData) => {
        if (resData.success && Array.isArray(resData[keyName])) {
          setData(resData[keyName]);
        } else if (resData.error) {
          setError(resData.error);
        }
      })
      .catch((err) => setError(err.message || "Failed to fetch"))
      .finally(() => setLoading(false));
  }, [endpoint, keyName]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...deps]);

  return { data, loading, error, refresh: fetchData };
}
