import axios from 'axios';

const instance = axios.create({
  // base接口，表示请求URL的公共部分
  baseURL: '',
  // 超时
  timeout: 30000,
  // 还可以进行一些其他的配置
});

instance.interceptors.request.use((config) => {
  Object.assign(config.headers, {
    appKey: '1550708352504bb1972e8afecdd807c1',
    appSecret: '5M5o6g9CLopX84skFOsdzaTgzj4/C+KNUba8RajCAwI=',
  });

  return config;
});

instance.interceptors.response.use(async (res) => res.data);

type IResponse = { code: number; result: any };

// 获取数字人列表
export const getPersonList = (data = {}) =>
  instance<null, IResponse>({
    url: '/api/digital/get_person_list',
    method: 'post',
    data,
  });

// 获取背景列表
export const getBackgroundList = (data = {}) =>
  instance<null, IResponse>({
    url: 'api/material/get_upload_background_list',
    method: 'post',
    data,
  });

// 获取音色列表
export const getAudioList = (data = {}) =>
  instance<null, IResponse>({
    url: '/api/video/get_audio_list',
    method: 'post',
    data,
  });

// 视频作品列表
export const getVideoList = (data = {}) =>
  instance<null, IResponse>({
    url: 'api/video/get_video_list',
    method: 'post',
    data,
  });

export default {
  getPersonList,
  getBackgroundList,
  getAudioList,
  getVideoList,
};
