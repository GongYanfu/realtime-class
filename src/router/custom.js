import React, { Component } from 'react'
import { Route, withRouter } from 'react-router-dom'
import { message } from 'antd'  
import { getItem, KEYS } from '../utils/localStorage'

class CustomRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogged: JSON.parse(getItem(KEYS.KEY_CUR_USERINFO)) ? true : false
        }
    }

    componentWillMount = () => {
        if(!this.state.isLogged){
            const {history} = this.props;
            setTimeout(() => {
                history.replace("/");
            }, 1000)
        }
    }

    render() {
        const { component: Component, ...rest} = this.props;
        return (
            this.state.isLogged 
            ? <Route {...rest} render={(props) => ( <Component {...props} /> )} />  
            : message.info('目前您还未登录！！！\n请先登录！！！',2)
        )
    }
}

export default withRouter(CustomRoute);