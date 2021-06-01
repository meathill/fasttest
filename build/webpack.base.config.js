const { resolve } = require('path');
const { IgnorePlugin } = require('webpack');

module.exports = {
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
        test: /\.(webp|png|jpg|gif|svg|woff2|eot|woff|ttf|ico|mp4)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              outputPath: 'assets',
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
  plugins: [
    new IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
  devServer: {
    port: 8080,
  },
};
