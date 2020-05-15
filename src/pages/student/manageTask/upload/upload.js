import React,{ Component, Fragment } from 'react'
import { 
    Form, 
    Input, 
    Modal, 
    message, 
    Upload, 
    Icon, 
    Button
} from 'antd'
import { TimestampToNormaltime } from '../../../../utils/timeFormat'
import { getItem, KEYS } from '../../../../utils/localStorage'
import axios from 'axios'

const FormItem = Form.Item
const FormItemLayout1 = {
    labelCol: {
        xs: { span: 8 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 12 },
      }
}
const FormItemLayout2 = {
    labelCol: {
        xs: { span: 4 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 20 },
        sm: { span: 20},
      }
}

class UploadForm  extends Component{
    constructor(props){
        super(props)
        this.state = {
            uploadFiles:[],
            record: this.props.record,
            showModal: false,
            uploading: false,
        }
    }
    handleRemove = (file) => {
        const {uploadFiles} = this.state
        const index = uploadFiles.indexOf(file);
        const newFileList = uploadFiles.slice();
        newFileList.splice(index, 1);
        this.setState({
            uploadFiles: newFileList,
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
    beforeUpload = (file) => {
        this.setState(state => ({
            uploadFiles: [...state.uploadFiles, file],
        }))
        return false
    }
    handleUpload = async () => {
        this.setState({
            uploading: true,
        })
        const { uploadFiles, record } = this.state;
        const { userId } = JSON.parse(getItem(KEYS.KEY_CUR_USERINFO))
        const formData = new FormData();
        uploadFiles.forEach(file => {
            formData.append('files', file);
        })  
        formData.append('studentId',userId)
        formData.append('classworkId',record.classworkId)
        const res = await axios({
            url: 'http://118.24.233.16:8080/homeworkManager/answer/add',
            method: 'post',
            processData: false,
            data: formData,
        })
        if( res && res.status===200) {
            if(res.data==='作业上传成功'){
                this.setState({
                    uploadFiles: [],
                    uploading: false
                })
                message.info('作业上传成功！！！',2)
                this.setState({
                    uploading: false
                })
                this.props.onCancel()
                this.props.onLoad()
            }
            else{
                this.setState({
                    uploading: false
                })
                message.error('作业上传失败',2)
            }
        }
        else {
            message.error(`${res.data}`,2)
            this.setState({
                uploading: false
            })
        }
    }

    render(){
        const { uploadFiles, record, showModal, previewImage, uploading } = this.state
        const uploadProps = {
            onPreview: this.handlePreview,
            onRemove: this.handleRemove,
            beforeUpload: this.beforeUpload,
            listType: 'picture-card',
            multiple: true
        }
        return (
            <Fragment>
                <Form >
                    <FormItem label='作业名称' {...FormItemLayout1}>
                        <Input disabled value={record.classworkTitle} />
                    </FormItem>
                    <FormItem label='截止时间' {...FormItemLayout1}>
                        <Input disabled value={
                            TimestampToNormaltime(record.classworkDeadline)
                        } />
                    </FormItem>
                    <FormItem label='答案上传' {...FormItemLayout2}>
                        <Fragment>
                            <Upload
                                {...uploadProps}
                            >
                                <div>
                                    <Icon type="plus" />
                                    <div>上传图片(按住ctrl多选)</div>
                                </div>
                            </Upload>
                        </Fragment>
                    </FormItem>
                    <FormItem style={{marginBottom:'0'}}>
                        <Button
                            type='primary'
                            size='default'
                            loading={uploading}
                            disabled={uploadFiles.length===0}
                            style={{marginLeft:"30vw"}}
                            onClick={this.handleUpload}
                        >
                            提交
                        </Button>
                    </FormItem>
                    <Modal
                        footer={null}
                        onCancel={this.handleCancel}
                        visible={showModal}
                        width='45vw'
                        height='auto'
                    >
                        <img
                            alt='作业图片'
                            src={previewImage}
                            style={{ width: '100%' }}
                        />
                    </Modal>
                </Form>
            </Fragment>
        )
    }
}

export default UploadForm