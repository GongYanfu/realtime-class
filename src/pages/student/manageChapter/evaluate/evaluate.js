import React, { Component, Fragment } from 'react'
import { 
    message,
    Radio,
    Checkbox,
    Button,
    Input,
    Icon,
    Popconfirm,
    Upload,
    Modal
} from 'antd'
import axios from 'axios'
import MathJax from 'react-mathjax-preview'
import Latex from 'react-latex'
import BasicLayoutForStu from '../../../../components/BasicLayoutForStu/BasicLayoutForStu'
import { getItem, KEYS } from '../../../../utils/localStorage'
import AutoKeyboard from '../../../student/keyboard/keyboard'

const CheckItems = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','H','I','J','K']

class Evaluate extends Component {
    constructor(props){
        super(props)
        this.state = {
            questions: [], //所有题目
            userInfo:{},
            Options:[], //每题的选项数
            chapter:'',
            courseId:'',
            analysis_vislble:false, //解析是否可见,
            answerTip_visible:[],
            selectedAnswers:[], //选择的选项数组
            FileList:[],
            previewImage:'',
            showModal:false,
            uploading: false,
            duration:0, //秒数
            hours:0,
            minutes:0,
            seconds:0,
            
            autoFocus:[],
            editAnswer:[]
        }
    }

    componentDidMount = () => {
        const chapterInfo = JSON.parse(getItem(KEYS.KEY_CUR_CHAPTER))
        const { chapter } = chapterInfo
        this.setState({
            chapter
        })
        this.loadData()
        let { duration } = this.state
        this.Timer = setInterval(() => {
            const h = Math.floor(duration /(60*60));
            const m = Math.floor((duration - h * (60*60)) /60);
            const s = Math.floor(duration - h *60*60 - m * 60);
            this.setState({
                duration: ++duration,
                hours: h,
                minutes: m,
                seconds: s
            })
        }, 1000)
    }

    componentWillUnmount = () =>{
        if (this.Timer != null) {
            clearInterval(this.Timer);
        }
    }

    loadData = async() => {
        const chapterInfo = JSON.parse(getItem(KEYS.KEY_CUR_CHAPTER))
        const userInfo = JSON.parse(getItem(KEYS.KEY_CUR_USERINFO))
        const { chapter, courseId } = chapterInfo
        this.setState({
            courseId,
            userInfo,
        })
        const res = await axios({
            url:'http://118.24.233.16:8080/homeworkManager/questionBank/getQuestionByChapter',
            method:'get',
            params:{
                chapter: chapter.nodename,
                courseId: courseId
            }
        })

        if(res && res.status===200){
            if(res.data){
                const { data } = res
                if(data.msg==='ok' || data.code===200){
                    const { data: content } = data
                    if(content){
                        const { choice, judge, multipleChoice, proof, calculation } = content
                        const questions = [...choice,...judge,...multipleChoice,...proof,...calculation].sort((a,b) => a.questionbankId-b.questionbankId)//所有题目按ID从小到大排序
                        if(questions && questions.length>0){
                            let answerTip_visible = []
                            let Options = []
                            let editAnswer = []
                            let autoFocus = []
                            questions.map((item,index) => {
                                let obj1 = { //用于解析的显示与否
                                    questionbankId: item.questionbankId,
                                    answer_visible: false
                                }
                                if(item.questionbankType==='计算题' || item.questionbankType==='证明题'){
                                    let obj2 = { //用于存储textArea框的内容
                                        questionbankId: item.questionbankId,
                                        answer: ''
                                    }
                                    let obj3 = { //用于各个TextArea框自动聚焦
                                        questionbankId: item.questionbankId,
                                        autoFocus: false
                                    }
                                    editAnswer = [...editAnswer, obj2]
                                    autoFocus = [...autoFocus, obj3]
                                }
                                answerTip_visible[index] = obj1                              
                                const Arr1 = Object.keys(item).filter(item1 => item1.match('questionbankOption'))
                                let options = []
                                Arr1.map((item1,index1) => {
                                    if(item[item1] !== ""){
                                        options = [...options,item1]
                                    }
                                    if(index1 === Arr1.length-1){
                                        Options[index] = options
                                    }
                                    return null
                                })
                                if(answerTip_visible.length === questions.length){
                                    this.setState({
                                        answerTip_visible,
                                        questions,
                                        Options,
                                        editAnswer,
                                        autoFocus
                                    })
                                }
                                return null
                            })
                        }
                    }
                }
            }
        }
        else{
            message.error('请求测评内容失败！！！',2)
        }
    }

