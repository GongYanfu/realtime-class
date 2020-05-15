import React, { Component, Fragment } from 'react';
import { 
    Form, 
    Input, 
    Button, 
    DatePicker, 
    Upload, 
    Icon, 
    message, 
    Radio, 
    Modal, 
    Select 
} from 'antd'
import axios from 'axios'
import moment from 'moment'
import BasicLayoutForTea from '../../../components/BasicLayoutForTea/BasicLayoutForTea'
import { getItem, KEYS } from '../../../utils/localStorage'
import { NormaltimeToTimestamp } from '../../../utils/timeFormat'

const { Option } = Select
const { TextArea } = Input
const FormItem = Form.Item

class AddTaskPage extends Component {
    constructor(props){
        super(props)
        this.state = {
            courses:[],
            teacherId: '',
            courseId:'',
            courseName:'',
            courseTeacher:'',
            classworkTitle:'',
            classworkType:'课后作业',
            beginTime:'',
            deadline:'',
            remark:'',
            classworkFiles:[],
            classworkReferences:[],
            showModal:false,
            previewImage:'',
            uploading: false
        }
    }

    componentDidMount= async() => {
        const { userId } = JSON.parse(getItem(KEYS.KEY_CUR_USERINFO))
        this.setState({
            teacherId: userId
        })
        const res = await axios({
            url:'http://118.24.233.16:8080/homeworkManager/course/getbyteacherId',
            method:'get',
            params:{
                courseTeacherId: userId
            }
        })
        if(res && res.status===200){
            if(res.data && res.data.length>0){
                var Arr = []
                res.data.map((item,index) => {
                    Arr[index] = item
                    return null
                })
                this.setState({
                    courses: [...Arr]
                })
            }
        }        
    }

