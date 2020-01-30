import React, { Component, Fragment } from 'react';
import {Route, Switch} from 'react-router-dom'
import Login from '../components/login/Login';
import ForgotPassword from '../components/login/ForgotPassword';
import ChangePassword from '../components/login/changePassword';
import ProtectedRoute from '../components/login/auth/ProtectedRoute';
import Bodegas from '../components/Admon/Bodegas/Bodegas';
import Home from '../components/home';
import Clientes from '../components/Admon/Clientes/Clientes';
import ListaPrecios from '../components/Admon/ListaPrecios/ListaPrecios';
import Productos from '../components/Admon/Productos/Productos';
import FacturasEnviadas from '../components/Admon/Facturas/FacturasEnviadas';
import Registrarse from '../components/login/Registrarse'
import NotFound from './NotFound';
import { withAuthenticator } from 'aws-amplify-react';

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact  path="/bodegas" component={withAuthenticator(ProtectedRoute(Bodegas),false,[<Login />])} />
        <Route exact  path="/productos" component={withAuthenticator(ProtectedRoute(Productos),false,[<Login />])} />
        <Route exact path="/"  component={Login}/>
        <Route exact path="/registrarse"  component={withAuthenticator(ProtectedRoute(Registrarse),false,[<Login />])}/>
        <Route exact path="/home"  component={withAuthenticator(ProtectedRoute(Home),false,[<Login />])}/>
        <Route exact path="/clientes"  component={withAuthenticator(ProtectedRoute(Clientes),false,[<Login />])}/>
        <Route exact path="/lista_precios"  component={withAuthenticator(ProtectedRoute(ListaPrecios),false,[<Login />])}/>
        <Route exact path="/recordar_password"  component={ForgotPassword}/>
        <Route exact path="/cambiar_password"  component={withAuthenticator(ProtectedRoute(ChangePassword),false,[<Login/>])}/>
        <Route exact path="/facturas"  component={withAuthenticator(ProtectedRoute(FacturasEnviadas),false,[<Login/>])}/>
        <Route component={NotFound} />
      </Switch>
    );
  }
}
export default App;