    handleBack = () => {
        const { history } = this.props
        setTimeout(() => {
            history.push('/chapters/test')
        },500)
    }

    handleLookAnswer = (id,index) => {
        const { answerTip_visible } = this.state 
        const info = answerTip_visible.filter(item => item.questionbankId === id)[0]
        if(info.answer_visible === false){
            let obj = {
                questionbankId: id,
                answer_visible: true
            }
            answerTip_visible.splice(index,1,obj)
            this.setState({
                answerTip_visible
            })
        }
        else{
            let obj = {
                questionbankId: id,
                answer_visible: false
            }
            answerTip_visible.splice(index,1,obj)
            this.setState({
                answerTip_visible
            })
        }
    }
    handleRadioChange = (id,index,e) => {
        const { selectedAnswers } = this.state
        const selected =  selectedAnswers.filter(item => item.questionbankId===id)
        const obj = {
            questionbankId: id,
            selectedOption: e.target.value
        }
        if(selected.length===0){
            const newAnswers = [...selectedAnswers,obj]
            this.setState({
                selectedAnswers: newAnswers
            })
        }
        else{
            const index = selectedAnswers.indexOf(selected[0])
            selectedAnswers.splice(index,1,obj)
            this.setState({
                selectedAnswers
            })
        }
    }
    handleCheckboxChange = (id,index,checkedValue) => {
        const { selectedAnswers } = this.state
        const selected =  selectedAnswers.filter(item => item.questionbankId===id)
        const obj = {
            questionbankId: id,
            selectedOption: checkedValue
        }
        if(selected.length===0){
            const newAnswers = [...selectedAnswers,obj]
            this.setState({
                selectedAnswers: newAnswers
            })
        }
        else{
            const index = selectedAnswers.indexOf(selected[0])
            selectedAnswers.splice(index,1,obj)
            this.setState({
                selectedAnswers
            })
        }
    }


    /* keyboard输入 */
    handleTextAreaChange = (id, value) => {
        const { editAnswer, autoFocus } = this.state

        const focus = autoFocus.filter(item => item.questionbankId===id)[0]
        let index = autoFocus.indexOf(focus)
        const obj1 = {
            questionbankId:id,
            autoFocus: true
        }
        autoFocus.splice(index,1,obj1)
        this.setState({
            autoFocus
        })


        const answer = editAnswer.filter(item => item.questionbankId===id)
        const obj2 = {
            questionbankId: id,
            answer: value
        }
        if(answer.length===0){
            const newEditAnswers = [...editAnswer,obj2]
            this.setState({
                editAnswer: newEditAnswers
            })
        }
        else{
            const index = editAnswer.indexOf(answer[0])
            editAnswer.splice(index,1,obj2)
            this.setState({
                editAnswer
            })
        }

    }

    /* 图片上传的一些操作 */
    handleRemove = (classworkId,file) => {
        const {FileList} = this.state
        const index = FileList.indexOf(file)
        const newFileList = FileList.slice()
        newFileList.splice(index, 1)
        this.setState({
            FileList: newFileList
        })
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
        this.setState(state => ({
            FileList: [...state.FileList, file],
        }))
        return false
    }
    handleCancel = () => {
        this.setState({
            showModal: false
        })
    }

