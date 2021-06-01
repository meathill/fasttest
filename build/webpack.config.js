const { resolve } = require('path');
const base = require('./webpack.base.config');

module.exports = async() => {
  return {
    ...base,
    entry: resolve(__dirname, '../src/index.js'),
  };
};
