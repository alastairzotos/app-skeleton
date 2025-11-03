import { useState } from "react";
import { useUpgradeState } from "../state/upgrade";

export type FetchStatus = "fetching" | "success" | "error";

export const combineStatuses = (...stati: Array<FetchStatus | undefined>): FetchStatus | undefined => {
  if (stati.find(s => s === 'error')) return 'error';
  if (stati.find(s => s === 'fetching')) return 'fetching';
  if (stati.filter(s => s === 'success').length === stati.length) return 'success';
}

export const useQuery = <T extends any, A extends any[]>(
  fetcher: (...args: A) => Promise<T>,
) => {
  const { setUpdateModalOpen } = useUpgradeState();

  const [status, setStatus] = useState<FetchStatus | undefined>();
  const [value, mutate] = useState<T | undefined>();
  const [error, setError] = useState<any>();

  const request = async (...args: A) => {
    setStatus('fetching');
    setError(undefined);

    let result: T;

    try {
      result = await fetcher(...args);

      mutate(result);
      setStatus('success');
    } catch (e: any) {
      if (e.message === 'exceeds_limits') {
        setUpdateModalOpen(true, 'limits-exceeded');
      }

      setError(e.message);
      setStatus('error');

      throw e;
    }

    return result;
  }

  const clear = () => {
    setStatus(undefined);
    mutate(undefined);
    setError(undefined);
  }

  return {
    status,
    value,
    error,
    request,
    mutate,
    clear,
  }
}
