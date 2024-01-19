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

import AuthenticatedRoot from "./routes/AuthenticatedRoot";
import AdminRoot from "./routes/AdminRoot";
import Landing from "./routes/Landing";
import AdminDashboard from "./routes/AdminDashboard";
import AdminCreateCategory from "./routes/AdminCreateCategory";
import UserDashboard from "./routes/UserDashboard";
import DashboardLinks from "./routes/DashboardLinks";
import SessionSelection, { loader as sessionSelectionLoader } from "./routes/SessionSelection";
import Session from "./routes/Session";
import Login from "./routes/Login";
import LoginSuccess from "./routes/LoginSuccess";
import NotFound from "./routes/NotFound";

const router = createBrowserRouter([
  {
    element: <AuthenticatedRoot />,
    children: [
      {
        path: "/dashboards",
        element: <DashboardLinks />,
      },
      {
        path: "/dashboard",
        element: <UserDashboard />,
      },
    ],
  },
  {
    element: <AdminRoot />,
    children: [
      {
        path: "/admin",
        element: <AdminDashboard />,
      },
      {
        path: "/admin/create-category",
        element: <AdminCreateCategory />,
      },
    ],
  },
  {
    path: "/",
    element: <Landing />,
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
    path: "/login",
    element: <Login />,
  },
  {
    path: "/login/success",
    element: <LoginSuccess />,
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
