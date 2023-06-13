module.exports = {
  // 继承 react 官方
  extends: ["react-app"],
  parserOptions: {
    babelOptions: {
      // 解决一些页面报错
      presets: [
        ["babel-preset-react-app", false],
        "babel-preset-react-app/prod",
      ],
    },
  },
};
