import React, { Component } from 'react'
import { Layout, Tabs } from 'antd'

import LoginForm from '../../../components/LoginForm/LoginForm'
import BasicFooter from '../../../components/BasicFooter/BasicFooter'
import './login.scss'

const { Footer, Content } = Layout
const { TabPane } = Tabs

class Login extends Component {
    constructor(props){
        super(props)
        this.state={
            tel: '',
            password: '',
            tabKey:'1'
        }
    }

    TabChange = (key)=> {
        this.setState({
            tabKey:key
        })
    }

    render(){
        return (
            <Layout style={{
                minWidth:'350px'
            }}>
                <Content className='login-content'>
                    <div className='middle-center'>
                        <Tabs 
                            defaultActiveKey="1" 
                            onChange={this.TabChange} 
                            style={{width:'16rem'}}
                        >
                            <TabPane 
                                tab="学生登录" 
                                key="1" 
                            >
                                <LoginForm 
                                    history={this.props.history}
                                    tabKey={this.state.tabKey}
                                />
                            </TabPane>
                            <TabPane 
                                tab="教师登录" 
                                key="2" 
                            >
                                <LoginForm 
                                    history={this.props.history}
                                    tabKey={this.state.tabKey}
                                />
                            </TabPane>
                        </Tabs>
                    </div>
                </Content>
                <Footer  >
                    <BasicFooter/>
                </Footer>
            </Layout>
        )
    }
}

export default Login