    handleSubmit = async() => {
        this.setState({
            uploading: true
        })
        const { selectedAnswers, questions, duration, chapter, courseId, userInfo } = this.state
        if (this.Timer != null) {
            clearInterval(this.Timer)
        }

        let newQuestions = []
        questions.map(async(item,index) => {
            const { questionbankId:id } = item
            if(selectedAnswers.filter(item => item.questionbankId===id)[0]){
                const { selectedOption } = selectedAnswers.filter(item => item.questionbankId===id)[0]
                item.questionbankAnswer = selectedOption
                newQuestions = [...newQuestions,item]
            }
        })
        if((newQuestions.length === selectedAnswers.length) || selectedAnswers.length===0){
            const formData = new FormData()
            formData.append('chapter',chapter.nodeid)
            formData.append('courseId',courseId)
            formData.append('duration',duration)
            formData.append('text',JSON.stringify(newQuestions))
            formData.append('studentId',userInfo.userId)
            const res = await axios({
                url:'http://118.24.233.16:8080/homeworkManager/questionBank/saveAnswer',
                method:'post',
                data: formData
            })
            if(res && res.status===200){
                const { data } = res
                const { msg, code, data:info } = data
                if(msg==='ok' || code===200){
                    message.info(info+'！！！' ,2)
                    this.setState({
                        analysis_vislble: true
                    })
                }
                else{
                    message.error('上传答题情况失败！！！',2)
                }
            }
            else{
                message.error('上传答题情况失败！！！',2)
            }
        }
    }

