import React, { Component } from 'react'
import { Form, Input, Upload, Modal } from 'antd'
import { TimestampToNormaltime } from '../../../../utils/timeFormat'

const FormItem = Form.Item
const { TextArea } = Input

class CheckForm extends Component {
    constructor(props){
        super(props)
        this.state = {
            classworkId:'',
            courseName:'',
            classworkType:'',
            classworkCourseId:'',
            classworkTitle:'',
            classworkBegintime:'',
            classworkDeadline:'',
            Files1:[],
            Files2:[],
            classworkRemark:'',
            previewImage:'',
            previewVisible: false
        }
    }

    componentDidMount = () => {
        const { record } = this.props
        const { classworkFile } = record
        const { classworkReference } = record
        if(classworkFile){
            const newArray = classworkFile.split('|').filter(item => item!=='')
            if( newArray && newArray.length){
                let newData = []
                newArray.map((item,index) => {
                    const obj = {
                        uid: index,
                        name: `image${index}`,
                        status:'done',
                        url:'http://118.24.233.16:8080'+item
                    }
                    newData = [...newData,obj]
                    if(newData.length === newArray.length){
                        this.setState({
                            Files1: [...newData]
                        })
                    }
                    return null
                })
            }
        } 
        if(classworkReference){
            const newArray = classworkReference.split('|').filter(item => item!=='')
            if( newArray && newArray.length){
                let newData = []
                newArray.map((item,index) => {
                    const obj = {
                        uid: index,
                        name: `image${index}`,
                        status:'done',
                        url:'http://118.24.233.16:8080'+item
                    }
                    newData = [...newData,obj]
                    if(newData.length === newArray.length){
                        this.setState({
                            Files2: [...newData]
                        })
                    }
                    return null
                })
            }
        } 

    }

    handleCancel = () => {
        this.setState({
            previewVisible: false
        })
    }
    handlePreview = (file) => {
        if(file.url){
            this.setState({
                previewImage: file.url,
                previewVisible: true,
            })
        }
    }

    render(){
        const FormItemLayout = {
            labelCol: {
                xs: { span: 8 },
                sm: { span: 5 },
              },
              wrapperCol: {
                xs: { span: 16 },
                sm: { span: 12 },
              }
        }
        const { 
            classworkId, courseName, classworkType, classworkTitle, 
            classworkBegintime, classworkDeadline, classworkRemark
        } = this.props.record
        const { Files1, Files2, previewImage, previewVisible } = this.state
        return (
            <Form {...FormItemLayout}>
                <FormItem label='作业ID'>
                    <Input defaultValue={classworkId} disabled />
                </FormItem>
                <FormItem label='作业名称'>
                    <Input defaultValue={classworkTitle} disabled />
                </FormItem>
                <FormItem label='课程名'>
                    <Input 
                        defaultValue={courseName} 
                        disabled
                    />
                </FormItem>
                <FormItem label='作业类型'>
                    <Input 
                        defaultValue={classworkType} 
                        disabled
                    />
                </FormItem>
                <FormItem label='开始时间'>
                    <Input 
                        defaultValue={TimestampToNormaltime(classworkBegintime)} 
                        disabled
                    />
                </FormItem>
                <FormItem label='截止时间'>
                    <Input 
                        defaultValue={TimestampToNormaltime(classworkDeadline)} 
                        disabled
                    />
                </FormItem>
                <FormItem label='留言'>
                    <TextArea
                        value={classworkRemark}
                        disabled
                        autoSize={{ minRows: 1, maxRows: 4 }}
                    />
                </FormItem>
                <FormItem label='作业内容' labelCol={{span:4}} wrapperCol={{span:20}}>
                    <Upload
                        showUploadList={{
                            showRemoveIcon: false
                        }}
                        onPreview={this.handlePreview}
                        fileList={Files1}
                        listType="picture-card"
                    >
                    </Upload>
                </FormItem>
                <FormItem label='作业答案' labelCol={{span:4}} wrapperCol={{span:20}}>
                    <Upload
                        showUploadList={{
                            showRemoveIcon:false
                        }}
                        onPreview={this.handlePreview}
                        fileList={Files2}
                        listType="picture-card"
                    >
                    </Upload>
                </FormItem>
                <Modal 
                    visible={previewVisible} 
                    footer={null} 
                    onCancel={this.handleCancel}
                    width='45vw'
                    height='auto'
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </Form>
        )
    }
}

export default CheckForm