import { useEffect, useRef } from "react";
import axios from "axios";

const useAxiosRequest = (url: string) => {
  const dataRef = useRef(null);
  const isLoadingRef = useRef(true);
  const errorRef = useRef<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        dataRef.current = response.data;
      } catch (error) {
        errorRef.current = error;
      } finally {
        isLoadingRef.current = false;
      }
    };

    fetchData();
  }, [url]);

  return {
    data: dataRef.current,
    isLoading: isLoadingRef.current,
    error: errorRef.current,
  };
};

export default useAxiosRequest;
