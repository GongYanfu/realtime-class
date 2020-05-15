import React, { Component } from 'react'
import { Layout, Tabs } from 'antd'
import LoginForm from '../../components/LoginForm/LoginForm'
import BasicFooter from '../../components/BasicFooter/BasicFooter'
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

    /* render(){
        return (
            <div style={{width:'100vw',height:"100vh",backgroundColor:'rgba(0, 0, 0, 0.05)'}}>
                <ul className="bubble-bgwall">
                    <li>命题</li>
                    <li>二元关系</li>
                    <li>集合</li>
                    <li>约束变元</li>
                    <li>自由变元</li>
                    <li>笛卡尔积</li>
                    <li>范式</li>
                    <li>等价类</li>
                    <li>有向图</li>
                    <li>无向图</li>
                    <Layout className='login-body'>
                        <Content className='login-content'>
                            <div className="flex-ct-x" style={{width:'20vw',position:'absolute', left:'25%',top:'20%'}}>
                                <div className="auto-typing">欢 迎 使 用 作 业 管 理 系 统 ! !</div>
                            </div>
                            <div className='middle-center'>
                                <Tabs defaultActiveKey="1" onChange={this.TabChange} style={{width:'250px'}}>
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
                            <BasicFooter></BasicFooter>
                        </Footer>
                </Layout>
                </ul>
            </div>
        )
    } */
    render(){
        return (
            <Layout className='login-body'>
                <Content className='login-content'>
                    {/* <div className="flex-ct-x" style={{width:'20vw',position:'absolute', left:'31%',top:'20%'}}>
                        <div className="auto-typing">欢 迎 使 用 作 业 管 理 系 统 ! ! !</div>
                    </div> */}
                    <div className='middle-center'>
                        <Tabs defaultActiveKey="1" onChange={this.TabChange} style={{width:'250px'}}>
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
                    <BasicFooter></BasicFooter>
                </Footer>
            </Layout>
        )
    }
}

export default Login
