const {
  promises: {
     readFile,
  },
  existsSync,
} = require('fs');
const { resolve } = require('path');
const { mapValues } = require('lodash');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin } = require('webpack');
const marked = require('marked');
const base = require('./webpack.base.config');
const pkg = require('../package.json');

let cases, lang;
if (existsSync(resolve(__dirname, '../src/data/cases.json'))) {
  cases = require('../src/data/cases.json');
} else {
  cases = require('../src/data/case.js');
}
if (existsSync(resolve(__dirname, '../src/data/lang.json'))) {
  lang = require('../src/data/lang.json');
} else {
  lang = require('../src/data/lang.js');
}

global.__ = value => value;

module.exports = async(readIntro = true) => {
  const langs = mapValues(lang, ({ __path }) => __path);
  let intro = '';
  if (readIntro) {
    intro = await readFile(resolve(__dirname, '../src/data/base-info.md'), 'utf8');
    intro = marked(intro);
  }
  return {
    ...base,
    entry: resolve(__dirname, '../src/index.js'),
    output: {
      path: '/',
      filename: '[name].js',
      publicPath: '/',
    },
    plugins: [
      new DefinePlugin({
        devMode: true,
      }),
      new HtmlWebpackPlugin({
        template: resolve(__dirname, '../src/template/index.pug'),
        filename: 'index.html',
        templateParameters: {
          cases,
          langs,
          version: pkg.version,
          language: 'English',
          intro,
        },
      }),
    ],
  };
};
