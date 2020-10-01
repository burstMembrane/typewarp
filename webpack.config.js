const currentTask = process.env.npm_lifecycle_event
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const fse = require('fs-extra')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

// make a new HtmlWebpack plugin for each file in the app folder
let pages = fse
  .readdirSync('./app')
  .filter((file) => {
    return file.endsWith('.html')
  })
  .map(
    (page) =>
      new HtmlWebpackPlugin({
        filename: page,
        template: `./app/${page}`
      })
  )

let cssConfig = {
  test: /\.css$/i,
  use: [
    {
      loader: 'css-loader'
    },
    'postcss-loader'
  ]
}
// shared config between build and dev tasks
let config = {
  devtool: 'inline-source-map',
  // set entry point (index) for webpack
  entry: './app/assets/scripts/App.js',
  plugins: pages,
  // set output to custom path
  module: {
    rules: [
      cssConfig,
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.(ttf|otf)$/,
        use: ['file-loader?name=fonts/[name].[ext]']
      }
    ]
  }
}

if (currentTask == 'dev') {
  config.output = {
    filename: 'bundled.js',
    path: path.resolve(__dirname, 'app')
  }
  config.devServer = {
    before: (app, server) => {
      server._watch(path.join(__dirname, './app/**/*.html'))
    },
    host: '0.0.0.0',
    contentBase: path.join(__dirname, 'app'),
    hot: true,
    port: 3000,
    stats: 'errors-only'
  }
  // set to development
  config.mode = 'development'
  cssConfig.use.unshift('style-loader')
}

if (currentTask == 'build') {
  config.module.rules.push({
    test: /\.js$/,
    exclude: /(node_modules)/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env']
      }
    }
  })
  config.output = {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist')
  }
  config.mode = 'production'
  config.optimization = {
    splitChunks: {
      chunks: 'all'
    },
    minimizer: [new UglifyJsPlugin()]
  }
  config.plugins = [
    ...config.plugins,
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'styles.[chunkhash].css'
    })
    //new RunAfterCompile(),
  ]
  cssConfig.use.unshift(MiniCssExtractPlugin.loader)
}

module.exports = config
