import _ from 'lodash';

/**
 * 从 {@link https://github.com/axios/axios/blob/master/lib/helpers/buildURL.js#L5}
 * axios 默认不转义“@ : $ , + [ ]”只能重写 paramsSerializer 进行修复
 * @type {(uriComponent: string) => string}
 */
const encode = encodeURIComponent;

export default function paramsSerializer(params: any) {
  let parts: any[] = [];

  _.forEach(params, (val: any, key: string) => {
    if (val === null || typeof val === 'undefined') {
      return;
    }

    if (!_.isArray(val)) {
      val = [val];
    }

    _.forEach(val, (v: any) => {
      if (_.isDate(v)) {
        v = v.toISOString();
      } else if (_.isObject(v)) {
        v = JSON.stringify(v);
      }
      parts.push(`${encode(key)}=${encode(v)}`);
    });
  });
  return parts.join('&');
}
