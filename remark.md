## 集成 react

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

### js 压缩配置

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

### eslint 配置

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

### babel 配置

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

### react 组件热更新

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
