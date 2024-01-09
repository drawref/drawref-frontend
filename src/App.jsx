import logo from './logo-light.svg';

import { Button, createTheme, ThemeProvider } from "@rneui/themed";

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
            <img src={logo} className="mx-3 my-1.5" alt="DrawRef logo" />
            <span className="mx-5 my-2 text-white text-lg">Login</span>
          </header>
          <br/><br/><br/><br/>
          <Button title="I'm a button from React Native Elements" />
          <h1 className="text-3xl font-bold">
            Hello world!
          </h1>
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
