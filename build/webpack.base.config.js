const { resolve } = require('path');

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
        test: /\.(webp|png|jpg|gif|svg|woff2|eot|woff|ttf|otf|ico|mp4)$/,
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
    extensions: ['.json', '.js', '.vue'],
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  devServer: {
    port: 8080,
  },
};
