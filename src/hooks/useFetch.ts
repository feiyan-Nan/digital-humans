import _ from 'lodash';
import { useEffect, useState } from 'react';
import memoize from 'memoize-one';
import fetch, { AxiosRequestCommonConfig, FETCH_METHOD, isCancel } from '@/utils/request/fetch';
import checkDataStatus from '@/utils/request/checkDataStatus';
import RESPONSE_STATUS from '@/constants/responseStatus';
import { CommonResponse } from '@/utils/request/parsingResponse';

export { FETCH_METHOD };

interface UseFetchResult<T, P> {
  loading: boolean;
  response: T;
  config: AxiosRequestCommonConfig<P>;
  onFetch: (options?: UseFetchOptions & AxiosRequestCommonConfig<P>) => Promise<T>;
}

export interface UseFetchOptions {
  disabledNotification?: boolean;
  cacheParams?: boolean;
  mutex?: string;
}

/**
 *
 * @param method  方法
 * @param url 地址
 * @param disabledNotification 是否禁用成功时的消息弹窗
 * @param cacheParams 缓存参数
 * @param defaultConfig 默认配置
 * fixme 加载完成后 loading 和 response 更新不一致
 */
export default function useFetch<T = CommonResponse, P = any>(
  method = FETCH_METHOD.GET,
  url: string,
  { disabledNotification, cacheParams, ...defaultConfig } = {
    disabledNotification: false,
    cacheParams: false,
  } as any as UseFetchOptions & AxiosRequestCommonConfig<P>,
): UseFetchResult<T, P> {
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<T>(null);
  const [config, setConfig] = useState<AxiosRequestCommonConfig<P>>(defaultConfig);

  useEffect(() => {
    if (loading) setLoading(false);
  }, [response]);

  return {
    loading,
    response,
    config,
    onFetch(newConfig?: AxiosRequestCommonConfig<P>) {
      newConfig = _.merge(
        defaultConfig,
        {
          method,
          params: cacheParams ? config.params : {},
        },
        newConfig,
      );
      setLoading(true);
      setConfig(newConfig);
      return fetch(url, newConfig)
        .then((res: any) => {
          checkDataStatus(res, {
            method,
            disabledNotification,
          });
          setResponse(res);
          return res;
        })
        .catch((error: any) => {
          // cancel 的请求不需要报错
          if (isCancel(error)) {
            return null;
          }
          setLoading(false);
          return Promise.reject(error);
        });
    },
  };
}

export const transformToTableData = memoize((reponse: any) => {
  const {
    status,
    page = {},
    data,
  } = reponse || {
    status: '',
    page: {},
    data: {},
  };
  const result: any = {
    status,
    page,
  };
  if (status === RESPONSE_STATUS.SUCCESS) {
    result.data = data.records;
  }
  return result;
}, _.isEqual);

export const transformToItemData = memoize((response: any, defaultValue = []) => {
  const { status, data } = response || {
    status: '',
    data: defaultValue,
  };
  return {
    status,
    data: data?.records ?? defaultValue,
  };
});

export const transformToData = memoize((response: any, defaultValue = {}) => {
  const { status, data } = response || {
    status: '',
    data: defaultValue,
  };
  return {
    status,
    data: data ?? defaultValue,
  };
});
