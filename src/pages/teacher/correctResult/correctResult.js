import React, { Component, Fragment } from 'react'
import { 
    Form,  
    Icon,
    Input, 
    Upload,
    Modal,
    Button, 
    message,
    Dropdown,
    Menu
} from 'antd'
import axios from 'axios'
//import Cropper from 'react-cropper'
//import 'cropperjs/dist/cropper.css'
import BasicLayoutForTea from '../../../components/BasicLayoutForTea/BasicLayoutForTea'
import { getItem, KEYS } from '../../../utils/localStorage'


const FormItem = Form.Item
const { TextArea } = Input
const comments = [
    '书写工整、认真，批改认真，改错完整',
    '书写潦草，批改认真，改错完整',
    '书写认真、批改认真，未完全改错',
    '书写潦草，批改认真，未完全改错',
    '部分完成作业，认真批改并纠错',
    '书写潦草，批改不认真，不改错',
    '未提交作业'
]

class CorrectResult extends Component {
    constructor(props){
        super(props)
        this.state = {
            answerClassworkId:'',
            answerFirstImgPath:'',
            answerFirstSubmittime:'',
            answerId:'',
            answerIsProcessed:'',
            answerPoint:'',
            answerComment:'',
            answerSecondImgPath:'',
            answerSecondSubmittime:'',
            firstImageLength:0,
            secondImageLength:0,


            studentAnswers:[],
            currentIndex:0, //当前学生作业作答的index


            fileList1:null,
            fileList2:null,
            fileList3:null,
            fileList4:null,
            previewImage:'',
            previewVisible:false,
            uploading:false,
            comment:'',
            classwork:null,
            name:'',
            studentSchoolNumber:'',

            //src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3675415932,4054970339&fm=26&gp=0.jpg',
			//croppedImageUrl:''
        }
    }

    handleCrop = () => {
		this.setState({
			croppedImageUrl: this.refs.cropper.getCroppedCanvas().toDataURL()
		})
    }
    
