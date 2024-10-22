const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = env => {
  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'ads.js',
      library: 'pads',
      libraryTarget: 'umd',
      globalObject: 'window',
      libraryExport: 'default',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    },
    plugins: [
      new Dotenv({path: env.production ? `./.env.prod` : './.env.dev'}),
    ]
  };
}
