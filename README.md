FastTest.com
============

[中文](./README.cn.md)

A simple but very complete full-stack project.

[afasttest.com](https://afasttest.com)


Setup
---------

1. Clone this repo
2. Install dependencies via `npm i`
3. Start static dev server `npm run serve`
4. Start server `npm run server`
5. Start admin panel `npm run serve:admin`


Deploy
------

### Prerequisites

* Node.js >= 14
* nginx >= 1.10
* pm2

### Steps

* Do what [Setup](#setup) need to do
* Build the admin panel `npm run build:admin`
* Configure nginx like [static pages](./conf/fasttest.conf) and [SPA site](./conf/fasttest-admin.conf)
* Start server via `pm2 start index.js`


License
-------

[MIT](https://opensource.org/licenses/MIT)
