const config = require('./webpack.admin.config');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { resolve } = require('path');

module.exports = {
  ...config,

  output: {
    path: resolve(__dirname, '../server/public'),
    publicPath: '/',
  },
  mode: 'production',
  devtool: false,
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        terserOptions: {
          ecma: 9,
        },
      }),
    ],
  },
};
