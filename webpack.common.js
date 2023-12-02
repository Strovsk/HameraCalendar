const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('node:path');

module.exports = {
  entry: {
    HameraCalendar: './main.ts',
  },

  context: path.resolve(__dirname, 'src/HemerasCalendar/ts'),

  output: {
    filename: 'HameraCalendar.min.js',
    library: 'HameraCalendar',
    libraryTarget: 'var',
    libraryExport: 'HameraCalendar',
    path: path.resolve(
      __dirname,
      process.env.NODE_ENV === 'development' ? 'target' : 'dist'
    ),
    hotUpdateChunkFilename: './tmp/hot-update.js',
    hotUpdateMainFilename: './tmp/hot-update.json',
  },

  module: {
    rules: [
      {
        test: /.s?css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/HemerasCalendar/ts'),
      '@css': path.resolve(__dirname, 'public/css'),
    },
    extensions: ['.ts', '.js'],
  },

  optimization: {
    // minimize: true,
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
  },

  plugins: [new MiniCssExtractPlugin({ filename: 'HameraCalendar.min.css' })],
};
