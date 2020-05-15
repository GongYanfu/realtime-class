import React, { Component } from 'react'
import { Form, Icon, Input, Button, message } from 'antd'
import { setItem, KEYS } from '../../utils/localStorage'
import axios from 'axios'
import './LoginForm.css'

const FormItem = Form.Item

class LoginForm1 extends Component {
    constructor(props){
        super(props)
        this.state = {
            account: '',
            password: '',
            tabKey:'',
            uploading: false
        }
    }

    componentWillUnmount = () => {
        this.setState = (state, callback) => {
            return
        }
    }

    handleSubmit = async(e) => {
        e.preventDefault();
        this.setState({
            uploading: true
        })
        const { account, password } = this.state
        const {history, tabKey} = this.props
        if(account && password){
            if(tabKey === '1'){
                const res = await axios({
                    method:'get',
                    url:'http://118.24.233.16:8080/homeworkManager/login',
                    params:{
                        username: account,
                        password: password,
                        type: 'student'
                    }
                })
                if(res && res.status===200){
                    if(res.data.userId){
                        message.info('登录成功！！！',2)
                        setItem(KEYS.KEY_CUR_USERINFO,JSON.stringify(res.data))
                        setTimeout(() => {
                            history.push('/home')
                            this.setState({
                                uploading: false
                            })
                        },1500)
                    }
                    else{
                        message.error('账号或密码错误！！！',2)
                        setTimeout(() => {
                            this.setState({
                                uploading: false
                            })
                        },1500)
                    }
                }
                else{
                    message.error('请求登录失败！！！',2)
                    setTimeout(() => {
                        this.setState({
                            uploading: false
                        })
                    },1500)
                }
            }
            if(tabKey === '2'){
                const res = await axios({
                    method:'get',
                    url:'http://118.24.233.16:8080/homeworkManager/login',
                    params:{
                        username: account,
                        password: password,
                        type: 'teacher'
                    }
                })
                if(res && res.status===200){
                    if(res.data.userId){
                        message.info('登录成功！！！',1)
                        setItem(KEYS.KEY_CUR_USERINFO,JSON.stringify(res.data))
                        setTimeout(() => {
                            history.push('/home')
                            this.setState({
                                uploading: false
                            })
                        },1500)
                    }
                    else{
                        message.error('账号或密码错误！！！',2)
                        setTimeout(() => {
                            this.setState({
                                uploading: false
                            })
                        },1500)
                    }
                }
                else{
                    message.error('请求登录失败！！！',2)
                    setTimeout(() => {
                        this.setState({
                            uploading: false
                        })
                    },1500)
                }
            }
        }
        else{
            message.error('账号或者密码未输入！！！',2)
            this.setState({
                uploading: false
            })
        }
    }

    handleTelInput = (e) => {
        this.setState({
            account: e.target.value
        })
    }

    handlePassWordInput = (e) => {
        this.setState({
            password: e.target.value
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { uploading } = this.state
        return (
            <Form onSubmit={this.handleSubmit} className='login-form'>
                <FormItem>
                    {getFieldDecorator('account',{
                        rules:[{
                            required: true,
                            message:'请输入用户名!'
                        }]
                    })(
                        <Input
                            prefix={<Icon type='user' style={{color:'black'}} />}
                            placeholder='请输入用户名'
                            onChange={this.handleTelInput}
                            style={{fontSize:'16px'}}
                        />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password',{
                        rules:[{
                            required: true,
                            message:'请输入密码'
                        }]
                    })(
                        <Input
                            prefix={<Icon type='lock' style={{color:'black'}} />}
                            type='password'
                            placeholder='请输入密码'
                            onChange={this.handlePassWordInput}
                            style={{fontSize:'16px'}}
                        />
                    )}
                </FormItem>
                <FormItem>
                    <Button
                        type='primary'
                        htmlType='submit'
                        className='login-form-button'
                        loading={uploading}
                    >
                        {
                            uploading ? '登录中...' : '登 录'
                        }
                    </Button>
                </FormItem>
            </Form>
        )
    }
}

const LoginForm = Form.create({name:'normal-login'})(LoginForm1)
export default LoginForm