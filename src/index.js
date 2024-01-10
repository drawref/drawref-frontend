import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import { createTheme, ThemeProvider } from "@rneui/themed";

import './index.css';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/500.css';
import '@fontsource/open-sans/600.css';

import Landing from './routes/Landing';
import Login from './routes/Login';
import NotFound from './routes/NotFound';

const theme = createTheme({
  lightColors: {
    primary: '#4788d5',
  },
  darkColors: {
    primary: '#000',
  },
  mode: 'light',
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>

    <style type="text/css">{`
      @font-face {
        font-family: 'MaterialIcons';
        src: url(${require('react-native-vector-icons/Fonts/MaterialIcons.ttf')}) format('truetype');
      }

      @font-face {
        font-family: 'FontAwesome';
        src: url(${require('react-native-vector-icons/Fonts/FontAwesome.ttf')}) format('truetype');
      }
    `}</style>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
