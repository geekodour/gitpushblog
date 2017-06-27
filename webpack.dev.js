const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require('webpack');
const bc = require('./blog_config.json');

const THEME_DIR = path.join(__dirname,'themes',bc.meta.blog_theme)

// plugin inits
const extractSass = new ExtractTextPlugin({
    filename: "[name].css"
});

const commonChunkOptimize = new webpack.optimize.CommonsChunkPlugin({
    name: 'common',
    filename: 'bundle.common.js',
    chunks: []
});


module.exports = {
  devtool: 'cheap-module-source-map',

  entry: {
        main: path.join(THEME_DIR,'static','js','main.js'),
  },

  output: {
    path: path.join(__dirname,'dev','assets'),
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
        commonChunkOptimize,
        extractSass
  ]

}