    componentDidMount = () => {
        this.loadData()
    }
    loadData = async() =>{
        const Id= getItem(KEYS.KEY_CUR_ANSWER) //当前学生答案answerId
        const classwork = JSON.parse(getItem(KEYS.KEY_CUR_CLASSWORK))//当前作业信息
        const studentAnswers = JSON.parse(getItem(KEYS.KEY_CUR_ANSWERS))//当前项作业的已答题学生的答题情况
        if(classwork && studentAnswers && Id){
            this.setState({
                studentAnswers
            })
            const currentIndex = studentAnswers.findIndex(item => item.answerId===Number(Id))
            if(currentIndex !== -1){
                this.setState({
                    currentIndex
                })
            }
            const { classworkFile, classworkReference } = classwork
            const files = classworkFile.split('|').filter(item => item!=='')
            const references = classworkReference.split('|').filter(item => item!=='')
            if(files && files.length>0){
                let newFiles = []
                files.map((item,index) => {
                    let obj = {
                        uid: index,
                        name: `image${index}`,
                        status:'done',
                        url:'http://118.24.233.16:8080'+item
                    }
                    newFiles[index] = obj
                    if(newFiles.length === files.length){
                        this.setState({
                            fileList3: newFiles
                        })
                    }
                    return null
                })
            }
            if(references && references.length>0){
                let newFiles = []
                references.map((item,index) => {
                    let obj = {
                        uid: index,
                        name: `image${index}`,
                        status:'done',
                        url:'http://118.24.233.16:8080'+item
                    }
                    newFiles[index] = obj
                    if(newFiles.length === references.length){
                        this.setState({
                            fileList4: newFiles
                        })
                    }
                    return null
                })
            }
        }
        if(Id){
            const res = await axios({
                url:'http://118.24.233.16:8080/homeworkManager/answer/getById',
                method:'get',
                params:{
                    answerId: Id
                }
            })
            const { data } = res
            const{
                answerClassworkId,
                answerFirstImgPath,
                answerFirstSubmittime,
                answerId,
                answerIsProcessed,
                answerPoint,
                answerComment,
                answerSecondImgPath,
                answerSecondSubmittime,
                name,
                studentSchoolNumber
            } = data
            if(answerFirstImgPath){
                let Arr1 = []
                const array = answerFirstImgPath.split("|").filter(item => item!=='')
                array.map((item,index) => {
                    let obj = {
                        uid: index,
                        name:`firstanswer${index}`,
                        status:'done',
                        url:'http://118.24.233.16:8080'+item
                    }
                    Arr1[index] = obj
                    if(Arr1.length===array.length){
                        this.setState({
                            fileList1: [...Arr1]
                        })
                    }
                    return null
                })
            }
            if(answerSecondImgPath){
                let Arr2 = []
                const array = answerSecondImgPath.split("|").filter(item => item!=='')
                array.map((item,index) => {
                    let obj = {
                        uid: index,
                        name:`secondanswer${index}`,
                        status:'done',
                        url:'http://118.24.233.16:8080'+item
                    }
                    Arr2[index] = obj
                    if(Arr2.length===array.length){
                        this.setState({
                            fileList2: [...Arr2]
                        })
                    }
                    return null
                })
            }
            if(data){
                this.setState({
                    answerClassworkId,
                    answerFirstImgPath,
                    answerFirstSubmittime,
                    answerId,
                    answerIsProcessed,
                    answerPoint,
                    comment: answerComment,
                    answerSecondImgPath,
                    answerSecondSubmittime,
                    name,
                    studentSchoolNumber
                })
            }
        }
    }
    handleBack = () => {
        const { history } = this.props
        setTimeout(()=> {
            history.push('/resultTable')
        },500)
    }
    handleToNext = () => {
        const { currentIndex } = this.state
        const studentAnswers = JSON.parse(getItem(KEYS.KEY_CUR_ANSWERS))//当前项作业的已答题学生的答题情况
        if((currentIndex+1) < studentAnswers.length)
        {
            const nextAnswer = studentAnswers[currentIndex+1]
            this.setState({
                currentIndex: currentIndex+1
            })
            const{
                answerClassworkId,
                answerFirstImgPath,
                answerFirstSubmittime,
                answerId,
                answerIsProcessed,
                answerPoint,
                answerComment,
                answerSecondImgPath,
                answerSecondSubmittime,
                name,
                studentSchoolNumber
            } = nextAnswer
            if(answerFirstImgPath){
                let Arr1 = []
                const array = answerFirstImgPath.split("|").filter(item => item!=='')
                array.map((item,index) => {
                    let obj = {
                        uid: index,
                        name:`firstanswer${index}`,
                        status:'done',
                        url:'http://118.24.233.16:8080'+item
                    }
                    Arr1[index] = obj
                    if(Arr1.length===array.length){
                        this.setState({
                            fileList1: [...Arr1]
                        })
                    }
                    return null
                })
            }
            if(answerSecondImgPath){
                let Arr2 = []
                const array = answerSecondImgPath.split("|").filter(item => item!=='')
                array.map((item,index) => {
                    let obj = {
                        uid: index,
                        name:`secondanswer${index}`,
                        status:'done',
                        url:'http://118.24.233.16:8080'+item
                    }
                    Arr2[index] = obj
                    if(Arr2.length===array.length){
                        this.setState({
                            fileList2: [...Arr2]
                        })
                    }
                    return null
                })
            }
            else{
                this.setState({
                    fileList2:null
                })
            }
            if(nextAnswer){
                this.setState({
                    answerClassworkId,
                    answerFirstImgPath,
                    answerFirstSubmittime,
                    answerId,
                    answerIsProcessed,
                    answerPoint,
                    comment: answerComment,
                    answerSecondImgPath,
                    answerSecondSubmittime,
                    name,
                    studentSchoolNumber
                })
            }
        }
        else{
            message.info('当前已经是最后一位同学！！！',2)
        }
    }
    handleToBefore = () => {
        const { currentIndex } = this.state
        const studentAnswers = JSON.parse(getItem(KEYS.KEY_CUR_ANSWERS))//当前项作业的已答题学生的答题情况
        if((currentIndex-1) >= 0 )
        {
            const beforeAnswer = studentAnswers[currentIndex-1]
            this.setState({
                currentIndex: currentIndex-1
            })
            const{
                answerClassworkId,
                answerFirstImgPath,
                answerFirstSubmittime,
                answerId,
                answerIsProcessed,
                answerPoint,
                answerComment,
                answerSecondImgPath,
                answerSecondSubmittime,
                name,
                studentSchoolNumber
            } = beforeAnswer
            if(answerFirstImgPath){
                let Arr1 = []
                const array = answerFirstImgPath.split("|").filter(item => item!=='')
                array.map((item,index) => {
                    let obj = {
                        uid: index,
                        name:`firstanswer${index}`,
                        status:'done',
                        url:'http://118.24.233.16:8080'+item
                    }
                    Arr1[index] = obj
                    if(Arr1.length===array.length){
                        this.setState({
                            fileList1: [...Arr1]
                        })
                    }
                    return null
                })
            }
            if(answerSecondImgPath){
                let Arr2 = []
                const array = answerSecondImgPath.split("|").filter(item => item!=='')
                array.map((item,index) => {
                    let obj = {
                        uid: index,
                        name:`secondanswer${index}`,
                        status:'done',
                        url:'http://118.24.233.16:8080'+item
                    }
                    Arr2[index] = obj
                    if(Arr2.length===array.length){
                        this.setState({
                            fileList2: [...Arr2]
                        })
                    }
                    return null
                })
            }
            else{
                this.setState({
                    fileList2:null
                })
            }
            if(beforeAnswer){
                this.setState({
                    answerClassworkId,
                    answerFirstImgPath,
                    answerFirstSubmittime,
                    answerId,
                    answerIsProcessed,
                    answerPoint,
                    comment: answerComment,
                    answerSecondImgPath,
                    answerSecondSubmittime,
                    name,
                    studentSchoolNumber
                })
            }
        }
        else{
            message.info('当前已经是第一位同学！！！',2)
        }
    }
    handlePreview = file => {
        this.setState({
          previewImage: file.url,
          previewVisible: true,
        })
    }
    handleCancel = () => {
        this.setState({
            previewVisible: false
        })
    }
    handleReset = () => {
        window.location.reload()
    }
    handleCommentChange = (e) => {
        this.setState({
            comment: e.target.value
        })
    }
    handleClick = (e) => {
        const {comment:remark} = this.state
        const index =  Number(e.key)
        if(remark){
            const comment = remark.concat('\n').concat(comments[index])
            this.setState({
                comment
            })
        }
        else{
            const comment = comments[index]
            this.setState({
                comment
            })
        }
    }
    handleUpload = async() => {
        const { answerId, comment } = this.state
        if(answerId && comment){
            this.setState({
                uploading: true
            })
            const res = await axios({
                url:'http://118.24.233.16:8080/homeworkManager/answer/mark',
                method:'get',
                params:{
                    answerId: answerId,
                    mark: comment
                }
            })
            if(res && res.status===200){
                if(res.data==='ok'){
                    message.info('作业批阅成功！！！',2)
                    this.setState({
                        uploading: false
                    })
                }
                else{
                    message.error ('作业批阅失败！！！',2)
                    this.setState({
                        uploading: false
                    })
                }
            }
            else{
                message.error ('作业批阅失败！！！',2)
                this.setState({
                    uploading: false
                })
            }
        }
        else{
            message.warn('请为学生作业打评语！！！',2)
        }
    }


