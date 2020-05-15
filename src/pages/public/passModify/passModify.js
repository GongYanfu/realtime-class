import React, { Component, Fragment } from 'react'
import {
    Form,
    Input,
    Button,
    Popconfirm,
    Icon,
    message
}   from 'antd'
import axios from 'axios'
import { getItem, KEYS } from '../../../utils/localStorage'
import BasicLayoutForStu from '../../../components/BasicLayoutForStu/BasicLayoutForStu'
import BasicLayoutForTea from '../../../components/BasicLayoutForTea/BasicLayoutForTea'

const FormItem = Form.Item

class PassModify extends Component {
    constructor(props){
        super(props)
        this.state = {
            oldPassword:'',
            newPassword:'',
            userInfo:{},
            uploading:false
        }
    }

    componentDidMount = () => {
        this.loadData()
    }
    loadData = () => {
        const userInfo = JSON.parse(getItem(KEYS.KEY_CUR_USERINFO))
        if(userInfo){
            this.setState({
                userInfo
            })
        }
    }

    handleNewPasswordInput = (e) => {
        const { value } = e.target
        this.setState({
            newPassword: value
        })
    }
    handleOldPasswordInput = (e) => {
        const { value } = e.target
        this.setState({
            oldPassword: value
        })
    }
    handleReset = () => {
        window.location.reload()
    }

    handleConfirm = async() => {
        const { userInfo, oldPassword, newPassword } = this.state
        const { userSchoolNumber } = userInfo
        if(userSchoolNumber && oldPassword && newPassword){
            if(newPassword === oldPassword){
                message.warn('您输入的新旧密码一样！！！修改失败！！！',2)
            }
            else{
                this.setState({
                    uploading: true
                })
                const res = await axios({
                    url:'http://118.24.233.16:8080/homeworkManager/changePassword',
                    method:'get',
                    params:{
                        username: userSchoolNumber,
                        password: oldPassword,
                        newPassword: newPassword
                    }
                })
                if(res && res.status===200){
                    const { msg, code, data } = res.data
                    if(msg==='ok' && code===200 && data==='change success'){
                        message.info('修改密码成功！！！',1)
                        this.setState({
                            uploading: false,
                        })
                    }
                    else{
                        this.setState({
                            uploading: false
                        })
                        message.warn('旧密码输入有误！！！',2)
                    }
                }
                else{
                    message.error("请求修改密码接口失败！！！",2)
                }
            }
        }
        else{
            message.warn('请先输入新/旧密码！！！',2)
        }
    }

    render(){
        const { userInfo, oldPassword, newPassword, uploading } = this.state
        const FormItemLayout =  {
            labelCol: { span: 1 },
            wrapperCol: { span: 4}
        }
        const ButtonItemLayout = {
            wrapperCol: { 
                span: 6, 
                offset: 1
            }
        }
        return (
            <Fragment>
                {
                    userInfo.userType === 'student'
                    ?   <BasicLayoutForStu title='密码修改' describe='本页用于用户修改密码'>
                            <Form
                                layout='horizontal'
                            >
                                <FormItem label="学 号" {...FormItemLayout}>
                                    <Input 
                                        value={userInfo.userSchoolNumber} 
                                        disabled
                                    />
                                </FormItem>
                                <FormItem label="姓 名" {...FormItemLayout}>
                                    <Input 
                                        value={userInfo.userName} 
                                        disabled
                                    />
                                </FormItem>
                                <FormItem label="旧密码" {...FormItemLayout}>
                                    <Input.Password 
                                        placeholder="请输入旧密码" 
                                        value={oldPassword}
                                        onChange={this.handleOldPasswordInput}
                                    />
                                </FormItem>
                                <FormItem label="新密码" {...FormItemLayout}>
                                    <Input.Password
                                        placeholder="请输入新密码" 
                                        value={newPassword}
                                        onChange={this.handleNewPasswordInput}
                                    />
                                </FormItem>
                                <FormItem {...ButtonItemLayout}>
                                    <Button.Group>
                                        <Button 
                                            type='danger'
                                            onClick={this.handleReset}
                                        >
                                            <Icon type='delete' />
                                            重置
                                        </Button>
                                        <Popconfirm
                                            title="确定修改密码？"
                                            icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                                            onConfirm={this.handleConfirm}
                                            okText='确定'
                                            cancelText='取消'
                                        >
                                            <Button 
                                                type="primary"
                                                loading={uploading}
                                            >
                                                <Icon type='upload' />
                                                修改
                                            </Button>
                                        </Popconfirm>
                                    </Button.Group>
                                </FormItem>
                            </Form>
                        </BasicLayoutForStu>
                    :   <BasicLayoutForTea title='密码修改' describe='本页用于用户修改密码'>
                            <Form
                                layout='vertical'
                            >
                                <FormItem label="教职号" {...FormItemLayout}>
                                    <Input 
                                        value={userInfo.userSchoolNumber} 
                                        disabled
                                    />
                                </FormItem>
                                <FormItem label="姓 名" {...FormItemLayout}>
                                    <Input 
                                        value={userInfo.userName} 
                                        disabled
                                    />
                                </FormItem>
                                <FormItem label="旧密码" {...FormItemLayout}>
                                    <Input.Password 
                                        placeholder="请输入旧密码" 
                                        onChange={this.handleOldPasswordInput}
                                    />
                                </FormItem>
                                <FormItem label="新密码" {...FormItemLayout}>
                                    <Input.Password 
                                        placeholder="请输入新密码" 
                                        onChange={this.handleNewPasswordInput}
                                    />
                                </FormItem>
                                <FormItem {...ButtonItemLayout}>
                                    <div style={{display:'flex'}}>
                                        <Button 
                                            type='ghost'
                                            size='small'
                                            style={{marginRight:'20px'}}
                                            onClick={this.handleReset}
                                        >
                                            重置
                                        </Button>
                                        <Popconfirm
                                            title="确定修改密码？"
                                            icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                                            onConfirm={this.handleConfirm}
                                            okText='确定'
                                            cancelText='取消'
                                        >
                                            <Button 
                                                type="primary"
                                                size='small'
                                                loading={uploading}
                                            >
                                                修改
                                            </Button>
                                        </Popconfirm>
                                    </div>
                                </FormItem>
                            </Form>
                        </BasicLayoutForTea>
                }
            </Fragment>
        )
    }
}

export default PassModify