enum RESPONSE_STATUS {
  /**
   * 错误
   */
  'ERROR' = 'ERROR',
  /**
   * 无效
   * @description 400 409
   */
  'INVALID' = 'INVALID',
  /**
   * 请求中
   */
  'REQUEST' = 'REQUEST',
  /**
   * 成功
   */
  'SUCCESS' = 'SUCCESS',
  /**
   * @deprecated
   */
  'LOADED' = 'LOADED',
  /**
   * @deprecated
   */
  'FAILURE' = 'FAILURE',
  /**
   * 登出
   */
  'LOGOUT' = 'LOGOUT',
  /**
   * 没有发现该资源
   * @description 404
   */
  'NOT_FOUND' = 'NOT_FOUND',
  /**
   *
   */
  'FIELD_INVALID' = 'FIELD_INVALID',
  /**
   * 未登录/登录失效
   * @description 401
   */
  'NOT_LOGGED_IN' = 'NOT_LOGGED_IN',
  /**
   * 没有权限
   * @description 403
   */
  'NO_ACCESS' = 'NO_ACCESS',
  /**
   *
   */
  'EXCEPTION' = 'EXCEPTION',
  /**
   * 重定向
   * @description
   */
  'REDIRECT' = 'REDIRECT',
}

export default RESPONSE_STATUS;
