FastTest.com
============

麻雀虽小，五脏俱全的全栈项目。涵盖各种入门。

[afasttest.com](https://afasttest.com)


安装
----

1. git clone 本项目
2. 安装依赖 `npm i`
3. 启动前端静态页 `npm run serve`
4. 启动 express 服务器 `npm run server`
5. 启动 Vue3 全家桶后台（SPA） `npm run serve:admin`


部署
----

### 系统需求

* node >= 14
* nginx >= 1.10
* pm2

### 部署

1. 执行 [安装](#安装) 步骤
2. 编译后台 `npm run build:admin`
3. 参考 [静态页面配置文件](./conf/fasttest.conf) 配置静态页面服务
4. 参考 [后台配置文件](./conf/fasttest-admin.conf) 配置后台页面服务
5. 启动服务器 `pm2 start index.js`


协议
----

[MIT](https://opensource.org/licenses/MIT)
