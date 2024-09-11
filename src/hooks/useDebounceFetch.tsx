import { useEffect, useState } from "react";

type DebounceFetchProps = {
  url: string;
  delay?: number;
  validate?: () => boolean;
};

function useDebounceFetch({
  url,
  delay = 1000,
  validate = () => true, // Default validation always allows fetch
}: DebounceFetchProps): any {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!validate() || !url) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(url);
        const json = await res.json();
        setData(json);
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (validate()) {
      setError(null);
      setLoading(true);
      const timeout = setTimeout(() => {
        fetchData();
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [url, delay, validate]);

  return { data, loading, error };
}

export default useDebounceFetch;
