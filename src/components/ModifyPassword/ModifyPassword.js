import React, { Component } from 'react';
//import { BrowserRouter as Router, Link } from 'react-router-dom'
import { Form, Input, Button, Modal, Row, Col, Divider } from 'antd';
import BasicLayoutForStu from '../BasicLayoutForStu/BasicLayoutForStu'

import './ModifyPassword.css'

class PasswordModify extends Component{
    constructor(props){
        super(props)
        this.state = {
            formLayout: 'horizontal',
            visible: false,
            oldPass:'',
            newPass:''
        }
    }
    handleOldPassInput = (event) => {
        this.setState({
            oldPass: event.target.value
        })
    }
    handleNewPassInput = (event) => {
        this.setState({
            newPass: event.target.value
        })
    }
    handleModify = () => {
        if(this.state.newPass && this.state.oldPass){
            this.setState({
                visible: true
            })
        }
    }
    handleOk = () => {
        this.setState({
          visible: false
        })
        /** 此处还需添加将旧密码改为新密码事件操作 */
    }
    handleCancel = () => {
        this.setState({
            visible: false
        })
    }
    handleReset = () => {
        this.setState({
            oldPass:'',
            newPass:''
        })
    }

    render(){
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 15 }
          }

        const { formLayout } = this.state
        const { type } = this.props
        return (
            <BasicLayoutForStu>
                <div className='modify_form'>
                    <Form layout={formLayout} style={{width:'30vw'}}>
                        <div className='title'>修 改 密 码</div>
                        <Divider/>
                        <Form.Item 
                            label={type==='student' ? '学 号' : '职工号'} 
                            {...formItemLayout}
                        >
                            <Input 
                                disabled 
                                placeholder="2016220104023" 
                            />
                        </Form.Item>
                        <Form.Item label="姓 名" {...formItemLayout}>
                            <Input disabled placeholder="龚言福" /> 
                        </Form.Item>
                        <Form.Item 
                            label="旧密码" 
                            {...formItemLayout}  
                        >
                            <Input 
                                value={this.state.oldPass}
                                placeholder="请输入旧密码" 
                                onChange={this.handleOldPassInput.bind(this)}
                            />
                        </Form.Item>
                        <Form.Item label="新密码" {...formItemLayout}>
                            <Input 
                                value={this.state.newPass}
                                placeholder="请输入新密码" 
                                onChange={this.handleNewPassInput.bind(this)}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Row style={{marginLeft:'5vw'}}>
                                <Col span={4}>
                                    <Button type="primary" onClick={this.handleModify.bind(this)}>修 改</Button>
                                    <Modal
                                        title="修改密码"
                                        visible={this.state.visible}
                                        onOk={this.handleOk}
                                        onCancel={this.handleCancel}
                                        okText='确定'
                                        cancelText='取消'
                                    >
                                        <p>确定修改密码为新密码？</p>
                                        <p>修改后请记住新密码！</p>
                                    </Modal>
                                </Col>
                                <Col span={4} offset={4}>
                                    <Button type='default' onClick={this.handleReset.bind(this)}>重 置</Button>
                                </Col>
                            </Row>
                        </Form.Item>
                    </Form>
                </div>
            </BasicLayoutForStu>
        )
    }
}

export default PasswordModify