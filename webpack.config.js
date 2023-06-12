const path = require('node:path')

module.exports = {
  entry: './HemeraCalendar.ts',
  context: path.resolve(__dirname, 'src/HemerasCalendar/ts'),
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    preferRelative: true,
    extensions: ['.ts', '.js']
  },
  devtool: 'inline-source-map',
  output: {
    filename: 'HemeraCalendar.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'development'
}
