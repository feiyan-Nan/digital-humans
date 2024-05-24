import axios, { AxiosRequestConfig } from 'axios';
import './axios-mutex-polyfill';
import './interceptors';
import paramsSerializer from './paramsSerializer';
import { LISTENED_HTTP_CODES } from '@/utils/request/parsingResponse';

axios.defaults.baseURL = process.env.baseURL;
axios.defaults.withCredentials = true;
export const { isCancel } = axios;

// 有效的状态码是除 [200,300) 的之外添加了额外处理的 一些 状态码
axios.defaults.validateStatus = (status: number) =>
  (status >= 200 && status < 300) || LISTENED_HTTP_CODES.includes(status);
axios.defaults.paramsSerializer = paramsSerializer;
axios.defaults.headers.common.Accept = 'application/json';
// 超时 30s
axios.defaults.timeout = 30e3;

export enum FETCH_METHOD {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export interface FetchOptions {
  method?: FETCH_METHOD;
  params?: Record<string, any>;
  action?: any;
}

interface AxiosRequestCommonConfigParams<T = any> {
  params?: T;
}

export type AxiosRequestCommonConfig<T = any, P = AxiosRequestCommonConfigParams<T>> = Omit<
  AxiosRequestConfig,
  'url' | keyof P
> &
  P;

export default function fetchJson(
  url: string,
  { method = FETCH_METHOD.GET, params = {}, ...options }: AxiosRequestCommonConfig,
) {
  // 将参数插入 url 中
  if (typeof url === 'object') {
    // 进行 delete 操作之前一定要 clone 一下原对象
    params = JSON.parse(JSON.stringify(params));
    const keys = url.getKeys();
    url = url.toStringURL(params);
    keys.forEach((key) => delete params[key]);
  }
  return axios.request({
    url,
    method,
    params,
    ...options,
  });
}

const generateFetchFunction =
  (method: FETCH_METHOD) =>
  (url: string, options?: any): Promise<any> =>
    fetchJson(url, {
      ...options,
      method,
    }).catch((error: any) => {
      // cancel 的请求不需要报错
      if (isCancel(error)) {
        return null;
      }
      return Promise.reject(error);
    });

export const GET = generateFetchFunction(FETCH_METHOD.GET);
export const POST = generateFetchFunction(FETCH_METHOD.POST);
export const PATCH = generateFetchFunction(FETCH_METHOD.PATCH);
export const PUT = generateFetchFunction(FETCH_METHOD.PUT);
export const DELETE = generateFetchFunction(FETCH_METHOD.DELETE);
