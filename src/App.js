import logo from './logo.svg';
import './App.css';

import { Button, createTheme, ThemeProvider } from "@rneui/themed";

const theme = createTheme({});

function App() {
  return (
    <>
      {/* <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div> */}
      
      <ThemeProvider theme={theme}>
        <div className="App">
          <header className="App-header">
            <Button title="I'm a button from React Native Elements" />
          </header>
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
