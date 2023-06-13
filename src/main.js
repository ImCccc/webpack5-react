/*
  yarn add react react-dom -S
  yarn add react-router-dom -S
*/
import "antd/dist/antd";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
