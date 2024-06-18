import axios from 'axios';
import { message } from 'antd';

const instance = axios.create({
  // base接口，表示请求URL的公共部分
  baseURL: '',
  // 超时 设置为5分钟
  timeout: 60 * 60 * 1000,
  // 还可以进行一些其他的配置
});

const token = document.cookie
  .split(';')
  .find((i) => i.includes('token='))
  ?.replace('token=', '');

instance.interceptors.request.use((config) => {
  Object.assign(config.headers, {
    appKey: '1550708352504bb1972e8afecdd807c1',
    appSecret: token,
    'X-Access-Token': token,
    'Project-Source': 'digital-vhost',
  });

  return config;
});

instance.interceptors.response.use(
  async (res) => {
    if (res.data.code === 401) {
      window.location.href = 'https://login.aidigitalfield.com/';
      return res.data;
    }

    if (res.data.code !== 200) {
      message.error(res.data.message);
    }

    return res.data;
  },
  (error) => {
    message.error(error.response.data.message);

    const { status } = error.response;

    if (status === 401) {
      document.cookie = 'token=;domain=aidigitalfield.com';
      document.cookie = 'token=;domain=127.0.0.1;';
      document.cookie = 'token=;domain=*;';
      window.location.href = 'https://login.aidigitalfield.com/';
    }
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
  instance<null, IPersonRes>({
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

export type IPersonRes = {
  code: number;
  data: {
    avatarUrl: string;
    name: string;
    digitalId: number;
    status?: 'FAIL' | 'IN_PROGRESS' | 'SUCCESS';
  }[];
};

export const getSuccessPersonList = (data = {}) =>
  instance<null, IPersonRes>({
    url: '/api/digitalVhost/getCustomPersonList',
    method: 'post',
    data,
  });

export const createVideo = (data = {}) =>
  instance<null, IPersonRes>({
    url: '/api/digitalVhost/createVideo',
    method: 'post',
    data,
  });

export type IBackoundRes = {
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

export type IAudioRes = {
  code: number;
  data: {
    previewPictureUrl: string;
    id: number;
    status: 'SUCCESS' | 'DRAFT' | 'FAIL' | 'IN_PROGRESS';
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
    url: '/api/digitalVhost/audioUploadList',
    method: 'get',
    data,
  });

export type IVideoRes = {
  code: number;
  data: any[];
};

// 视频作品列表
export const getVideoList = (data = {}) =>
  instance<null, IVideoRes>({
    url: '/api/digitalVhost/getVideoList',
    method: 'post',
    data,
  });

/**
 * 上传视频接口
 * @param formData
 */
export const uploadVideoFile = (formData: FormData) =>
  instance<null, any>({
    url: '/api/digitalVhost/fileUpload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },

    data: formData,
  });

export const uploadBackgroundFile = (formData: FormData) =>
  instance<null, IResponse>({
    url: '/api/material/upload_background',
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

export const deletePerson = (data: { assetId: number }) =>
  instance<null, any>({
    url: '/openApiDigitalPerson/customer/deleteDigitalPersonAsset',
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

export const updatePersonAssetName = (data: { digitalPersonAssetsId: number; name: string }) =>
  instance<null, any>({
    url: '/openApiDigitalPerson/customer/updatePersonAssetName',
    method: 'post',
    data,
  });

export const createDraftVideo = (data: any) =>
  instance<null, any>({
    url: '/api/digitalVhost/createDraftVideo',
    method: 'post',
    data,
  });

export const getDraftVideo = () =>
  instance<null, any>({
    url: '/api/digitalVhost/getDraftVideo',
    method: 'post',
  });

export const deleteWork = (data: any) =>
  instance<null, any>({
    url: '/openApiDigitalPerson/customer/deleteWork',
    method: 'post',
    data,
  });

export const logout = () =>
  instance<null, any>({
    url: '/api/digital/logout',
    method: 'post',
  });

export const uploadAudio = (formData: FormData) =>
  instance<null, any>({
    url: '/openApiDigitalPerson/customer/uploadAudio',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },

    data: formData,
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
  uploadBackgroundFile,
  deletePerson,
  updatePersonAssetName,
  createDraftVideo,
  getDraftVideo,
  createVideo,
  uploadAudio,
  deleteWork,
  logout,
};
