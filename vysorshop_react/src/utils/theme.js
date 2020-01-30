import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography:{
    fontFamily:'Quicksand', 
    useNextVariants: true,
  },
  palette: {
    primary: {
      light: '#92C63E',
      main: '#128BCC',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#85c638',
      dark: '#ba000d',
      contrastText: '#fff',
    },
  },
  status: {
    danger: 'orange',
  },
});

export default theme;