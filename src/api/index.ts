import axios from 'axios';
import { message } from 'antd';

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
    appSecret:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MTgyMDYwMzcsInVzZXJuYW1lIjoiMTg2MTAwMTU1MzgifQ._tsDvCKwl6X5fZ2wjy6esvX0_wEYBCEq-eEAxx5KJ5I',
    'X-Access-Token':
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MTgyMDYwMzcsInVzZXJuYW1lIjoiMTg2MTAwMTU1MzgifQ._tsDvCKwl6X5fZ2wjy6esvX0_wEYBCEq-eEAxx5KJ5I',
  });

  return config;
});

instance.interceptors.response.use(
  async (res) => {
    if (res.data.code !== 200) {
      message.error(res.data.message);
    }

    return res.data;
  },
  (error) => {
    message.error(error.response.data.message);
  },
);

type IResponse = { code: number; result: any };

/**
 *
 * @param data
 * @returns
 *
 * @description
 * 获取免费数字人列表
 */
export const getFreePersonList = (data = {}) =>
  instance<
    null,
    {
      code: number;
      data: {
        avatarUrl: string;
        digitalId: number;
      }[];
    }
  >({
    url: '/api/digitalVhost/getFreePersonList',
    method: 'get',
    data,
  });

/**
 *
 * @param data
 * @returns
 *
 * @description
 * 获取最新定制成功的数字人
 */

type IPersonRes = {
  code: number;
  data: {
    avatarUrl: string;
    digitalId: number;
  }[];
};

export const getSuccessPersonList = (data = {}) =>
  instance<null, IPersonRes>({
    url: '/api/digitalVhost/getSuccessPersonList',
    method: 'get',
    data,
  });

type IBackoundRes = {
  code: number;
  data: {
    url: string;
    backgroundId: number;
  }[];
};

// 获取免费的背景列表
export const getFreeBackgroundList = (data = {}) =>
  instance<null, IBackoundRes>({
    url: '/api/digitalVhost/getFreeBackgroundList',
    method: 'get',
    data,
  });

// 获取上传的背景列表
export const getUploadBackgroundList = (data = {}) =>
  instance<null, IBackoundRes>({
    url: '/api/digitalVhost/getUploadBackgroundList',
    method: 'get',
    data,
  });

type IAudioRes = {
  code: number;
  data: {
    audioDisplayUrl: string;
    id: number;
  }[];
};

// 获取免费的录音列表
export const getAudioFreeList = (data = {}) =>
  instance<null, IAudioRes>({
    url: '/api/digitalVhost/audioFreeList',
    method: 'get',
    data,
  });

// 获取上传的录音列表
export const getCustomAudioList = (data = {}) =>
  instance<null, IAudioRes>({
    url: '/api/digitalVhost/audioCustomList',
    method: 'get',
    data,
  });

// 视频作品列表
export const getVideoList = (data = {}) =>
  instance<null, IResponse>({
    url: 'api/video/get_video_list',
    method: 'post',
    data,
  });

/**
 * 上传视频接口
 * @param formData
 * @returns {IResponse}
 */
export const uploadVideoFile = (formData: FormData) =>
  instance<null, IResponse>({
    url: '/api/digitalVhost/fileUpload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },

    data: formData,
  });

export const makrPerson = (data: { description: string; name: string; trainVideo: string }) =>
  instance<null, IResponse>({
    url: 'api/digital/custom_person_asset',
    method: 'post',
    data,
  });

export const createVideoByText = (data: {
  name: string;
  textList: string[];
  voice: string;
  digitalPersonAssetsId: number;
}) =>
  instance<null, IResponse>({
    url: 'api/video/create_with_tts',
    method: 'post',
    data,
  });

export default {
  getFreePersonList,
  getSuccessPersonList,
  getFreeBackgroundList,
  getUploadBackgroundList,
  getAudioFreeList,
  getCustomAudioList,
  getVideoList,
  uploadVideoFile,
  makrPerson,
  createVideoByText,
};
