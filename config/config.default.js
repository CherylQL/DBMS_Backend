/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1620209295212_6592';

  // add your middleware config here
  config.middleware = [];
  // config.auth = {
  //   ignore: [ '/', '/login' ],
  // };
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };
  config.mysql = {
    client: {
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: 'root',
      database: 'dbms',
    },
    app: true,
    agent: false,
  };
  config.cors = {
    origin: 'http://localhost:3000',
    allowHeaders: 'content-type,Authorization,X-Requested-With',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS,FETCH',
    maxAge: 1728000,
  };
  config.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList: [ '*' ],
  };
  config.jwt = {
    secret: '123456',
  };
  config.multipart = {
    mode: 'stream',
    whitelist: ['.txt'],
  };

  return {
    ...config,
    ...userConfig,
  };
};
