import React, { Component } from 'react';
import './App.css';
import Routes from '../src/routes/Routes';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from '../src/utils/theme';
import Footer from './components/layout/footer';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Routes />
        <Footer />
      </MuiThemeProvider>
    );
  }
}

export default App;
