import { useState, useCallback } from "react";

export const useFullPageLoader = (initialState: boolean = false) => {
  const [isLoading, setIsLoading] = useState<boolean>(initialState);

  const showLoader = useCallback(() => setIsLoading(true), []);
  const hideLoader = useCallback(() => setIsLoading(false), []);

  return {
    isLoading,
    showLoader,
    hideLoader,
    setIsLoading,
  };
};