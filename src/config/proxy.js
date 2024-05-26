/** 如无特殊需求，此文件更改无需提交！！！！ * */

// local
const target = 'http://service.aicloud.fit:9528';
const secure = false;

// 测试服务器
const testServer = {
  target,
  secure,
  changeOrigin: true,
};

// mock 服务器
const mockServer = {
  target: 'http://10.16.2.133:8080',
  pathRewrite(path, req) {
    path = path.replace(/\?.*/, '');
    return `/server/index.php?g=Web&c=Mock&o=mock&projectID=956&uri=${path}`;
  },
};

// simple mock 服务器
const simpleMockServer = {
  target: 'http://10.16.2.133:8080',
  pathRewrite(path, req) {
    path = path.replace(/\?.*/, '');
    return `/server/index.php?g=Web&c=Mock&o=simple&projectID=956&uri=${path}`;
  },
};

const getServer = (server) => (process.env.PROXY === 'MOCK' ? server : testServer);

/**
 * 配置文档 https://github.com/chimurai/http-proxy-middleware#context-matching
 */
module.exports = {
  '/api/templates/*': getServer(simpleMockServer),
  '/api/templates': getServer(mockServer),
  '/api/wechat/login': getServer(mockServer),
  '/api/wechat/*': getServer(mockServer),
  '/api/*': getServer(mockServer),
  '/private-traffic/api/*': getServer(mockServer),
  '/permission/api/*': getServer(mockServer),
  '/insight/api/*': getServer(mockServer),
  '/e-commerce-marketing/api/*': getServer(mockServer),
  '/questionnaires/api/report/*': getServer(simpleMockServer),
  '/questionnaires/api/*': getServer(mockServer),
  '/operation-monitoring/api/*': getServer(mockServer),
  '/crowds/api/': getServer(simpleMockServer),
  '/sign/api/': getServer(simpleMockServer),
  '/consumer-insight/api/*': getServer(mockServer),
  '/consumer-voice/api/*': getServer(mockServer),
  '/crowd-busi/api/*': getServer(mockServer),
  '/crowd-task/api/*': getServer(mockServer),
  '/api/material/get_upload_background_list': getServer(mockServer),
};
