import { App as AntdApp } from "antd";
import { useState } from "react";
import { useUpgradeState } from "../state/upgrade";

export type FetchStatus = "fetching" | "success" | "error";

export const combineStatuses = (...stati: Array<FetchStatus | undefined>): FetchStatus | undefined => {
  if (stati.find(s => s === 'error')) return 'error';
  if (stati.find(s => s === 'fetching')) return 'fetching';
  if (stati.filter(s => s === 'success').length === stati.length) return 'success';
}

interface Options<T extends any> {
  onSuccess?: (value: T) => void;
  onError?: (e: any) => void;
}

export const useQuery = <T extends any, A extends any[]>(
  fetcher: (...args: A) => Promise<T>,
  options?: Options<T>,
) => {
  const { notification } = AntdApp.useApp();

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
      options?.onSuccess?.(result);

    } catch (e: any) {
      if (e.message === 'exceeds_limits') {
        setUpdateModalOpen(true, 'limits-exceeded');
      }

      setError(e.message);
      setStatus('error');
      options?.onError?.(e);

      notification.error({
        placement: 'topRight',
        message: 'Error',
        description: e?.message,
      });

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
