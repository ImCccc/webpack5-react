/*
  webpack 相关:
  yarn add webpack webpack-cli -D

  html插件:
  yarn add html-webpack-plugin -D
  
  复制文件插件:
  yarn add copy-webpack-plugin -D

  css相关:
  yarn add style-loader css-loader -D
  yarn add less less-loader css-loader -D
  yarn add postcss postcss-loader postcss-preset-env -D
  yarn add mini-css-extract-plugin css-minimizer-webpack-plugin -D

  babel相关:
  yarn add babel-loader @babel/core babel-preset-react-app -D

  eslint相关:
  yarn add eslint eslint-webpack-plugin eslint-config-react-app -D

  react 组件热更新:
  yarn add @pmmmwh/react-refresh-webpack-plugin react-refresh -D

  开发服务器:
  yarn add webpack-dev-server -D
*/

const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const EslintPlugin = require("eslint-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const path = require("path");
const mode = process.env.NODE_ENV;
const isDev = mode === "development";
const isPrd = mode === "production";

let output = {
  clean: true,
  path: path.join(__dirname, "../dist"),
  filename: "js/[name].[contenthash:10].js",
  chunkFilename: "js/chunk.[name].[contenthash:5].js",
  assetModuleFilename: "imgs/[hash:5][ext][query]",
};

if (isDev) {
  output = {
    filename: "js/[name].js",
    chunkFilename: "js/chunk.[name].js",
    assetModuleFilename: "imgs/[hash:5][ext][query]",
  };
}

const postcssLoader = {
  loader: "postcss-loader",
  options: {
    postcssOptions: { plugins: ["postcss-preset-env"] },
  },
};

/** @type import("webpack").Configuration */
const config = {
  mode,
  output,
  entry: "/src/main.js",
  devtool: isDev ? "cheap-module-source-map" : "source-map",

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          isDev ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          postcssLoader,
        ],
      },
      {
        test: /\.less$/,
        use: [
          isDev ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          postcssLoader,
          "less-loader",
        ],
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            cacheCompression: false,
            // 开发环境需要 react 组件热更新的配置
            plugins: [isDev && "react-refresh/babel"].filter(Boolean),
          },
        },
      },
      {
        test: /\.(png|jpe?g|git|webp|svg)$/,
        type: "asset",
        parser: {
          dataUrlCondition: { maxSize: 10 * 1024 },
        },
        generator: {
          filename: "imgs/[hash:10][ext][query]",
        },
      },
      {
        test: /\.(woff2?|ttf)$/,
        type: "asset/resource",
      },
    ],
  },

  resolve: {
    extensions: [".jsx", ".js", ".json"],
  },

  optimization: {
    // 控制是否进行压缩
    minimize: isPrd,
    minimizer: [
      // js 压缩
      new TerserPlugin(),
      // 样式压缩
      new CssMinimizerPlugin(),
    ],

    splitChunks: {
      chunks: "all",
      cacheGroups: {
        // react react-dom react-router-dom
        react: {
          test: /[\\/]node_modules[\\/]react(.*)?[\\/]/,
          name: "chunk-react",
          priority: 10,
        },
        // antd-design
        antd: {
          test: /[\\/]node_modules[\\/]antd(.*)?[\\/]/,
          name: "chunk-antd",
          priority: 9,
        },
        // 剩下的 node_modules
        libs: {
          test: /[\\/]node_modules[\\/]/,
          name: "chunk-libs",
          priority: 8,
        },
      },
    },

    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}.js`,
    },
  },

  plugins: [
    // 生产环境:复制静态资源
    isPrd &&
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "../public"),
            to: path.resolve(__dirname, "../dist"),
            globOptions: { ignore: ["**/index.html"] }, // 忽略 indx.html
          },
        ],
      }),

    // 生产环境:css 压缩
    isPrd &&
      new MiniCssExtractPlugin({
        filename: "css/[name].[hash:5].css",
        chunkFilename: "css/chunk.[name].[hash:5].css",
      }),

    // 开发环境:react 组件热更新的配置
    isDev && new ReactRefreshWebpackPlugin(),

    new EslintPlugin({
      context: path.resolve(__dirname, "../src"),
      cache: true,
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/eslintcache"
      ),
    }),

    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
    }),
  ].filter(Boolean),

  devServer: {
    host: "localhost",
    port: 3001,
    open: true,
    hot: true,
    // 解决前端 history 路由 404 问题
    historyApiFallback: true,
  },

  // 关闭性能分析, 提高打包速度
  performance: false,
};

module.exports = config;
