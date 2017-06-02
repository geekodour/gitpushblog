const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require('webpack');

const extractSass = new ExtractTextPlugin({
    filename: "[name].css"
});

module.exports = {
  devtool: 'cheap-module-source-map',

  entry: {
        main: './static/main.js',
        prism: './static/vendor/prism.js'
  },

  output: {
    path: path.join(__dirname, './dev/assets'),
    filename: '[name].js',
    sourceMapFilename: '[name].map'
  },

  module: {
    rules: [
      {
              test: /\.(js|jsx)$/,
              use: [
                {loader:'babel-loader'}
              ],
              exclude: /node_modules/
      },
      {
            test: /\.sass$/,
            use: extractSass.extract({
                use: [{
                    loader: "css-loader"
                },
                {
                    loader: "postcss-loader"
                },
                {
                    loader: "sass-loader"
                }],
                // use style-loader in development
                fallback: "style-loader"
            })
        }
    ]
  },
  plugins: [
        new webpack.optimize.CommonsChunkPlugin({
                name: 'common',
                filename: 'bundle.common.js',
                chunks: []

        }),
        extractSass
  ]

}
