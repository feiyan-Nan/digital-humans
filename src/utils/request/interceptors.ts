import _ from 'lodash';
import axios, { AxiosResponse } from 'axios';
import { message } from 'antd';
// import { setPageError } from '@/utils';
import { __DEBUG__, __IS_IE__ } from '@/constants/config';
import HTTP_STATUS_CODES from '@/utils/request/httpStatusCodes';
import parsingResponse from '@/utils/request/parsingResponse';

axios.defaults.baseURL = process.env.baseURL;
const { isCancel } = axios;

axios.interceptors.request.use((config) => {
  // ie 浏览器的所有get请求防止 304
  if (config.method === 'get' && __IS_IE__) {
    config.params = { ...config.params, t: Number(new Date()) };
  }
  return config;
});

// https://github.com/axios/axios/issues/1174#issuecomment-349014752
const AXIOS_TIME_OUT_ERROR_CODE = 'ECONNABORTED';

axios.interceptors.response.use(
  (response: AxiosResponse): any => parsingResponse(response),
  (error: any) => {
    const { config = {} } = error;
    const messageTitle = `请求异常: ${config.url}`;
    const statusCode =
      error.code === AXIOS_TIME_OUT_ERROR_CODE
        ? HTTP_STATUS_CODES.REQUEST_TIME_OUT
        : error.response?.status ?? 'UNKNOWN';
    // cancel 的请求不需要报错
    if (isCancel(error)) {
      return Promise.reject(error);
    }
    message.error({
      content: `${messageTitle} Code: ${statusCode}`,
    });

    if ([HTTP_STATUS_CODES.NOT_FOUND, HTTP_STATUS_CODES.GATEWAY_TIMEOUT].includes(statusCode)) {
      // setPageError(statusCode);
    }

    if (__DEBUG__) {
      const { responseURL } = error.request;
      console.groupCollapsed(messageTitle);
      console.log(`Request URL: ${responseURL}`);
      console.log(`Request Method: ${config.method}`);
      !_.isEmpty(config.params) && console.log('Request Params: ', config.params);
      !_.isNil(config.data) && console.log('Request Data: ', config.data);
      console.error(error);
      console.log('Config: ', error.config);
      console.groupEnd();
    }
    return Promise.reject(error);
  },
);
