import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import LabelTitulos from '../../components/layout/labelTitulos';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SaldoIcon from '@material-ui/icons/MonetizationOn';
import SalirIcon from '@material-ui/icons/ExitToApp';
import ConfiguracionIcon from '@material-ui/icons/Settings';
import Badge from '@material-ui/core/Badge';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { Link } from 'react-router-dom';
import vVysorshop from '../../static/images/vVysorshop.png';
import { SignOutGlobal } from '../login/auth/amplifyAuth';
import { Redirect } from 'react-router';
import ConfirmacionModal from '../../components/modals/confirmacionModal';
import { SetConfirmacionModalState, Logout, SetUserAttributes, SetUserGroup, SetSpinnerModal } from '../../reducers/actions/utilsActions';
import { connect } from 'react-redux';
import { GetUserData, RetrieveCurrentSessionRefreshToken } from '../login/auth/amplifyAuth';
import '../login/styles.css';
import SpinnerModal from '../modals/spinnerModal';
import MenuUser from './Menus/Menu';
import MenuAdmon from './Menus/MenuAdmon';

const drawerWidth = 240;

const styles = theme => ({
  root: {
  },
  grow: {
    flexGrow: 1,
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),

  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing.unit * 7 + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9 + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing.unit * 1,
    },
  },
  contentDrawer: {
    flexGrow: 1,
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing.unit * 1,
    },
    boxShadow: 'inset 3px 0 3px 0 #128BCC',
    backgroundColor: 'rgb(108,117,125,0.1)'
  },
  containerLogos: {
    flex: 1,
    display: 'inline-flex',
    [theme.breakpoints.down('sm')]: {
      display: 'inline',
    },
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'nowrap',
    maxHeight: '2em'
  },
  rootLogo: {
    display: 'inline',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
    maxHeight: 'inherit',
  },
  logo: {
    maxHeight: 'inherit',
  },
  logoPortal: {
    maxHeight: 'inherit',
    backgroundColor: '#f2f2f2',
    borderRadius: '50%',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  saldo: {
    backgroundColor: '#111',
  },
});

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      anchorEl: null,
      mobileMoreAnchorEl: null,
      right: false,
      redirect: false,
      resultExpiracion: false,
    };
    this.handleMenuCloseLoguot = this.handleMenuCloseLoguot.bind(this);
  }

  componentWillMount() {
    var fechaActual = new Date().getTime();
    fechaActual = fechaActual.toString().substring(0, 10);
    this.setState({ resultExpiracion: this.validarSesion(fechaActual) }, () => {
      if (this.state.resultExpiracion === undefined) return;
      if (this.state.resultExpiracion == true) {
        RetrieveCurrentSessionRefreshToken().then(() => {
          GetUserData().then(result => {
            let nuevaHoraExpiracion = parseFloat(fechaActual) + 36000;
            localStorage["fechaActual"] = nuevaHoraExpiracion;
            let identificacionEmpleado = { "identificacionEmpleado": result.attributes["custom:userid"] }
            this.props.setUserAttributes({ ...result.attributes });
            this.props.setUserGroup([result.signInUserSession.accessToken.payload["cognito:groups"]]);
          })
        })
      } else {
        if (this.state.resultExpiracion == false) {
          this.handleMenuCloseLoguot();
        }
      }
    })
  }

  validarSesion = (fechaActual) => {
    let resultado = "";
    let fechaExpiracionToken = localStorage.getItem("fechaActual");
    if (fechaExpiracionToken < fechaActual) {
      alert("Su sesión ha expirado. Por favor inicie sesión nuevamente");
      resultado = false;
      this.handleMenuCloseLoguot();
    } else {
      resultado = true;
    }
    return resultado;
  }

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleProfileMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
    this.handleMobileMenuClose();
  };

  handleMobileMenuOpen = event => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };

  handleMenuCloseLoguot = () => {
    SignOutGlobal().then(() => {
      this.setState({ redirect: true }, () => {
        localStorage.removeItem("fechaActual");
        this.props.logout();
      })
    })
  }

  handleClickConfirmarLogout = () => {
    let modal = { open: true, text: '¿Seguro que desea cerrar sesión?', onClick: this.handleMenuCloseLoguot }
    this.props.setConfirmacionModalState(modal);
  }

  render() {
    const { classes, theme, children, userAttributes, userGrupo } = this.props;
    const { anchorEl, mobileMoreAnchorEl, redirect } = this.state;
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    if (redirect) return <Redirect to={{ pathname: '/' }} />

    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <Link style={{ textDecoration: 'none' }} to={{
          pathname: '/cambiar_password',
        }}>
          <MenuItem onClick={this.handleMenuClose}>Cambiar contraseña</MenuItem>
        </Link>

        <MenuItem onClick={this.handleClickConfirmarLogout}>Cerrar sesión</MenuItem>
      </Menu>
    );

    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMobileMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem style={{display:'none'}} onClick={this.toggleDrawer('right', true)}>
          <IconButton color="inherit">
            <Badge badgeContent={userAttributes.saldoEmisor} color="secondary">
              <SaldoIcon />
            </Badge>
          </IconButton>
          <p>Mi saldo</p>
        </MenuItem>
        <MenuItem onClick={this.handleProfileMenuOpen}>
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
          <p>Mi cuenta</p>
        </MenuItem>
      </Menu>
    );

    let listaMenu = null
    if (userGrupo[0] == "Administrador") {
      listaMenu = (
        <MenuAdmon/>
      )
    } else {
      listaMenu = (
        <MenuUser/>
      )
    }

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={classNames(classes.appBar, {
            [classes.appBarShift]: this.state.open,
          })}
        >
          <Toolbar disableGutters={!this.state.open}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(classes.menuButton, {
                [classes.hide]: this.state.open,
              })}
            >
              <MenuIcon />
            </IconButton>
            <Link style={{ textDecoration: 'none' }} to={{
              pathname: '/home',
            }}>
              <div container="true" className={classes.containerLogos}>
                <div item="true" xs={6} className={classes.rootLogo}>
                  <img className={classes.logoPortal} alt="client" src={vVysorshop} />
                </div></div></Link>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>

              <MenuItem style={{ color: 'white' }}>{userAttributes.nombresEmisor}</MenuItem>
              <IconButton style={{display:'none'}} onClick={this.toggleDrawer('right', true)} color="inherit">
                <Badge>
                  <SaldoIcon />
                </Badge>
              </IconButton>
              <IconButton
                aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                aria-haspopup="true"
                onClick={this.handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </div>
            <div className={classes.sectionMobile}>
              <IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen} color="inherit">
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
          {renderMenu}
          {renderMobileMenu}
        </AppBar>
        <Drawer
          onClose={this.handleDrawerClose}
          className={classNames(classes.drawer, {
            [classes.drawerOpen]: this.state.open,
            [classes.drawerClose]: !this.state.open,
          })}
          classes={{
            paper: classNames({
              [classes.drawerOpen]: this.state.open,
              [classes.drawerClose]: !this.state.open,
            }),
          }}
          open={this.state.open}
        >
          <div className={classes.toolbar}><MenuItem style={{ fontSize: '10px' }}>{userAttributes["custom:username"]}</MenuItem>
            <IconButton onClick={this.handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </div>
          <Divider />
          <List>
            {listaMenu}
          </List>
          <Divider />
          <List>
            {['Cerrar sesión'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon><SalirIcon onClick={this.handleClickConfirmarLogout} /></ListItemIcon>
                <ListItemText  onClick={index % 2 === 0 ? null : this.handleClickConfirmarLogout} primary={text} />
              </ListItem>
            ))}
          </List>
        </Drawer>

        <Drawer anchor="right" open={this.state.right} onClose={this.toggleDrawer('right', false)}>
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer('right', false)}
            onKeyDown={this.toggleDrawer('right', false)}
            className={classes.contentDrawer}
          >
            <div className={classes.toolbar} />

            <ol>
              <li className={classes.saldo}><LabelTitulos texto={`Resumen ventas día`} className="form-control" /></li>

            </ol>

          </div>
        </Drawer>
        <ConfirmacionModal />
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {children}
        </main>
        <SpinnerModal />
      </div>
    );
  }
}

Layout.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

function mapStateToProps(state, props) {
  return {
    userAttributes: state.utilsStore.userAttributes,
    userGrupo: state.utilsStore.userGrupo,
    fechaExpiracionToken: state.utilsStore.fechaExpiracionToken
  }
}

const mapDispatchToProps = (dispatch) => ({
  setSpinnerModal: (item) => dispatch(SetSpinnerModal(item)),
  setConfirmacionModalState: (item) => dispatch(SetConfirmacionModalState(item)),
  logout: (item) => dispatch(Logout(item)),
  setUserAttributes: (item) => dispatch(SetUserAttributes(item)),
  setUserGroup: (item) => dispatch(SetUserGroup(item)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(Layout));