    render(){ 
        const { 
            name,
            comment,
            answerFirstSubmittime,
            answerSecondSubmittime,
            studentSchoolNumber,
            fileList1,
            fileList2,
            fileList3,
            fileList4,
            previewImage,
            previewVisible,
            uploading,
            //croppedImageUrl,
            //src
        } = this.state
        const formItemLayout1 = {
            labelCol: {span:2},
            wrapperCol:{span:5}
        }
        const formItemLayout2 = {
            labelCol: {span:2},
            wrapperCol:{span:22}
        }
        const ButtonItemLayout = {
            wrapperCol: { 
                span: 5, 
                offset:2
            }
        }
        const menu = (
            <Menu onClick={this.handleClick}>
              <Menu.Item key='0'>
                <div>
                    书写工整、认真，批改认真，改错完整
                </div>
              </Menu.Item>
              <Menu.Item key='1'>
                <div>
                    书写潦草，批改认真，改错完整
                </div>
              </Menu.Item>
              <Menu.Item key='3'>
                <div>
                    书写认真、批改认真，未完全改错
                </div>
              </Menu.Item>
              <Menu.Item key='4'>
                <div>
                    书写潦草，批改认真，未完全改错
                </div>
              </Menu.Item>
              <Menu.Item key='5'>
                <div>
                    部分完成作业，认真批改并纠错
                </div>
              </Menu.Item>
              <Menu.Item key='6'>
                <div>
                    书写潦草，批改不认真，不改错
                </div>
              </Menu.Item>
            </Menu>
        )

        return (
            <BasicLayoutForTea title='作业管理/作业批改' describe='本页用于老师批改某个学生的具体作业'>
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
                    <Form style={{position:'relative'}}>
                        <FormItem label='学生号' {...formItemLayout1}>
                            <Input disabled value={studentSchoolNumber} />
                        </FormItem>
                        <FormItem label='姓 名' {...formItemLayout1}>
                            <Input disabled value={name} />
                        </FormItem>
                        <FormItem label='内 容' {...formItemLayout2}>
                            <Upload
                                showUploadList={{
                                    showRemoveIcon: false
                                }}
                                fileList={fileList3}
                                listType='picture-card'
                                onPreview={this.handlePreview}
                            >
                            </Upload>
                        </FormItem>
                        <FormItem label='答 案' {...formItemLayout2}>
                            <Upload
                                showUploadList={{
                                    showRemoveIcon: false
                                }}
                                fileList={fileList4}
                                listType='picture-card'
                                onPreview={this.handlePreview}
                            >
                            </Upload>
                        </FormItem>
                        {
                            fileList1
                            ?   <Fragment>
                                    <FormItem label='首次时间' {...formItemLayout1}>
                                        <Input disabled value={answerFirstSubmittime} />
                                    </FormItem>
                                    <FormItem label='首次内容' {...formItemLayout2}>
                                        <Upload
                                            showUploadList={{
                                                showRemoveIcon: false
                                            }}
                                            fileList={fileList1}
                                            listType='picture-card'
                                            onPreview={this.handlePreview}
                                        >
                                        </Upload>
                                    </FormItem>
                                </Fragment>
                            : null
                        }
                        {
                            fileList2
                            ?   <Fragment>
                                    <FormItem label='第二次时间' {...formItemLayout1}>
                                        <Input disabled value={answerSecondSubmittime} />
                                    </FormItem>
                                    <FormItem label='第二次内容' {...formItemLayout2}>
                                        <Upload
                                            showUploadList={{
                                                showRemoveIcon: false
                                            }}
                                            fileList={fileList2}
                                            listType='picture-card'
                                            onPreview={this.handlePreview}
                                        >
                                        </Upload>
                                    </FormItem>
                                </Fragment>
                            : null
                        }
                        <FormItem label='作业评语' {...formItemLayout1}>
                            <Fragment>
                                <TextArea 
                                    style={{height:'15vh',width:'50vw'}} 
                                    placeholder='留言~~~' 
                                    onChange={this.handleCommentChange}
                                    value={comment}
                                />
                                <Dropdown overlay={menu}>
                                    <Button type='primary'>
                                        常 用 评 语
                                        <Icon type='down'/>
                                    </Button>
                                </Dropdown>
                            </Fragment>
                        </FormItem>
                        <FormItem {...ButtonItemLayout}>
                            <Button.Group>
                                <Button 
                                    type="danger"
                                    onClick={this.handleReset}
                                >
                                    <Icon type="delete" />
                                    重&nbsp;&nbsp;置
                                </Button>
                                <Button 
                                    type="primary"
                                    loading={uploading}
                                    onClick={this.handleUpload}
                                >
                                    <Icon type="upload" />
                                    提&nbsp;&nbsp;交
                                </Button>
                            </Button.Group>
                            <Button.Group>
                                <Button 
                                    type="primary"
                                    onClick={this.handleToBefore}
                                >
                                    <Icon type="double-left" />
                                    上一位
                                </Button>
                                <Button 
                                    type="primary"
                                    onClick={this.handleToNext}
                                >
                                    下一位
                                    <Icon type="double-right" />
                                </Button>
                            </Button.Group>
                        </FormItem>
                    </Form>
                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                    {/* <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                        <Cropper
                            ref='cropper'
                            src={src}
                            guides={false}
                            crop={this.handleCrop}
                            autoCropArea={0.5}				
                        />
                        {
                            croppedImageUrl && <img alt="Crop" style={{ maxWidth: "100%" }} src={croppedImageUrl} />
                        }
                    </Modal> */}
                    </Fragment> 
            </BasicLayoutForTea>
        )
    }
}

export default CorrectResult
