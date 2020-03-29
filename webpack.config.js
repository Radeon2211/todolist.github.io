const path = require('path');

module.exports = {
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, 'dist/assets'),
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    publicPath: '/assets/',
    host: '0.0.0.0',
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              { useBuiltIns: 'usage', corejs: { version: 3 } },
            ],
          ],
          plugins: [
            '@babel/plugin-proposal-class-properties',
          ],
        },
      },
    }],
  },
};
