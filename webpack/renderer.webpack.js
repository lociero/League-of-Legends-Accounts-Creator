const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const rootPath = path.resolve(__dirname, '..');

module.exports = {
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    mainFields: ['main', 'module', 'browser'],
  },
  entry: path.resolve(rootPath, 'renderer', 'App.jsx'),
  target: 'electron-renderer',
  devtool: false,
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(js|ts|tsx|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|ico)$/,
        use: [{ loader: 'url-loader' }],
      },
    ],
  },
  devServer: {
    contentBase: path.join(rootPath, 'dist'),
    historyApiFallback: true,
    compress: true,
    hot: true,
    port: 4000,
    publicPath: '/',
  },
  output: {
    path: path.resolve(rootPath, 'dist'),
    filename: 'renderer.js',
    publicPath: './',
  },
  plugins: [new HtmlWebpackPlugin(), new MiniCssExtractPlugin()],
  optimization: {
    minimize: process.env.NODE_ENV === 'production',
    minimizer: [`...`, new CssMinimizerPlugin()],
  },
};