    render(){
        const { 
            questions, Options, analysis_vislble, answerTip_visible, 
            selectedAnswers, hours, seconds, minutes, chapter,showModal,
            previewImage, editAnswer, autoFocus
        } = this.state
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
            marginLeft:'0'
        }
        return (
            <BasicLayoutForStu 
                title={`章节测评/${chapter.nodeindex} ${chapter.nodename}`} 
                describe='本页用于参课学生章节测评'
            >
                <Fragment>
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
                {
                    questions && questions.length>0 
                    ?   <div>
                            <div
                                style={{
                                    position:'absolute',
                                    right:'5vw',
                                    top:'25vh',
                                    zIndex: 999
                                }}
                            >
                                <Input
                                    disabled
                                    value={`${hours} 时 ${minutes} 分 ${seconds} 秒`}
                                    style={{width:'10vw',backgroundColor:"#fff",textAlign:'center'}}
                                    size='small'
                                />
                            </div>
                            {
                                selectedAnswers.length === questions.length
                                ?   <Button
                                        size='small'
                                        type='primary'
                                        style={{
                                            position:'absolute',
                                            right:'5vw',
                                            top:'32vh',
                                            zIndex:999
                                        }}
                                        onClick={this.handleSubmit}
                                    >
                                        提 交
                                    </Button>
                                :   <Popconfirm
                                        title='您还有题目未回答，确定提交吗?'
                                        icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                                        okText='确定'
                                        cancelText='取消'
                                        onConfirm={this.handleSubmit}
                                        style={{zIndex:999}}
                                    >
                                        <Button
                                            size='small'
                                            type='primary'
                                            style={{
                                                position:'absolute',
                                                right:'5vw',
                                                top:'32vh',
                                                zIndex:999
                                            }}
                                        >
                                            提 交
                                        </Button>
                                    </Popconfirm>
                            }
                            {
                                questions.map((item,index) => {
                                    const { questionbankType } = item
                                    if(questionbankType==='单选题'){
                                        return  <div key={index} style={{width:'60vw',paddingBottom:'2vh'}}>
                                                    <div>
                                                        <span>{index + 1}. [{item.questionbankType}] </span>
                                                        {
                                                            item.questionbankInfo.indexOf('$')!==-1 ? <MathJax html={item.questionbankInfo} /> : item.questionbankInfo
                                                        }
                                                    </div>
                                                    <Radio.Group 
                                                        onChange={this.handleRadioChange.bind(this,item.questionbankId,index)}
                                                    >
                                                        {
                                                            Options[index].map((option,index) => {
                                                                return  <Radio style={radioStyle} value={CheckItems[index]} key={index}>
                                                                            <Latex>{CheckItems[index]+'. '+item[option]}</Latex>
                                                                        </Radio>
                                                            })
                                                        }
                                                    </Radio.Group>
                                                    <div>
                                                        <Button
                                                            size='small'
                                                            type='danger'
                                                            style={{display: analysis_vislble===false?'none':'block'}}
                                                            onClick={this.handleLookAnswer.bind(this,item.questionbankId,index)}
                                                        >
                                                            解析
                                                        </Button>
                                                        <div 
                                                            style={{
                                                                display: answerTip_visible.filter(a => a.questionbankId===item.questionbankId)[0].answer_visible===false?'none':'block' ,
                                                                border:'1px solid rgba(0,0,0,0.2)',
                                                                backgroundColor:"#f17e95"
                                                            }}
                                                        >
                                                            <p>答案解析：</p>
                                                            <div >
                                                                <MathJax math={item.questionbankCue1} />
                                                                <MathJax math={item.questionbankCue2} />
                                                                <MathJax math={item.questionbankCue3} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                    }
                                    else if(questionbankType==='多选题'){
                                        return  <div key={index} style={{width:'60vw',paddingBottom:'2vh'}}>
                                                    <div>
                                                        <span>{index + 1}. [{item.questionbankType}] </span>
                                                        {
                                                            item.questionbankInfo.indexOf('$')!==-1 ? <MathJax html={item.questionbankInfo} /> : item.questionbankInfo
                                                        }
                                                    </div>
                                                    <Checkbox.Group 
                                                        onChange={this.handleCheckboxChange.bind(this,item.questionbankId,index)}
                                                    >
                                                        {
                                                            Options[index].map((option,index) => {
                                                                return  <Checkbox style={radioStyle} value={CheckItems[index]} key={index}>
                                                                            {item[option].indexOf('$')!==-1 ? <MathJax html={`${CheckItems[index]}. ${item[option]}`} /> : `${CheckItems[index]}. ${item[option]}`}
                                                                        </Checkbox>
                                                            })
                                                        }
                                                    </Checkbox.Group>
                                                    <div style={{display: analysis_vislble===false?'none':'block'}}>
                                                        <Button
                                                            size='small'
                                                            type='danger'
                                                            onClick={this.handleLookAnswer.bind(this,item.questionbankId,index)}
                                                        >
                                                            解析
                                                        </Button>
                                                        <div 
                                                            style={{
                                                                display: answerTip_visible.filter(a => a.questionbankId===item.questionbankId)[0].answer_visible===false?'none':'block' ,
                                                                border:'1px solid rgba(0,0,0,0.2)',
                                                                backgroundColor:"#f17e95"
                                                            }}
                                                        >
                                                            <p>答案解析：</p>
                                                            <div >
                                                                <MathJax math={item.questionbankCue1} />
                                                                <MathJax math={item.questionbankCue2} />
                                                                <MathJax math={item.questionbankCue3} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                    }
                                    else if(questionbankType==='判断题'){
                                        return  <div key={index} style={{width:'60vw',paddingBottom:'2vh'}}>
                                                    <div>
                                                        <span>{index + 1}. [{item.questionbankType}] </span>
                                                        {
                                                            item.questionbankInfo.indexOf('$')!==-1 ? <MathJax html={item.questionbankInfo} /> : item.questionbankInfo
                                                        }
                                                    </div>
                                                    <Radio.Group 
                                                        onChange={this.handleRadioChange.bind(this,item.questionbankId,index)} 
                                                    >
                                                        <Radio style={radioStyle} value={'T'}>
                                                            {item.questionbankOption1}
                                                        </Radio>
                                                        <Radio style={radioStyle} value={'F'}>
                                                            {item.questionbankOption2}
                                                        </Radio>
                                                    </Radio.Group>
                                                    <div style={{display: analysis_vislble===false?'none':'block'}}>
                                                        <Button
                                                            size='small'
                                                            type='danger'
                                                            onClick={this.handleLookAnswer.bind(this,item.questionbankId,index)}
                                                        >
                                                            解析
                                                        </Button>
                                                        <div 
                                                            style={{
                                                                display: answerTip_visible.filter(a => a.questionbankId===item.questionbankId)[0].answer_visible===false?'none':'block' ,
                                                                border:'1px solid rgba(0,0,0,0.2)',
                                                                backgroundColor:"#f17e95"
                                                            }}
                                                        >
                                                            <p>答案解析：</p>
                                                            <div >
                                                                <MathJax math={item.questionbankCue1} />
                                                                <MathJax math={item.questionbankCue2} />
                                                                <MathJax math={item.questionbankCue3} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                    }
                                    else if(questionbankType==='计算题'){
                                        return  <div key={index} style={{width:'60vw',paddingBottom:'3vh'}}>
                                                    <div >
                                                        <span>{index + 1}. [{item.questionbankType}] </span>
                                                        <MathJax math={item.questionbankInfo} />
                                                    </div>
                                                    <Upload
                                                        onPreview={this.handlePreview}
                                                        //onRemove={this.handleRemove.bind(this,item.questionbankId)}
                                                        beforeUpload={this.beforeUploadFile}
                                                        listType='picture-card'
                                                        multiple={true}
                                                    >
                                                        <div>
                                                            <Icon type="plus" />
                                                            <div>上传图片(按住ctrl多选)</div>
                                                        </div>
                                                    </Upload>
                                                    {
                                                        item.questionbankKeyboard  &&   <AutoKeyboard
                                                                                            ref={`autoKeyboard${item.questionbankId}`}
                                                                                            symbols={item.questionbankKeyboard}
                                                                                            id={item.questionbankId}
                                                                                            onFocus={this.handleFocus}
                                                                                            editAnswer={editAnswer}
                                                                                            onChange={this.handleTextAreaChange}
                                                                                        />
                                                    }
                                                    <div style={{display: analysis_vislble===false?'none':'block'}}>
                                                        <Button
                                                            size='small'
                                                            type='danger'
                                                            onClick={this.handleLookAnswer.bind(this,item.questionbankId,index)}
                                                        >
                                                            解析
                                                        </Button>
                                                        <div 
                                                            style={{
                                                                display: answerTip_visible.filter(a => a.questionbankId===item.questionbankId)[0].answer_visible===false?'none':'block' ,
                                                                border:'1px solid rgba(0,0,0,0.2)',
                                                                backgroundColor:"#f17e95"
                                                            }}
                                                        >
                                                            <p>答案解析：</p>
                                                            <div>
                                                                <MathJax math={item.questionbankCue1} />
                                                                <MathJax math={item.questionbankCue2} />
                                                                <MathJax math={item.questionbankCue3} /> 
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                    }
                                    else if(questionbankType==='证明题'){
                                        return  <div key={index} style={{paddingBottom:'3vh'}}>
                                                    <div style={{width:'60vw'}}>
                                                        <span>{index + 1}. [{item.questionbankType}] </span>
                                                        <MathJax math={item.questionbankInfo} />
                                                    </div>
                                                    <Upload
                                                        onPreview={this.handlePreview}
                                                        //onRemove={this.handleRemove.bind(this,item.questionbankId)}
                                                        beforeUpload={this.beforeUploadFile}
                                                        listType='picture-card'
                                                        multiple={true}
                                                    >
                                                        <div>
                                                            <Icon type="plus" />
                                                            <div>上传图片(按住ctrl多选)</div>
                                                        </div>
                                                    </Upload>
                                                    {
                                                        item.questionbankKeyboard  &&   <AutoKeyboard
                                                                                            symbols={item.questionbankKeyboard}
                                                                                            id={item.questionbankId}
                                                                                            autoFocus={autoFocus}
                                                                                            editAnswer={editAnswer}
                                                                                            onChange={this.handleTextAreaChange}
                                                                                        />
                                                    }
                                                    <div style={{display: analysis_vislble===false?'none':'block'}}>
                                                        <Button
                                                            size='small'
                                                            type='danger'
                                                            onClick={this.handleLookAnswer.bind(this,item.questionbankId,index)}
                                                        >
                                                            解析
                                                        </Button>
                                                        <div 
                                                            style={{
                                                                width:'60vw',
                                                                display: answerTip_visible.filter(a => a.questionbankId===item.questionbankId)[0].answer_visible===false?'none':'block' ,
                                                                border:'1px solid rgba(0,0,0,0.2)',
                                                                backgroundColor:"#f17e95"
                                                            }}
                                                        >
                                                            <p>答案解析：</p>
                                                            <div>
                                                                <MathJax math={item.questionbankCue1} />
                                                                <MathJax math={item.questionbankCue2} />
                                                                <MathJax math={item.questionbankCue3} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                    }
                                    return null
                                })
                            }
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
                    :   null
                }
                </Fragment>
            </BasicLayoutForStu>
        )
    }
}

export default Evaluate