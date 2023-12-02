const { merge } = require('webpack-merge');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('node:path');

process.env.NODE_ENV = 'production';

const common = require('./webpack.common.js');

console.log('✨ Welcome to the Hemeras Calendar\n');
console.log('The compilation is running.\n');

module.exports = merge(common, {
  mode: 'production',

  plugins: [
    new CopyPlugin({
      patterns: [
        { from: path.join(__dirname, 'public/calendar.ico'), to: '.' },
        { from: path.join(__dirname, 'public/index.html'), to: '.' },
      ],
    }),
  ],
});
