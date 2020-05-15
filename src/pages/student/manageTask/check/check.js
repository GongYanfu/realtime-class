import React,{ Component } from 'react'
import { Form, Input, Upload, Modal } from 'antd'
import { TimestampToNormaltime } from '../../../../utils/timeFormat'

const FormItem = Form.Item
const formItemLayout = {
    labelCol: {
        xs: { span: 8 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 12 },
      }
}

class CheckForm  extends Component{
    constructor(props){
        super(props)
        this.state = {
            record: this.props.record,
            FileList1: [],
            FileList2:[],
            previewImage:'',
            previewVisible: false
        }
    }

    componentDidMount = () => {
        const { record } = this.props
        if(record){
            const { classworkFile, classworkReference, answerFirstImgPath} = record
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
                            FileList1: [...newData]
                        })
                    }
                    return null
                })
            }
            if(answerFirstImgPath){
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
                                FileList2: [...newData]
                            })
                        }
                        return null
                    })
                }
            }
        }
    }

    handlePreview = file => {
        if(file.url){
            this.setState({
                previewImage: file.url ,
                previewVisible: true,
            })
        }
    }

    handleCancel = () => {
        this.setState({
            previewVisible: false
        })
    }

    render(){
        const { record, FileList1, FileList2, previewImage, previewVisible } = this.state
        return (
            <Form {...formItemLayout}>
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
                    <Input disabled value={
                        TimestampToNormaltime(record.classworkBegintime)
                    } />
                </FormItem>
                <FormItem label='截止时间' >
                    <Input disabled value={
                        TimestampToNormaltime(record.classworkDeadline)
                    } />
                </FormItem>
                <FormItem label='作业内容' labelCol={{span:4}} wrapperCol={{span:20}}>
                    <Upload
                        showUploadList={{
                            showRemoveIcon: false
                        }}
                        onPreview={this.handlePreview}
                        fileList={FileList1}
                        listType="picture-card"
                    >
                    </Upload>
                </FormItem>
                {
                    record.answerFirstImgPath
                    ?   <FormItem label='作业答案' labelCol={{span:4}} wrapperCol={{span:20}}>
                            <Upload
                                showUploadList={{
                                    showRemoveIcon: false
                                }}
                                onPreview={this.handlePreview}
                                fileList={FileList2}
                                listType='picture-card'
                            >
                            </Upload>
                        </FormItem>
                    : null
                }
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