    handleSelect = (value, option) => {
        this.setState({
            courseName: value,
            courseId: option.key
        })
    }
    handleClassworkTitleChange = (e) => {
        this.setState({
            classworkTitle: e.target.value
        })
    }
    handleClassworkTypeChange = (e) => {
        const { value } = e.target
        if(value==='a'){
            this.setState({
                classworkType:'课后作业'
            })
        }
        else{
            this.setState({
                classworkType:'课堂作业'
            })
        }
    }
    handleBeginTimeChange = (value, dateString) => {
        this.setState({
            beginTime:dateString 
        })
    }
    handleDeadlineChange = (value, dateString) => {
        this.setState({
            deadline: dateString
        })
    }
    handleClassworkFileRemove = (file) => {
        const {classworkFiles} = this.state
        const index = classworkFiles.indexOf(file)
        const newFileList = classworkFiles.slice()
        newFileList.splice(index, 1)
        this.setState({
            classworkFiles: newFileList
        })
    }
    handleClassworkReferenceRemove = (file) => {
        const {classworkReferences} = this.state
        const index = classworkReferences.indexOf(file)
        const newFileList = classworkReferences.slice()
        newFileList.splice(index, 1)
        this.setState({
            classworkReferences: newFileList
        })
    }
    handleCancel = () => {
        this.setState({
            showModal: false
        });
    }
    getBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      }
    handlePreview = async(file) => {
        if (!file.url && !file.preview) {
          file.preview = await this.getBase64(file.originFileObj);
        }
        this.setState({
          previewImage: file.url || file.preview,
          showModal: true,
        });
    }
    beforeUploadFile = (file) => {
        console.log('file',file)
        this.setState(state => ({
            classworkFiles: [...state.classworkFiles, file],
        }))
        return false
    }
    beforeUploadReference = (file) => {
        this.setState(state => ({
            classworkReferences: [...state.classworkReferences, file],
        }))
        return false
    }
    handleTextAreaChange = (e) => {
        this.setState({
            remark: e.target.value
        })
    }

    handleSubmit = async(e) => {
        this.setState({
            uploading: true
        })
        const { history } = this.props
        const { classworkType, courseId, teacherId, classworkTitle, beginTime, deadline, classworkFiles, classworkReferences, remark } = this.state
        if(classworkType && courseId && teacherId && classworkTitle && beginTime && deadline && beginTime && deadline && classworkFiles.length>0 && classworkReferences.length>0 && remark){
            if( NormaltimeToTimestamp(beginTime) < NormaltimeToTimestamp(deadline) && NormaltimeToTimestamp(deadline) > NormaltimeToTimestamp(moment()) ){
                const formData = new FormData()
                classworkFiles.forEach(file => {
                    formData.append('files', file)
                })  
                classworkReferences.forEach(file => {
                    formData.append('references',file)
                })
                formData.append('classworkType',classworkType)
                formData.append('classworkCourseId',courseId)
                formData.append('classworkTeacherId',teacherId)
                formData.append('classworkTitle',classworkTitle)
                formData.append('classworkBegintime',beginTime)
                formData.append('classworkDeadline',deadline)
                formData.append('classworkRemark',remark) 
                const res = await axios({
                    method:'post',
                    url:'http://118.24.233.16:8080/homeworkManager/classwork/add',
                    processData: false,
                    data: formData,
                })
                if(res && res.status===200){
                    if(res.data==='ok'){
                        this.setState({
                            uploading: false
                        })
                        message.info('上传成功！！',2)
                        history.push('/allClassworks')
                    }
                    else{
                        this.setState({
                            uploading: false
                        })
                        message.error('发布失败！！',2)
                    }
                }
                else{
                    message.error('上传失败！！',2)
                    this.setState({
                        uploading: false
                    })
                } 
            }
            else{
                message.warn('请检查开始时间与截止时间！！',2)
                this.setState({
                    uploading: false
                })
            }
        }
        else{
            message.warn('请完善作业信息后再提交',2)
            this.setState({
                uploading: false
            })
        }
    }

    handleReset = ()=>{
        window.location.reload()
    }

    render() {
        const FormItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 8 }
        }
        const ButtonItemLayout = {
            wrapperCol: { 
                span: 8, 
                offset: 4
            }
        }
        const { getFieldDecorator } = this.props.form;
        const config = {
            rules: [{ type: 'object', message: 'Please select time!' }],
        };
        const { showModal, previewImage, courses, remark, uploading } = this.state;
        const uploadProps1 = {
            onPreview: this.handlePreview,
            onRemove: this.handleClassworkFileRemove,
            beforeUpload: this.beforeUploadFile,
            listType: 'picture-card',
            multiple: true
        }
        const uploadProps2 = {
            onPreview: this.handlePreview,
            onRemove: this.handleClassworkReferenceRemove,
            beforeUpload: this.beforeUploadReference,
            listType: 'picture-card',
            multiple: true
        }
        return (
            <BasicLayoutForTea title='作业管理/作业发布' describe='本页用于老师发布作业'>
                    <div style={{width:'40vw'}} >
                        <Form layout='horizontal' {...FormItemLayout}>
                            <FormItem label="课程名称" >
                                <Select 
                                    onChange={this.handleSelect}
                                    notFoundContent={'请确认您是否已经创建课程？？？'}
                                    placeholder='请点击输入框选择课程'
                                >
                                    {
                                        courses.map((item,index) => {
                                            return  <Option 
                                                        key={item.courseId}
                                                        value={item.courseName}
                                                    >
                                                        {item.courseName}
                                                    </Option>
                                        })
                                    }
                                </Select>
                            </FormItem>
                            <FormItem label="作业名称"  >
                                <Input 
                                    onChange={this.handleClassworkTitleChange.bind(this)}
                                    placeholder="请输入本次作业名" 
                                />
                            </FormItem>
                            <FormItem label='作业类型' >
                                <Radio.Group defaultValue="a" buttonStyle="solid" onChange={this.handleClassworkTypeChange}>
                                    <Radio.Button value="a">课后作业</Radio.Button>
                                    <Radio.Button value="b">课堂作业</Radio.Button>
                                </Radio.Group>
                            </FormItem>
                            <FormItem label="开始时间" >
                                {getFieldDecorator('picker1', config)(
                                    <DatePicker 
                                        showTime
                                        format="YYYY-MM-DD HH:mm:ss" 
                                        placeholder='请选择开始时间'
                                        onChange={this.handleBeginTimeChange}         
                                />
                                )}
                            </FormItem>
                            <FormItem label="截止时间" >
                                {getFieldDecorator('picker2', config)(
                                    <DatePicker 
                                        showTime
                                        format="YYYY-MM-DD HH:mm:ss" 
                                        placeholder='请选择截止时间'    
                                        onChange={this.handleDeadlineChange}     
                                />
                                )}
                            </FormItem>
                            <FormItem label="作业图片" labelCol={{span:4}} wrapperCol={{span:20}} >
                                <Upload
                                    {...uploadProps1}
                                >
                                    <div>
                                        <Icon type="plus" />
                                        <div>上传图片(按住ctrl多选)</div>
                                    </div>
                                </Upload>   
                            </FormItem>
                            <FormItem label="答案图片" labelCol={{span:4}} wrapperCol={{span:20}}  >
                                <Fragment>
                                    <Upload
                                        {...uploadProps2}
                                    >
                                        <div>
                                            <Icon type="plus" />
                                            <div>上传图片(按住ctrl多选)</div>
                                        </div>
                                    </Upload>
                                </Fragment>  
                            </FormItem>
                            <FormItem label='作业留言'>
                                <TextArea
                                    value={remark}
                                    onChange={this.handleTextAreaChange}
                                    placeholder="请为本次作业留言~~~"
                                    rows={4}
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
                                    <Button 
                                        type="primary"
                                        loading={uploading}
                                        onClick={this.handleSubmit}
                                    >
                                        <Icon type='upload' />
                                        发布
                                    </Button>
                                </Button.Group>
                            </FormItem>
                        </Form>
                        <Modal
                            footer={null}
                            onCancel={this.handleCancel}
                            visible={showModal}
                            width='45vw'
                            height='auto'
                        >
                            <img
                                alt="作业内容"
                                src={previewImage}
                                style={{ width: '100%' }}
                            />
                        </Modal> 
                    </div>
            </BasicLayoutForTea>
        )
  }
}

const AddTask = Form.create({name:'add'})(AddTaskPage)
export default AddTask

/*
<div style={{display:'flex'}}>
    <Button 
        type='danger'
        size='small'
        style={{marginRight:'20px'}}
        onClick={this.handleReset}
    >
        重置
    </Button>
    <Button 
        type="primary"
        size='small'
        loading={uploading}
        onClick={this.handleSubmit}
    >
        发布
    </Button>
</div>
*/