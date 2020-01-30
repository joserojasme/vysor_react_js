import React, {Component} from 'react'
import Layout from '../../layout/Layout';

 export default (WrappedComponent) => class AuthRoute extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isAutenticate: false,
            props: {}
        }
    }

    render(){
        const {isAutenticate, props} = this.state;
        return isAutenticate ? <Layout> <WrappedComponent {...props}/></Layout> : <Layout><WrappedComponent {...props}/></Layout>
    }
}

