const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const rootPath = path.resolve(__dirname, '..');

module.exports = {
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devtool: false,
  entry: path.resolve(rootPath, 'main', 'main.js'),
  target: 'electron-main',
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  node: {
    __dirname: false,
  },
  output: {
    path: path.resolve(rootPath, 'dist'),
    filename: 'main.js',
  },
  plugins: [new CleanWebpackPlugin()],
};
