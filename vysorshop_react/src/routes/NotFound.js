import React, { Component, Fragment } from 'react';
import Layout from '../components/layout/Layout';

export default class Factura extends Component{
    render(){
        return(
            <Layout>
                <Fragment><h1 style={{color:'gray', textAlign:'center'}}>404 - Not Found</h1><br/><h4>No hemos encontrado la página</h4></Fragment>
            </Layout>
        )
    }
}