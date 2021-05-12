const {resolve} = require('path');
const {
  promises: {
    appendFile,
  },
} = require('fs');
const {DefinePlugin, IgnorePlugin} = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const cases = require('../src/data/case');

/* global __dirname */
const devMode = process.env.NODE_ENV !== 'production';
const lang = process.env.TARGET_LANG || 'en';
console.log('Current mode: ', devMode ? 'Development' : 'Production');
console.log('Current language: ', lang);
const destDir = resolve(__dirname, `../${lang}`);

const translation = require(`../lang/${lang}`);
let po;
const missingTranslation = lang === 'en' ? null : resolve(__dirname, '../missing.txt');

global.__ = function(value) {
  if (po && po[value]) {
    let translation = po[value];
    translation = isArray(translation) ? translation.join('') : translation;
    value = translation || value;
  } else if (lang !== 'en') {
    console.warn('[i18n] no translation: ' + value);
    appendFile(missingTranslation, value + '\n', 'utf8');
  }
  return value.replace(/#\[sup (.*?)]/g, '<sup>$1</sup>');
};

const plugins = [
  new DefinePlugin({
  }),
  new IgnorePlugin(/^\.\/locale$/, /moment$/),
  new HtmlWebpackPlugin({
    template: './src/template/index.pug',
    filename: 'index.html',
    templateParameters: {
      cases,
    },
  }),
];

const config = {
  entry: './src/index.js',
  output: {
    path: destDir,
    filename: '[name].js',
    publicPath: devMode ? '/' : `/${lang}/`,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.pug$/,
        oneOf: [
          {
            resourceQuery: /^\?vue/,
            use: ['pug-plain-loader'],
          },
          {
            use: ['pug-loader'],
          },
        ],
      },
      {
        test: /\.styl(us)?$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'stylus-loader',
            options: {
              stylusOptions: {
                includeCSS: true,
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.po$/,
        use: [
          'json-loader',
          {
            loader: 'po-loader',
            options: {
              format: 'mf', // po2json options
            },
          },
        ],
      },
      {
        test: /\.(webp|png|jpg|gif|svg|woff2|eot|woff|ttf|ico|mp4)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              outputPath: 'assets',
              publicPath: devMode ? '/assets' : `/${lang}/assets`,
              esModule: false,
            },
          },
        ],
      },
    ],
  },
  devtool: 'eval-cheap-module-source-map',
  mode: 'development',
  resolve: {
    extensions: ['.js', '.json', '.vue'],
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins,
  devServer: {
    port: 8080,
  },
};

module.exports = async() => {
  return config;
};
