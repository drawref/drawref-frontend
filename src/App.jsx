import logo from './logo-light.svg';

import { createTheme, ThemeProvider } from "@rneui/themed";
import Icon from '@mdi/react';
import { mdiLoginVariant } from '@mdi/js';

const theme = createTheme({
  lightColors: {
    primary: '#4788d5',
  },
  darkColors: {
    primary: '#000',
  },
  mode: 'light',
});

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <div className="App">
          <header className="bg-[#4788d5] flex justify-between items-center px-2 py-1">
            <a href="/login" className="px-2 py-2 text-white invisible sm:hidden">
              <Icon path={mdiLoginVariant}
                title="Login"
                size={1.1}
                className="text-white"
              />
            </a>
            <a href="/" className="block px-3 py-1.5"><img src={logo} alt="DrawRef logo" /></a>
            <div className="flex">
              <a href="/login" className="mx-5 my-2 text-white text-lg hidden sm:block">Login</a>
              <a href="/login" className="px-2 py-2 text-white sm:hidden">
                <Icon path={mdiLoginVariant}
                  title="Login"
                  size={1.1}
                  className="text-white"
                />
              </a>
            </div>
          </header>
          <div id="content" className="text-center text-[#0d2748]">
            <h1 className="text-3xl font-semibold mt-8 mb-3">
              Select a category
            </h1>
          </div>
          <footer className="bg-[#4788d5] flex gap-1 justify-center items-center px-2 py-1 text-white border-t-[5px] border-t-[#fac2d6]">
            DrawRef &middot; <a href="https://github.com/DanielOaks" className="text-[#d2ebf4]">Source Code</a>
          </footer>
        </div>
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
    </>
  );
}

export default App;
