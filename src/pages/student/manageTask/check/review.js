import React,{ Component, Fragment } from 'react'
import { 
    Form, 
    Input, 
    Upload, 
    Modal, 
    Divider,
    Radio,
    Icon,
    Button,
    message 
} from 'antd'
import axios from 'axios'
import moment from 'moment'
import { NormaltimeToTimestamp } from '../../../../utils/timeFormat'
import { getItem, KEYS } from '../../../../utils/localStorage'
import BasicLayoutForStu from '../../../../components/BasicLayoutForStu/BasicLayoutForStu'

const FormItem = Form.Item
const {TextArea} = Input
const formItemLayout = {
    labelCol: {span:7},
    wrapperCol:{ span:15}
}

class CheckReview  extends Component{
    constructor(props){
        super(props)
        this.state = {
            record: null,
            files: [], //作业内容
            references:[], //作业答案
            firstImgs:[], //首次提交图片
            secondImgs:[], //二次提交图片
            uploadFiles:[],//即将上传图片
            previewImage:'',
            previewVisible: false,
            state:'add',
            uploading: false
        }
    }

    componentDidMount = () => {
        const record = JSON.parse(getItem(KEYS.KEY_CUR_CLASSWORK))
        if(record){
            this.setState({
                record
            })
            const { classworkFile, classworkReference, answerFirstImgPath, answerSecondImgPath} = record
            if(classworkFile){
                let newData = []
                const files = classworkFile.split("|").filter(item => item!=='')
                files.map((item,index) => {
                    const fileData = {
                        uid: index,
                        name:`image${index}`,
                        status:'done',
                        url: 'http://118.24.233.16:8080'+item
                    }
                    newData = [...newData,fileData]
                    if(newData.length === files.length){
                        this.setState({
                            files: [...newData]
                        })
                    }
                    return null
                })
            }
            if(classworkReference){
                let newData = []
                const files = classworkReference.split("|").filter(item => item!=='')
                files.map((item,index) => {
                    const fileData = {
                        uid: index,
                        name:`image${index}`,
                        status:'done',
                        url: 'http://118.24.233.16:8080'+item
                    }
                    newData = [...newData,fileData]
                    if(newData.length === files.length){
                        this.setState({
                            references: [...newData]
                        })
                    }
                    return null
                })
            }
            if(answerFirstImgPath){
                let newData = []
                const files = answerFirstImgPath.split("|").filter(item => item!=='')
                files.map((item,index) => {
                    const fileData = {
                        uid: index,
                        name:`image${index}`,
                        status:'done',
                        url: 'http://118.24.233.16:8080'+item
                    }
                    newData = [...newData,fileData]
                    if(newData.length === files.length){
                        this.setState({
                            firstImgs: [...newData]
                        })
                    }
                    return null
                })
            }
            if(answerSecondImgPath){
                let newData = []
                const files = answerSecondImgPath.split("|").filter(item => item!=='')
                files.map((item,index) => {
                    const fileData = {
                        uid: index,
                        name:`image${index}`,
                        status:'done',
                        url: 'http://118.24.233.16:8080'+item
                    }
                    newData = [...newData,fileData]
                    if(newData.length === files.length){
                        this.setState({
                            secondImgs: [...newData]
                        })
                    }
                    return null
                })
            }
        }
    }
    handleBack = () => {
        const record = JSON.parse(getItem(KEYS.KEY_CUR_CLASSWORK))
        if(record){
            const { classworkType } = record
            const { history } = this.props
            if(classworkType==='课堂作业'){
                setTimeout(() => {
                    history.push('/seatwork')
                },500)
            }
            else{
                setTimeout(() => {
                    history.push('/homework')
                },500)
            }
        }
    }

