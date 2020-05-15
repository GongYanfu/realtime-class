import React, { Component, Fragment } from 'react'
import { 
    Form, 
    Input, 
    Button, 
    Radio, 
    DatePicker, 
    message,
    Row, 
    Col,
    Upload,
    Icon,
    Modal,
    Select
} from 'antd'
import moment from 'moment'
import axios from 'axios'

const FormItem = Form.Item
const { TextArea } = Input
const { Option } = Select

class ModifyForm extends Component {
    constructor(props){
        super(props)
        this.state = {
            classworkId:'',
            courseName:'',
            classworkType:'',
            classworkCourseId:'',
            classworkTitle:'',
            begintime:'',
            deadline:'',
            files:[],
            references:[],
            classworkRemark:'',
            previewVisible: false,
            previewImage: '',
            uploading:false
        }
    }

    componentDidMount = () => {
        const { record } = this.props
        this.setState({
            classworkId: record.classworkId,
            teacherId: record.classworkTeacherId,
            courseName: record.courseName,
            classworkType: record.classworkType,
            classworkCourseId: record.classworkCourseId,
            title: record.classworkTitle,
            begintime: record.classworkBegintime,
            deadline: record.classworkDeadline,
            remark: record.classworkRemark
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
    handleClassworkBegintimeChange = (value, dateString) => {
        this.setState({
            begintime: dateString 
        })
    }
    handleCourseDeadlineChange = (value, dateString) => {
        this.setState({
            deadline: dateString
        })
    }
    handleTextAreaChange = (e) => {
        this.setState({
            remark: e.target.value
        })
    }

    handlePreview = (file) => {
        this.setState({
          previewImage: file.url || file.thumbUrl,
          previewVisible: true
        })
    }

    handleCancel = () => this.setState({ previewVisible: false })

    handleClassworkFileRemove = (file) => {
        const {files} = this.state
        const index = files.indexOf(file)
        const newFileList = files.slice()
        newFileList.splice(index, 1)
        this.setState({
            files: newFileList
        })
    }
    handleClassworkReferenceRemove = (file) => {
        const {references} = this.state
        const index = references.indexOf(file)
        const newFileList = references.slice()
        newFileList.splice(index, 1)
        this.setState({
            references: newFileList
        })
    }
    beforeUploadFile = (file) => {
        this.setState(state => ({
            files: [...state.files, file],
        }))
        return false
    }
    beforeUploadReference = (file) => {
        this.setState(state => ({
            references: [...state.references, file],
        }))
        return false
    }

    handleCancel2 = () => {
        this.props.onCancel()
    }

    handleCourseNameSelect = (value,option) => {
        this.setState({
            courseName: value
        })
    }

    handleUpdate = async() => {
        this.setState({
            uploading: true
        })
        const { classworkId, courseName, classworkType, teacherId, 
                classworkCourseId, title, begintime, deadline, 
                files, references, remark
        } = this.state
        if(classworkId && courseName && classworkType && classworkCourseId && title && begintime && deadline && files && references && remark){
            const formData = new FormData()
            files.forEach(file => {
                formData.append('files', file)
            })  
            references.forEach(file => {
                formData.append('references',file)
            })
            formData.append('classworkId',classworkId)
            formData.append('classworkType',classworkType)
            formData.append('classworkCourseId',classworkCourseId)
            formData.append('classworkTeacherId',teacherId)
            formData.append('classworkTitle',title)
            formData.append('classworkBegintime',begintime)
            formData.append('classworkDeadline',deadline)
            formData.append('classworkRemark',remark)
            const res = await axios({
                method:'post',
                url:'http://118.24.233.16:8080/homeworkManager/classwork/update',
                processData: false,
                data: formData
            })
            if(res && res.status===200){
                if(res.data === 'ok'){
                    message.info('作业修改成功！！',2)
                    this.setState({
                        uploading: false
                    })
                    setTimeout(() => {
                        this.props.onCancel()
                        this.props.onLoad()
                    },500)
                }
                else{
                    message.error(`错误:${res.data}`,2)
                    this.setState({
                        uploading: false
                    })
                }
            }
            else{
                message.error(`错误:${res.data}`,2)
                this.setState({
                    uploading: false
                })
            }
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
        const { classworkId, courseName, classworkType, title, 
                begintime, deadline, remark,  
                previewImage, previewVisible, uploading
        } = this.state
        const { courses } = this.props
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
            <Fragment>
                <Form 
                    {...FormItemLayout}
                >
                    <FormItem label='作业Id'>
                        <Input value={classworkId} disabled />
                    </FormItem>
                    <FormItem label='课程名'>
                        <Select 
                            onChange={this.handleCourseNameSelect}
                            placeholder={courseName}
                            style={{width:'12vw'}}
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
                    <FormItem label='作业名称'>
                        <Input 
                            value={title} 
                            onChange={this.handleClassworkTitleChange}
                        />
                    </FormItem>
                    <FormItem label='作业类型'>
                        <Radio.Group value={classworkType==='课后作业'?'a':'b'} buttonStyle="solid" onChange={this.handleClassworkTypeChange}>
                            <Radio.Button value="a">课后作业</Radio.Button>
                            <Radio.Button value="b">课堂作业</Radio.Button>
                        </Radio.Group>
                    </FormItem>
                    <FormItem label='开始时间'>
                        <DatePicker 
                            showTime
                            format="YYYY-MM-DD HH:mm:ss" 
                            placeholder='请选择开始时间'  
                            value={moment(begintime)} 
                            onChange={this.handleClassworkBegintimeChange}     
                        />
                    </FormItem>
                    <FormItem label='截止时间'>
                        <DatePicker 
                            showTime
                            format="YYYY-MM-DD HH:mm:ss" 
                            placeholder='请选择截止时间' 
                            value={moment(deadline)} 
                            onChange={this.handleCourseDeadlineChange}     
                        />
                    </FormItem>
                    <FormItem label='留言'>
                        <TextArea
                            value={remark}
                            onChange={this.handleTextAreaChange}
                            placeholder="请为本次作业留言~~~"
                            autoSize={{ minRows: 1, maxRows: 4 }}
                        />
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
                    <Modal
                        visible={previewVisible}
                        footer={null}
                        onCancel={this.handleCancel}
                        width='45vw'
                        height='auto'
                    >
                        <img alt="example" style={{ width: "100%" }} src={previewImage} />
                    </Modal>
                </Form>
                <Fragment>
                    <Row>
                        <Col span={2} offset={16}>
                            <Button
                                type='danger'
                                size='small'
                                onClick={this.handleCancel2}
                            >
                                取消
                            </Button>
                        </Col>
                        <Col span={2} offset={3}>
                            <Button
                                type='primary'
                                size='small'
                                loading={uploading}
                                onClick={this.handleUpdate}
                            >
                                更 新
                            </Button>
                        </Col>
                    </Row>
                </Fragment>
            </Fragment>
        )
    }
}

export default ModifyForm

/*
const {fileSize = 1024 * 1024} = this.props;
const isJPG = file.type === 'image/jpeg';
const isPNG = file.type === 'image/png';
if (!isJPG && !isPNG) {
    file.status = 'error';
    message.error('只能上传格式jpg或png的图片');
}
else if (file.size > fileSize) {
    file.status = 'error';
    message.error(`图片大小不能大于${parseInt(fileSize/1024)}kb`);
}
else{
    this.setState({
        references: [...references, file]
    })
} 
*/