'use strict'

const { resolve } = require('path')

module.exports = {
  entry: ['babel-polyfill', './src/index'],
  output: {
    path: __dirname,
    filename: './public/bundle.js'
  },
  mode: 'development',
  context: __dirname,
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /jsx?$/,
        include: resolve(__dirname, './src'),
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
    ]
  },
}