    handleSelectState = (e) => {
        const { value } = e.target
        if(value==='a'){
            this.setState({
                state:'add'
            })
        }
        else{
            this.setState({
                state:'update'
            })
        }
    }
    handleRemove = (file) => {
        const {uploadFiles} = this.state
        const index = uploadFiles.indexOf(file);
        const newuploadFiles = uploadFiles.slice();
        newuploadFiles.splice(index, 1);
        this.setState({
            uploadFiles: newuploadFiles,
        })
    }
    handleCancel = () => {
        this.setState({
            previewVisible: false
        })
    }
    getBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        })
    }
    handlePreview = async(file) => {
        if (!file.url && !file.preview) {
          file.preview = await this.getBase64(file.originFileObj);
        }
    
        this.setState({
          previewImage: file.url || file.preview,
          previewVisible: true,
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
        const { uploadFiles, record, state } = this.state;
        const { userId } = JSON.parse(getItem(KEYS.KEY_CUR_USERINFO))
        /* 作业类型 => answerFirstImgPath => state */
        const formData = new FormData();
        uploadFiles.forEach(file => {
            formData.append('files', file);
        })  
        formData.append('studentId',userId)
        
        if( record.classworkType === '课堂作业' ){
            if(record.answerFirstImgPath){ 
                formData.append('answerId',record.answerId)
                formData.append('times',1)
                const res = await axios({
                    url: 'http://118.24.233.16:8080/homeworkManager/answer/update',
                    method: 'post',
                    processData: false,
                    data: formData,
                })
                if( res && res.status===200) {
                    if(res.data==='修改完成'){
                        this.setState({
                            uploadFiles: [],
                            uploading: false
                        })
                        message.info('作业修改成功！！！',2)
                        this.setState({
                            uploading: false
                        })
                        const { history } = this.props
                        setTimeout(()=>{
                            this.setState({
                                uploading: false
                            })
                            history.push('/seatwork')
                        },1000)
                    }
                    else{
                        this.setState({
                            uploading: false
                        })
                        message.error('作业修改失败',2)
                    }
                }
                else {
                    message.error(`${res.data}`,2)
                    this.setState({
                        uploading: false
                    })
                }
            }
            else{
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
                        const { history } = this.props
                        setTimeout(()=>{
                            this.setState({
                                uploading: false
                            })
                            history.push('/homework')
                        },1000)
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
        }
        else{ //课后作业
            /** 第一次未提交 */
            if(!record.answerFirstImgPath){
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
                        const { history } = this.props
                        setTimeout(()=>{
                            history.push('/homework')
                            window.location.reload()
                        },1000)
                        this.setState({
                            uploading: false 
                        })
                    }
                    else{
                        this.setState({
                            uploading: false
                        })
                        message.error('作业上传失败！！！',2)
                    }
                }
                else {
                    message.error(`${res.data}`,2)
                    this.setState({
                        uploading: false
                    })
                }
            }
            /* 第一次已经提交 */
            else{
                /* 首次重传 */
                if(state === 'add'){
                    formData.append('answerId',record.answerId)
                    formData.append('times',1)
                    const res = await axios({
                        url: 'http://118.24.233.16:8080/homeworkManager/answer/update',
                        method: 'post',
                        processData: false,
                        data: formData,
                    })
                    if( res && res.status===200) {
                        if(res.data==='修改完成'){
                            this.setState({
                                uploadFiles: [],
                                uploading: false
                            })
                            message.info('作业修改成功！！！',2)
                            this.setState({
                                uploading: false
                            })
                            const { history } = this.props
                            setTimeout(()=>{
                                history.push('/homework')
                                window.location.reload()
                            },1000)
                        }
                        else{
                            this.setState({
                                uploading: false
                            })
                            message.error('作业修改失败！！！',2)
                        }
                    }
                    else {
                        message.error(`${res.data}`,2)
                        this.setState({
                            uploading: false
                        })
                    }
                }
                /* 第二次上传或者重传 */
                else{
                    formData.append('answerId',record.answerId)
                    formData.append('times',2)
                    const res = await axios({
                        url: 'http://118.24.233.16:8080/homeworkManager/answer/update',
                        method: 'post',
                        processData: false,
                        data: formData,
                    })
                    if( res && res.status===200) {
                        if(res.data==='修改完成'){
                            this.setState({
                                uploadFiles: [],
                                uploading: false
                            })
                            message.info('作业上传/修改成功！！！',2)
                            const { history } = this.props
                            setTimeout(()=>{
                                history.push('/homework')
                                window.location.reload()
                            },1000)
                            this.setState({
                                uploading: false
                            })
                        }
                        else{
                            this.setState({
                                uploading: false
                            })
                            message.error('作业上传/修改失败！！！',2)
                        }
                    }
                    else {
                        message.error(`${res.data}`,2)
                        this.setState({
                            uploading: false
                        })
                    }
                }
            }
        }
    }

    render(){
        const { 
            record, files, references, firstImgs, secondImgs, 
            uploadFiles, previewImage, previewVisible, uploading
        } = this.state
        const uploadProps = {
            onPreview: this.handlePreview,
            onRemove: this.handleRemove,
            beforeUpload: this.beforeUpload,
            listType: 'picture-card',
            multiple: true
        }
        return (
            <BasicLayoutForStu 
                title={record ? `作业管理/${record.classworkType}` : '作业管理/课后作业' } 
                describe='本页用于提交/修改作题内容'
            >
                {
                    record
                    ?   <Fragment>
                            <Button
                                type='primary'
                                size='small'
                                icon='backward'
                                style={{
                                    position:'absolute',
                                    top:'6rem',
                                    right:'5rem',
                                    zIndex:999
                                }}
                                onClick={this.handleBack}
                            >
                                返回
                            </Button>
                            <Fragment>
                                <Form layout='inline'  {...formItemLayout}>
                                    <FormItem label='作业名称' >
                                        <Input disabled value={record.classworkTitle} />
                                    </FormItem>
                                    <FormItem label='作业类型' >
                                        <Input disabled value={record.classworkType} />
                                    </FormItem>
                                    <FormItem label='课程名称' >
                                        <Input disabled value={record.courseName} />
                                    </FormItem>
                                    <FormItem label='开始时间' >
                                        <Input disabled value={record.classworkBegintime} />
                                    </FormItem>
                                    <FormItem label='截止时间' >
                                        <Input disabled value={record.classworkDeadline} />
                                    </FormItem>
                                </Form>
                                <Form >
                                    <FormItem label='内容' labelCol={{span:1}} wrapperCol={{span:23}}>
                                        <Upload
                                            showUploadList={{showRemoveIcon:false}}
                                            onPreview={this.handlePreview}
                                            fileList={files}
                                            listType="picture-card"
                                        >
                                        </Upload>
                                    </FormItem>
                                </Form>
                                <Form > 
                                    <FormItem label='答案' labelCol={{span:1}} wrapperCol={{span:23}}>
                                        <Upload
                                            showUploadList={{showRemoveIcon:false}}
                                            onPreview={this.handlePreview}
                                            fileList={references}
                                            listType='picture-card'
                                        >
                                        </Upload>
                                    </FormItem>
                                </Form>
                                <Divider style={{backgroundColor:'rgba(0,0,0,0.5)'}} />
                            </Fragment>
                            <Fragment>
                                <Form>
                                    <FormItem label='首次' labelCol={{span:1}} wrapperCol={{span:4}} >
                                        <Input value={record.answerFirstSubmittime} disabled />
                                    </FormItem>
                                    <FormItem label='内容' labelCol={{span:1}} wrapperCol={{span:23}}>
                                        <Upload
                                            showUploadList={{showRemoveIcon:false}}
                                            onPreview={this.handlePreview}
                                            fileList={firstImgs}
                                            listType='picture-card'
                                        >
                                        </Upload>
                                    </FormItem>
                                </Form>
                                {
                                    !record.answerSecondImgPath
                                    ? <Divider style={{backgroundColor:'rgba(0,0,0,0.5)'}} />
                                    : null
                                }
                                {
                                    record.answerSecondImgPath
                                    ?   <Fragment>
                                            <Form >
                                                <FormItem label='再次' labelCol={{span:1}} wrapperCol={{span:3}} >
                                                    <Input value={record.answerSecondSubmittime} disabled />
                                                </FormItem>
                                                <FormItem label='内容' labelCol={{span:1}} wrapperCol={{span:23}}>
                                                    <Upload
                                                        showUploadList={{showRemoveIcon:false}}
                                                        onPreview={this.handlePreview}
                                                        fileList={secondImgs}
                                                        listType='picture-card'
                                                    >
                                                    </Upload>
                                                </FormItem>
                                            </Form>
                                            <Divider style={{backgroundColor:'rgba(0,0,0,0.5)'}} />
                                        </Fragment>
                                    :   null
                                }
                            </Fragment>
                            <Fragment>
                                {
                                    record.answerIsProcessed
                                    ?   <Fragment>
                                            <Form style={{display:'flex',align:'left'}}>
                                                <FormItem label='作业分数' {...formItemLayout}>
                                                    <Input disabled value={record.answerPoint} placeholder='未打分数' />
                                                </FormItem>
                                            </Form>
                                            <Form style={{display:'flex',align:'left'}}>
                                                <FormItem label='作业评语' {...formItemLayout}>
                                                    <TextArea
                                                        value={record.answerComment}
                                                        disabled
                                                        rows={4}
                                                    />
                                                </FormItem>
                                            </Form>
                                        </Fragment>
                                    :   null
                                }
                            </Fragment>
                            <Fragment>
                                {
                                    NormaltimeToTimestamp(moment()) < NormaltimeToTimestamp(record.classworkDeadline)
                                    ?   record.classworkType === '课堂作业' 
                                        ?   null
                                        :   record.answerFirstImgPath
                                            ?   <Form style={{display:'flex',align:'left'}}>
                                                    <FormItem label='上传情况' labelCol={{span:5}} wrapperCol={{span:19}}>
                                                        <Radio.Group defaultValue="a" buttonStyle="solid" onChange={this.handleSelectState}>
                                                            <Radio.Button value="a">首次重传</Radio.Button>
                                                            <Radio.Button value="b">第二次上传(重传)</Radio.Button>
                                                        </Radio.Group>
                                                    </FormItem>
                                                </Form>
                                            :   null
                                    :   null
                                }
                                {
                                    NormaltimeToTimestamp(moment()) < NormaltimeToTimestamp(record.classworkDeadline)
                                    ?   <Fragment>
                                            <Form >
                                                <FormItem label='答案上传' labelCol={{span:2}} wrapperCol={{span:22}}  >
                                                        <Upload
                                                            {...uploadProps}
                                                        >
                                                            <div>
                                                                <Icon type="plus" />
                                                                <div>上传图片(按住ctrl多选)</div>
                                                            </div>
                                                        </Upload>
                                                </FormItem>
                                            </Form>
                                            <Form>
                                                <FormItem style={{marginLeft:'75vw'}}>
                                                    <Button
                                                        type='primary'
                                                        loading={uploading}
                                                        disabled={uploadFiles.length===0}
                                                        onClick={this.handleUpload}
                                                    >
                                                        <Icon type='upload' />
                                                        提交
                                                    </Button>
                                                </FormItem>
                                            </Form>
                                        </Fragment>
                                    :   null
                                }
                            </Fragment>
                            <Modal 
                                visible={previewVisible} 
                                footer={null} 
                                onCancel={this.handleCancel}
                                width='45vw'
                                height='auto'
                            >
                                <img alt="example" style={{ width: '100%' }} src={previewImage} />
                            </Modal>
                        </Fragment>
                    :   null
                }
            </BasicLayoutForStu>
            
        )
    }
}

export default CheckReview