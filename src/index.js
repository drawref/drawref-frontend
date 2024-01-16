import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";

import { store } from "./app/store";
import { Provider } from "react-redux";

import "./index.css";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/500.css";
import "@fontsource/open-sans/600.css";

import Landing from "./routes/Landing";
import Dashboard from "./routes/Dashboard";
import SessionSelection, { loader as sessionSelectionLoader } from "./routes/SessionSelection";
import Session from "./routes/Session";
import Login from "./routes/Login";
import LoginSuccess from "./routes/LoginSuccess";
import NotFound from "./routes/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/login/success",
    element: <LoginSuccess />,
  },
  {
    path: "/c/:categoryId",
    loader: sessionSelectionLoader,
    element: <SessionSelection />,
  },
  {
    path: "/session",
    element: <Session />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
