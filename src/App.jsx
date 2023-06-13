import React, { Suspense, lazy } from "react";
import { HashRouter, Link, Route, Routes } from "react-router-dom";

import { ConfigProvider } from "antd";

const About = lazy(() => import(/*webpackChunkName: "about"*/ "./pages/About"));
const Home = lazy(() => import(/*webpackChunkName: "home"*/ "./pages/Home"));

const App = () => {
  return (
    <HashRouter>
      <ConfigProvider theme={{ token: { colorPrimary: "red" } }}>
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
      </ConfigProvider>
    </HashRouter>
  );
};

export default App;
