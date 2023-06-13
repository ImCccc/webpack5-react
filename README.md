# weboack5 集成 react

1. 安装相关包

```
yarn add react react-dom -S
yarn add react-router-dom -S
```

2. 相关代码

```jsx
// main.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);

// App.jsx
import React, { Suspense, lazy } from "react";
import { HashRouter, Link, Route, Routes } from "react-router-dom";
const About = lazy(() => import(/*webpackChunkName: "about"*/ "./pages/About"));
const Home = lazy(() => import(/*webpackChunkName: "home"*/ "./pages/Home"));

const App = () => {
  return (
    <HashRouter>
      <div>
        <Link to="/home">home</Link>
      </div>
      <div>
        <Link to="/about">about</Link>
      </div>
      <Suspense fallback={<div>loading......</div>}>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/about" element={<About />}></Route>
        </Routes>
      </Suspense>
    </HashRouter>
  );
};

export default App;
```

## js 压缩配置

react 打包后的 js 代码不会自动压缩, 需要手动配置

```jsx
const TerserPlugin = require("terser-webpack-plugin");
const isDev = process.env.NODE_ENV === "development";
const config = {
  optimization: {
    minimizer: [!isDev && new TerserPlugin()].filter(Boolean),
  },
};

module.exports = config;
```

## eslint 配置

webpack 配置和之前的没有什么不一样, 不过需要安装 `eslint-config-react-app -D`, 和修改`.eslintrc.js` 配置修

```javascript
/*
  yarn add eslint eslint-webpack-plugin -D
  yarn add eslint-config-react-app -D
*/
const path = require("path");
const EslintPlugin = require("eslint-webpack-plugin");
const config = {
  plugins: [
    new EslintPlugin({
      context: path.resolve(__dirname, "../src"),
      cache: true,
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/eslintcache"
      ),
    }),
  ],
};
module.exports = config;
```

```javascript
// .eslintrc.js
module.exports = {
  extends: ["react-app"],
  parserOptions: {
    babelOptions: {
      presets: [
        ["babel-preset-react-app", false],
        "babel-preset-react-app/prod",
      ],
    },
  },
};
```

## babel 配置

webpack 配置, babel 需要处理 jsx 文件, 需要安装 `babel-preset-react-app` 和修改 `babel.config.js`

```javascript
/*
  yarn add babel-loader @babel/core babel-preset-react-app -D
*/
const config = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            cacheCompression: false,
          },
        },
      },
    ],
  },
};
module.exports = config;
```

```javascript
// babel.config.js
// https://github.com/facebook/create-react-app/blob/main/packages/babel-preset-react-app/create.js
module.exports = {
  presets: ["react-app"],
};
```

## react 组件热更新

只在开发环境使用, 首先需要安装:

```
yarn add @pmmmwh/react-refresh-webpack-plugin react-refresh -D
```

然后配置文件, 如果使用 `babel`, 还要在 `babel-loader` 中添加插件:

```javascript
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const isDev = process.env.NODE_ENV === "development";

const config = {
  plugins: [isDev && new ReactRefreshWebpackPlugin()].filter(Boolean),
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: [isDev && "react-refresh/babel"].filter(Boolean),
          },
        },
      },
    ],
  },
};

module.exports = config;
```

## 集成 antd

1. 安装

```
yarn add antd
```

2. main.js 引入

```js
import "antd/dist/antd";
```

3. 使用

```jsx
import { Button } from "antd";
<Button>测试</Button>;
```

4. 修改主题颜色

antd 5 版本修改起来很简单, 文档 <https://ant.design/docs/react/customize-theme-cn>

```jsx
import { Button, ConfigProvider } from "antd";
const App: React.FC = () => (
  <ConfigProvider theme={{ token: { colorPrimary: "#00b96b" } }}>
    <Button />
  </ConfigProvider>
);
```

antd5,还可以针对某一个组件修改主题:

```jsx
<ConfigProvider theme={{ components: { Radio: { colorPrimary: "#00b96b" } } }}>
  <Radio>Radio</Radio>
  <Checkbox>Checkbox</Checkbox>
</ConfigProvider>
```

## 打包分组

如果页面引入很多第三方包, 例如 react react-dom react-router-dom antd 等等, 那么打包出来的文件就会很大, 这时候可以使用如下方法进行分组:

```javascript
const config = {
  optimization: {
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
  },
};
```

打包后的结果:

```
js/runtime~main.js.1b17003f8c.js
js/chunk-react.8e1ab83a56.js
js/chunk-antd.c9f2dc20ff.js
js/chunk-libs.f170381f60.js
js/main.5967e94206.js
```
