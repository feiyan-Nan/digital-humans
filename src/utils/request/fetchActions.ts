import ResponseStatus from '@/constants/responseStatus';
import { __DEBUG__ } from '@/constants/config';
import fetch, { FETCH_METHOD, FetchOptions, isCancel } from './fetch';
import checkDataStatus from './checkDataStatus';
import actionCreatorWrapper from './actionCreatorWrapper';
import actionTypes from '@/constants/actionTypes';

interface CreateFetchActionOptions<T> {
  request?(actionProps: T): any;
  failure?(actionProps: T): any;
  success?(actionProps: T): any;
}

/**
 * 创建异步获取数据的 3个Action: request, failure, success
 * @param  {String} ACTION
 * @param  {Bool} [noWait=null]  不允许等待, 如果设置为true就不返回request这个action
 * @param  {Object} actionProps={}
 */
export function createFetchAction(
  ACTION: actionTypes,
  noWait?: boolean,
  // @ts-ignore
  options?: CreateFetchActionOptions<Record<string, any>> = {},
) {
  const request =
    options.request ||
    function request(actionProps: any) {
      return {
        type: ACTION,
        status: ResponseStatus.REQUEST,
        response: {},
        ...actionProps,
      };
    };

  const failure =
    options.failure ||
    function failure(error: any, actionProps: any) {
      return {
        type: ACTION,
        status: ResponseStatus.ERROR,
        error,
        response: {},
        ...actionProps,
      };
    };

  const success =
    options.success ||
    function success(data: any, actionProps: any) {
      return {
        type: ACTION,
        status: ResponseStatus.SUCCESS,
        response: data,
        ...actionProps,
      };
    };

  // 如果不允许等待
  if (noWait) {
    return { failure, success };
  }

  return { request, failure, success };
}

/**
 * 创将一个 RequestData Action
 * @param url
 * @param options
 */
export function requestData(url: string, options: any) {
  const { actionProps, action = {}, beforeSend, success, failure, complete, error, ...fetchOptions } = options;

  return (dispatch: any) => {
    const beforeSendCallback = actionCreatorWrapper(beforeSend, dispatch);
    const successCallback = actionCreatorWrapper(success, dispatch);
    const failureCallback = actionCreatorWrapper(failure, dispatch);
    const completeCallback = actionCreatorWrapper(complete, dispatch);
    const errorCallback = actionCreatorWrapper(error, dispatch);

    action.request && dispatch(action.request(actionProps));
    beforeSendCallback(dispatch);

    return fetch(url, fetchOptions)
      .then((response: any) => {
        if (checkDataStatus(response, options)) {
          if (action.success) {
            const successAction = action.success(response, actionProps);
            dispatch(successAction);
          }
          successCallback(response, dispatch);
        } else {
          action.failure && dispatch(action.failure('fetch error', actionProps));
          failureCallback(response, dispatch);
        }

        completeCallback(null, response, dispatch);

        return response;
      })
      .catch((fetchError: any) => {
        // cancel 的请求不需要报错
        if (isCancel(fetchError)) {
          return null;
        }
        if (__DEBUG__) {
          console.error(fetchError);
        }
        if (action.failure) {
          const failureAction = action.failure(fetchError, actionProps);
          dispatch(failureAction);
        }
        errorCallback(fetchError, dispatch);
        completeCallback(fetchError, dispatch);
        return Promise.reject(fetchError);
      });
  };
}

const generateRequestFunction = (method: FETCH_METHOD) => (url: string, options: FetchOptions) =>
  requestData(url, { ...options, method });

export default requestData;
export const GET = generateRequestFunction(FETCH_METHOD.GET);
export const POST = generateRequestFunction(FETCH_METHOD.POST);
export const PATCH = generateRequestFunction(FETCH_METHOD.PATCH);
export const PUT = generateRequestFunction(FETCH_METHOD.PUT);
export const DELETE = generateRequestFunction(FETCH_METHOD.DELETE);
