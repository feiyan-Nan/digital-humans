import axios, { AxiosRequestConfig } from 'axios';

const mutexes: Record<string, any> = {};

interface Config {
  mutex?: string;
}
axios.defaults.withCredentials = true;
axios.interceptors.request.use((config: Config & AxiosRequestConfig) => {
  if (config.mutex) {
    let source = mutexes[config.mutex];

    if (source) {
      source.cancel();
    }
    source = axios.CancelToken.source();
    mutexes[config.mutex] = source;
    config.cancelToken = source.token;
  }
  return config;
});
