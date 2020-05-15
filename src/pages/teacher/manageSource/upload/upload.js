import React,{ Component } from 'react'
import { 
    Form, 
    Input, 
    Button, 
    Upload, 
    Icon, 
    message, 
    Select
} from 'antd'
import axios from 'axios'
import { getItem, KEYS } from '../../../../utils/localStorage'
import BasicLayoutForTea from '../../../../components/BasicLayoutForTea/BasicLayoutForTea'

const { Option } = Select
const FormItem = Form.Item
const sourceTypes = ['私有资源','公共资源']

class UploadSource extends Component {
    constructor(props){
        super(props)
        this.state = {
            chapter:{},
            courseId:'',
            userId:0,
            course:{},
            uploading: false,

            name:'',
            resourceType:'private',
            resource:''
        }
    }

    componentDidMount = () => {
        this.loadData()
    }
    loadData = async() => {
        const { chapter, courseId } = JSON.parse(getItem(KEYS.KEY_CUR_CHAPTER))
        const { userId } = JSON.parse(getItem(KEYS.KEY_CUR_USERINFO))
        this.setState({
            chapter,
            courseId,
            userId
        })
        try {
            const res = await axios({
                url:'http://118.24.233.16:8080/homeworkManager/course/getbycourseId',
                method:'get',
                params:{courseId: courseId}
            })
            if(res && res.status===200){
                const { data } = res
                if(data && data.courseId){
                    this.setState({
                        course: data
                    })
                }
                else{
                    message.error(res.data,2)
                }
            }
            else{
                message.error(res.data,2)
            }
        }
        catch(error){
            message.error('系统错误，刷新页面或者联系管理员！！',2)
        }

    }
    handleNameChange = (e) => {
        this.setState({
            name: e.target.value
        })
    }
    handleSelect = (value) => {
        this.setState({
            sourceType: value
        })
    }

    beforeUpload = (file) => {
        this.setState(state => ({
            resource: file
        }))
        return false
    }
    handleRemove = () => {
        this.setState({
            resource:''
        })
    }
    handleReset = () => {
        window.location.reload()
    }
    handleUpload = async() => {
        this.setState({
            uploading: true
        })
        const { name, resourceType, courseId, chapter, userId, resource } = this.state
        if(name && resourceType && courseId && chapter && userId && resource){
            const formData = new FormData()
            formData.append('chapterid',chapter.nodeid)
            formData.append('createuser',userId)
            formData.append('courseid',courseId)
            formData.append('resoursetype',resourceType)
            formData.append('name',name)
            formData.append('newResources',resource)
            try{
                const res = await axios({
                    url:'http://118.24.233.16:8080/homeworkManager/Resources/add',
                    method:'post',
                    processData: false,
                    data: formData
                })
                if(res && res.status===200){
                    const {data} = res
                    const {msg,code,data:info} = data
                    if(msg==='ok' || code===200 || info==='add Success'){
                        message.info('上传资源成功！！！',2)
                        setTimeout(() => {
                            this.setState({
                                uploading: false
                            })
                            window.location.reload()
                        },2000)
                    }
                    else{
                        message.error(res.data,2)
                    } 
                }
                else{
                    message.error('上传失败！！',2)
                    this.setState({
                        uploading: false
                    })
                } 
            }
            catch(error){
                message.error('系统异常，刷新重试或者联系管理员！',2)
                this.setState({
                    uploading: false
                })
            }
        }
        else{
            message.warn('请完善资源信息之后提交！！！',2)
            this.setState({
                uploading: false
            })
        }
    }

    render(){
        const { chapter, course, uploading, resource } = this.state
        const FormItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 10 }
        }
        const ButtonItemLayout = {
            wrapperCol: { 
                span: 10,
                offset: 3
            }
        }
        const uploadProps = {
            onRemove: this.handleRemove,
            beforeUpload: this.beforeUpload
        }
        return (
            <BasicLayoutForTea 
                title={`资源上传/${chapter.nodeindex} ${chapter.nodename}`} 
                describe='本页用于上传课程资源(视频、PDF、PPT等)'
            >
                <div style={{width:"40vw"}}>
                <Form layout='horizontal' {...FormItemLayout}>
                    <FormItem label="课程名称" >
                        <Input 
                            value={course.courseName}
                            disabled
                            placeholder="请输入本次作业名" 
                        />
                    </FormItem>
                    <FormItem label="资源名称"  >
                        <Input 
                            onChange={this.handleNameChange}
                            placeholder="请输入本次上传资源名称" 
                        />
                    </FormItem>
                    <FormItem label='资源类型'>
                        <Select 
                            onChange={this.handleSelect}
                            defaultValue='私有资源'
                            placeholder='请点击选择资源类型'
                            disabled
                        >
                            {
                                sourceTypes.map((item,index) => {
                                    return  <Option 
                                                key={index}
                                                value={item}
                                            >
                                                {item}
                                            </Option>
                                })
                            }
                        </Select>
                    </FormItem>
                    <FormItem label="资源选择" labelCol={{span:3}} wrapperCol={{span:21}} >
                        {/* <Upload action="https://www.mocky.io/v2/5cc8019d300000980a055e76" directory>
                            <Button value="directory">
                                <Icon type="cloud-upload" /> 文件夹上传
                            </Button>
                        </Upload> */}
                        <Upload 
                            {...uploadProps}
                        >
                            <Button 
                                value="file"
                                disabled={resource ? true : false}
                            >
                                <Icon type="cloud-upload" /> 单文件上传
                            </Button>
                        </Upload>
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
                                onClick={this.handleUpload}
                            >
                                <Icon type='upload' />
                                上传
                            </Button>
                        </Button.Group>
                    </FormItem>
                </Form>
                </div>
            </BasicLayoutForTea>
        )
    }
}

export default UploadSource