const { resolve } = require('path');
const { mapValues } = require('lodash');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const base = require('./webpack.base.config');
const pkg = require('../package.json');
const cases = require('../src/data/case');
const lang = require('../src/data/lang');

global.__ = value => value;

module.exports = async() => {
  const langs = mapValues(lang, ({ __path }) => __path);
  return {
    ...base,
    entry: resolve(__dirname, '../src/index.js'),
    output: {
      path: '/',
      filename: '[name].js',
      publicPath: '/',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: resolve(__dirname, '../src/template/index.pug'),
        filename: 'index.html',
        templateParameters: {
          cases,
          langs,
          version: pkg.version,
          language: 'English',
        },
      }),
    ],
  };
};
