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
          <header className="sticky top-0 bg-primary-600 flex justify-between items-center px-2 py-1">
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
          <div id="content" className="bg-white text-center text-[#0d2748]">
            <h1 className="text-3xl font-semibold mt-11 mb-3">
              Select a category
            </h1>
            <div className="flex w-[60rem] max-w-full px-4 mx-auto flex-wrap justify-center gap-5 my-8">
              <a href="/" className="block w-[16rem] h-[18rem] px-3 py-3 shadow-lg border-slate-200 border-[5px] flex-shrink-0">
                <div className="w-full h-[13.5rem] bg-slate-300 rounded"></div>
                <h2 className="font-semibold mt-2 text-2xl">Poses</h2>
              </a>
              <a href="/" className="w-[16rem] h-[18rem] px-3 py-3 shadow-lg border-slate-200 border-[5px] flex-shrink-0">
                <div className="w-full h-[13.5rem] bg-slate-300 rounded"></div>
                <h2 className="font-semibold mt-2 text-2xl">Faces</h2>
              </a>
              <a href="/" className="w-[16rem] h-[18rem] px-3 py-3 shadow-lg border-slate-200 border-[5px] flex-shrink-0">
                <div className="w-full h-[13.5rem] bg-slate-300 rounded"></div>
                <h2 className="font-semibold mt-2 text-2xl">Animals</h2>
              </a>
              <a href="/" className="w-[16rem] h-[18rem] px-3 py-3 shadow-lg border-slate-200 border-[5px] flex-shrink-0">
                <div className="w-full h-[13.5rem] bg-slate-300 rounded"></div>
                <h2 className="font-semibold mt-2 text-2xl">Hands</h2>
              </a>
              <a href="/" className="w-[16rem] h-[18rem] px-3 py-3 shadow-lg border-slate-200 border-[5px] flex-shrink-0">
                <div className="w-full h-[13.5rem] bg-slate-300 rounded"></div>
                <h2 className="font-semibold mt-2 text-2xl">Plants</h2>
              </a>
            </div>
          </div>
          <div className="flex flex-col sticky bottom-0">
            <div className="h-20 bg-gradient-to-b from-transparent to-white sm:hidden"></div>
            <footer className="bg-primary-600 flex gap-1 justify-center items-center px-2 pt-1 pb-1.5 text-white border-t-[5px] border-t-secondary-200">
              DrawRef &middot; <a href="https://github.com/DanielOaks" className="text-[#d2ebf4]">Source Code</a>
            </footer>
          </div>
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
