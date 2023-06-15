const path = require('node:path')

module.exports = {
  entry: './main.ts',
  output: {
    filename: 'HemeraCalendar.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    library: {
      name: 'HemeraObject',
      type: 'var'
    }
  },
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
    alias: {
      '@': path.resolve(__dirname, 'src/HemerasCalendar/ts')
    },
    extensions: ['.ts', '.js']
  },
  devtool: 'inline-source-map',
  mode: 'development'
}
