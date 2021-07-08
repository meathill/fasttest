const { promises: { readFile } } = require('fs');
const { resolve } = require('path');
const { cloneDeep, mapValues, omit } = require('lodash');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { DefinePlugin } = require('webpack');
const marked = require('marked');
const base = require('./webpack.config');
const pkg = require('../package.json');

/* global __dirname */

module.exports = async(language = 'English', path = 'en', cases, langs, intro) => {
  const devMode = process.env.NODE_ENV !== 'production';
  console.log('Current mode: ', devMode ? 'Development' : 'Production');
  console.log('Current language: ', language);
  langs = mapValues(omit(langs, language), ({ __path }) => __path);
  if (language === 'English' && !intro) {
    intro = await readFile(resolve(__dirname, '../src/data/base-info.md'), 'utf8');
  }
  if (intro) {
    intro = marked(intro);
  }

  const destDir = resolve(__dirname, `../dist/${path}`);
  let config = await base(false);
  config = {
    ...config,
    output: {
      path: destDir,
      filename: '[name].js',
      publicPath: devMode || !path ? '/' : `/${path}/`,
    },
    plugins: [
      new DefinePlugin({
        devMode,
      }),
      new HtmlWebpackPlugin({
        template: resolve(__dirname, '../src/template/index.pug'),
        filename: 'index.html',
        templateParameters: {
          cases,
          langs,
          version: pkg.version,
          language,
          path,
          intro,
        },
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
      }),
    ],
    mode: 'production',
    devtool: false,
    optimization: {
      splitChunks: {
        cacheGroups: {
          styles: {
            type: 'css/mini-extract',
            name: 'screen',
            test: /\.(css|styl)$/,
            chunks: 'all',
            enforce: true,
          },
        },
      },
      minimizer: [
        new CssMinimizerPlugin(),
        new TerserPlugin({
          terserOptions: {
            ecma: 9,
            toplevel: true,
            compress: {
              drop_console: true, // eslint-disable-line camelcase
            },
          },
        }),
      ],
    },
  };
  config.module.rules = config.module.rules.map(rule => {
    rule = cloneDeep(rule);
    if (rule.test.test('a.styl') || rule.test.test('a.css')) {
      rule.use[0] = MiniCssExtractPlugin.loader;
    }
    if (rule.test.test('a.mp4')) {
      rule.use[0].options.publicPath = devMode || !path ? '/assets' : `/${path}/assets`;
    }
    return rule;
  });
  return config;
};
