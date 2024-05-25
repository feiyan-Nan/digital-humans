/* eslint-disable */
import _ from 'lodash';
import { __DEBUG__ } from '@/constants/config';
import HTTP_STATUS_CODES from '@/utils/request/httpStatusCodes';
import RESPONSE_STATUS from '@/constants/responseStatus';
import { AxiosResponse } from 'axios';

/**
 * 监听的状态码
 */
export const LISTENED_HTTP_CODES = [
  HTTP_STATUS_CODES.BAD_REQUEST,
  HTTP_STATUS_CODES.UNAUTHORIZED,
  HTTP_STATUS_CODES.FORBIDDEN,
  HTTP_STATUS_CODES.NOT_FOUND,
  HTTP_STATUS_CODES.CONFLICT,
  HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY,
  HTTP_STATUS_CODES.LOCKED,
];

/**
 * 通用响应
 */
export interface CommonResponse<T = any> {
  /**
   * 状态
   */
  status: RESPONSE_STATUS;
  /**
   * 错误消息（一般会以 弹窗的形式 展示）
   */
  message?: string;
  /**
   * 为重定向提供的 url
   */
  url?: string;
  /**
   * 字段错误信息
   */
  errors?: Record<string, any>;
  /**
   * 分页信息
   */
  page?: Record<string, any>;
  /**
   * 后端返回的数据
   */
  data?: T;
}

/**
 * 检验后端服务端返回的数据
 */
export default function checkResponseCode(response: AxiosResponse): CommonResponse {
  const { status, data = {}, data: { message } = { message: '' } } = response;
  switch (true) {
    case status >= 200 && status < 300: {
      const responseData = { status: RESPONSE_STATUS.SUCCESS, data };
      if (data.page) {
        _.set(responseData, 'page', data.page);
      }
      return responseData;
    }

    // 400
    case status === HTTP_STATUS_CODES.BAD_REQUEST:

    // 409
    case status === HTTP_STATUS_CODES.CONFLICT:
    // 423
    case status === HTTP_STATUS_CODES.LOCKED: {
      return { status: RESPONSE_STATUS.INVALID, message };
    }

    // 401
    case status === HTTP_STATUS_CODES.UNAUTHORIZED: {
      // 移动端跳转到 移动端页面，pc 端跳转到pc页面
      const baseUrl = /\/mobile\//.test(location.href) ? '/mobile' : '/';
      const { url = baseUrl } = data || {};
      if (__DEBUG__) {
        console.warn(
          `Response invalid format: 401 without url , it will redirect to default url : "${baseUrl}" . Detail :`,
          response
        );
      }
      if (!(response.config as any).preventRedirect) {
        window.location.replace(url);
      }
      return { status: RESPONSE_STATUS.NOT_LOGGED_IN, url };
    }

    // 403
    case status === HTTP_STATUS_CODES.FORBIDDEN: {
      return { status: RESPONSE_STATUS.NO_ACCESS, message };
    }

    // 404
    case status === HTTP_STATUS_CODES.NOT_FOUND: {
      return { status: RESPONSE_STATUS.NOT_FOUND, message };
    }

    // 422
    case status === HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY: {
      return {
        status: RESPONSE_STATUS.FIELD_INVALID,
        message,
        errors: Object.keys(data.fields || {}).reduce((errors, field) => {
          errors[field] = _.map(data.fields[field] || [], 'message').join(';');
          return errors;
        }, {}),
      };
    }

    default: {
      return { status: RESPONSE_STATUS.SUCCESS, page: data.page, data };
    }
  }
}
