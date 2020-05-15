import React, { Component, Fragment } from 'react'
import { 
    Modal, 
    message, 
    Table, 
    Divider, 
    ConfigProvider, 
    Button,  
    Form, 
    Input, 
    Icon,
    Select  
} from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import axios from 'axios'
import moment from 'moment'
import { getItem, KEYS, setItem } from '../../../../utils/localStorage'
import { NormaltimeToTimestamp } from '../../../../utils/timeFormat'
import BasicLayoutForStu from '../../../../components/BasicLayoutForStu/BasicLayoutForStu'
import CheckForm from '../check/check'
import UploadForm from '../upload/upload'

const FormItem = Form.Item
const { Option } = Select

class Seatwork extends Component {
    constructor(props){
        super(props)
        this.state = {
            classworkTitle: '',
            courseName:'',
            classworks: null,
            currentPage: 1,
            totalPages: 0,
            totalEntries: 0,
            current: 1,
            check_visible: false,
            upload_visible: false,
            currentRecord:null,
            courses:[],

            searchText:"",
            searchedColumn:"",

            filteredInfo: null,
            sortedInfo: null
        }
    }

    componentDidMount = () => { 
        this.loadAllSeatworks()
        this.loadAllCourses()
    }
    
    loadAllSeatworks = async() => {
        const { userId } = JSON.parse(getItem(KEYS.KEY_CUR_USERINFO))
        let classworks = []
        let allClassworks = []
        let allCourses = []
        let allAnswers = []
        let seatworks = []
        const res1 = await axios({
            url:'http://118.24.233.16:8080/homeworkManager/classwork/getbyStudentId',
            method:'get',
            params:{
                studentId: userId
            }
        })
        if(res1 && res1.status===200){
            if(res1.data && res1.data.length>0){
                const { data} = res1
                allClassworks = [...data]
                const res2 = await axios({
                    url:'http://118.24.233.16:8080/homeworkManager/course/getbystudentId',
                    method:'get',
                    params:{
                        studentId: userId
                    }
                })
                if(res2 && res2.status===200){
                    if(res2.data && res2.data.length>0){
                        const { data} = res2
                        allCourses = [...data]
                    }
                    else{
                        message.error('请求课程数据失败！！！',2)
                    }
                }
                else{
                    message.error('请求课程数据失败！！！',2)
                }
            }
            else{
                message.error('请求作业数据失败！！！',2)
            }
        }
        else{
            message.error('请求作业数据失败！！！',2)
        }
        if(allCourses && allClassworks){
            let newData = []//课tang作业信息+课程信息
            allClassworks.map((classwork,index1) => {
                const { classworkCourseId } = classwork
                allCourses.map((course,index2) => {
                    const { courseId } = course
                    if(courseId === classworkCourseId){
                        let obj = {}
                        newData[index1] = Object.assign(obj,classwork, course)
                    }
                    return null
                })
                return null
            })
            if(newData.length === allClassworks.length){
                seatworks = newData.filter(item => item.classworkType === '课堂作业')
                if(seatworks.length===0){
                    message.info('暂无课堂作业！！！',2)
                }
            }
        }
        if(seatworks && seatworks.length>0){
            let IDs = []
            seatworks.map((item,index) => {
                IDs[index] = item.classworkId
                return null
            })
            if(IDs.length === seatworks.length){
                IDs.map(async(item,index) => {
                    const res = await axios({
                        url: 'http://118.24.233.16:8080/homeworkManager/answer/getByStudentAndClasswork',
                        method: 'get',
                        params:{
                            classworkId: item,
                            studentId: userId
                        }
                    })
                    if(res && res.status===200){
                        if(res.data){
                            allAnswers = [...allAnswers,res.data]
                        }
                        else{
                            const answer = {
                                answerClassworkId: item,
                                answerComment:null,
                                answerFirstImgPath:null,
                                answerFirstSubmittime: null,
                                answerIsProcessed:null,
                                answerPoint: null,
                                answerSecondImgPath: null,
                                answerSecondSubmittime: null,
                                answerStudentId: userId
                            }
                            allAnswers = [...allAnswers,answer]
                        }
                        if(allAnswers.length === IDs.length){
                            seatworks.map((item1,index1) =>{
                                const { classworkId } = item1
                                allAnswers.map((item2,index2) => {
                                    const { answerClassworkId } = item2
                                    if(classworkId === answerClassworkId){
                                        let obj = {}
                                        classworks[index1] = Object.assign(obj,item1,item2)
                                    }
                                    return null
                                })
                                if(classworks.length === seatworks.length){
                                    this.setState({
                                        classworks
                                    })
                                }
                                return null
                            })
                        }
                    }
                    else{
                        message.error('请求作业提交情况失败！！！',2)
                    }
                })
            }
            return null
        }
    }
    loadAllCourses = async() => {
        const userInfo = JSON.parse(getItem(KEYS.KEY_CUR_USERINFO))
        const { userId } = userInfo
        if(userId){
            const res = await axios({
                url:'http://118.24.233.16:8080/homeworkManager/course/getbystudentId',
                method:'get',
                params:{
                    studentId: userId
                }
            })
            if(res && res.status===200){
                if(res.data && res.data.length>0){
                    this.setState({
                        courses: res.data
                    })
                }
                else{
                    message.info('您是否参加课程？？',2)
                }
            }
            else{
                message.error('获取课程数据失败！！',2)
            }
        }
    }

    handleCourseNameSelect = (value,option) => {
        this.setState({
            courseName: value
        })
    }
    handleClassworkTitleChange = (e) => {
        if(e.target.value===''){
            this.loadAllSeatworks()
        }
        else{
            this.setState({
                classworkTitle: e.target.value
            })
        }
    }
    handleFindByCourseName = async() => {
        const { courseName, classworks } = this.state
        if(classworks && classworks.length>0){
            let newData = classworks.filter((item,index) => item.courseName.match(courseName))
            if(newData && newData.length>0){
                this.setState({
                    classworks: newData
                })
            }
            else{
                this.setState({
                    classworks: null
                })
            }
        }
    }
    handleFindByClassworkTitle = async() => {
        const { classworkTitle, classworks } = this.state
        if(classworks && classworks.length>0){
            let newData = classworks.filter((item,index) => item.classworkTitle.match(classworkTitle))
            if(newData && newData.length>0){
                this.setState({
                    classworks: newData
                })
            }
            else{
                this.setState({
                    classworks: null
                })
            }
        }
    }

    handlePageChange = (page) => {
        this.setState({
            currentPage: page
        })
    }

    handleCancel = (record,index) => {
        this.setState({
            check_visible: false,
            upload_visible: false
        })
    }

    handleCheck = (record,index) => {
        if(record.answerFirstImgPath){
            setItem(KEYS.KEY_CUR_CLASSWORK,JSON.stringify(record))
            const { history } = this.props
            setTimeout(()=>{
                history.push('/checkReview')
            },500)
        }
        else{
            this.setState({
                check_visible: true,
                currentRecord: record
            })
        }
    }

    handleUpload = (record,index) => {
        if(record.answerFirstImgPath){
            setItem(KEYS.KEY_CUR_CLASSWORK,JSON.stringify(record))
            const { history } = this.props
            setTimeout(()=>{
                history.push('/checkReview')
            },500)
        }
        else{
            this.setState({
                upload_visible: true,
                currentRecord: record
            })
        }
    }


    handleSearch = (selectedKeys,confirm,dataIndex) => {
        confirm()
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex
        })
    }
    handleReset = (clearFilters) => {
         clearFilters()
         this.setState({
             searchText:''
         })
    }
    getColumnsSearchProps = (dataIndex) => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{padding:8}}>
                <Input
                    ref={node => {
                        this.searchInput = node
                    }}
                    placeholder={`search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys,confirm,dataIndex)}
                    style={{width:'10vw',marginBottom:'1vh', display:"block"}}
                />
                <Button
                    type='primary'
                    size='small'
                    icon='search'
                    onClick={() => this.handleSearch(selectedKeys,confirm,dataIndex)}
                    style={{width:75,marginRight:5}}
                >
                    Search
                </Button>
                <Button
                    size='small'
                    onClick={() => this.handleReset(clearFilters)}
                    style={{width:75}}
                >
                    Reset
                </Button>
            </div>
        ),
        filterIcon: (filtered) => (
            <Icon
                type='search'
                style={{
                    color: filtered ? '#1890ff' : undefined
                }}
            />
        ),
        onFilter:(value,record) => 
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
            onFilterDropdownVisiblChange: (visible) => {
                if(visible){
                    setTimeout(() => this.searchInput.select());
                }
            }
    })

    handleTableChange = (pagination,filters,sorter) => {
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter
        })
    }
    clearFilters = () => {
        this.setState({
            filteredInfo: null
        })
    }

    render(){
        const {  classworks, currentRecord, check_visible, upload_visible, courses } = this.state
        let { filteredInfo } = this.state
        //sortedInfo = sortedInfo || {}
        filteredInfo = filteredInfo || {}
        const columns = [
            {
                title:'作业ID',
                dataIndex:'classworkId',
                key:'classworkId',
                defaultSortOrder:'descend',
                sorter: (a,b) => a.classworkId - b.classworkId
            },
            {
                title:'作业名称',
                dataIndex:'classworkTitle',
                key:'classworkTitle',
                ...this.getColumnsSearchProps('classworkTitle')
            },
            {
                title:'课程名称',
                dataIndex:'courseName',
                key:'courseName',
                ...this.getColumnsSearchProps('courseName')
            },
            {
                title:'开始时间',
                dataIndex:'classworkBegintime',
                key:'classworkBegintime'
            },
            {
                title:'截止时间',
                dataIndex:'classworkDeadline',
                key:'classworkDeadline'
            },
            {
                title:'提交状态',
                dataIndex:'state',
                key:'state',
                filters:[{text:'已提交',value:'answerFirstImgPath'},{text:'未提交',value:""}],
                filteredValue: filteredInfo.state || null,
                onFilter:(value,record) =>  value==='answerFirstImgPath' ? record[value] : !record['answerFirstImgPath'] ,
                render:(text,record,index) => {
                    if(record.answerFirstImgPath){
                        return '已提交'
                    }
                    else{
                        return null
                    }
                }
            },
            {
                title:'批阅状态',
                dataIndex:'isProcessed',
                key:'isProcessed',
                render: (text,record,index) => {
                    if(record.answerFirstImgPath){
                        if(record.answerIsProcessed==='1'){
                            return '已批阅'
                        }
                        else{
                            return '未批阅'
                        }
                    }
                    else{
                        return null
                    }
                }
            },
            {
                title:'操作',
                dataIndex:'actions',
                key:'actions',
                render: (text,record,index) => {
                    return (  
                        <Fragment>
                            <Button 
                                type='primary' 
                                size='small' 
                                onClick={this.handleCheck.bind(this,record,index)}
                            >
                                查看
                            </Button>
                            {
                                NormaltimeToTimestamp(moment()) < NormaltimeToTimestamp(record.classworkDeadline)
                                ?   record.answerFirstImgPath !== null
                                    ?   <Fragment>
                                            <Divider type="vertical"/>  
                                            <Button 
                                                type='danger'
                                                size='small'
                                                onClick={this.handleUpload.bind(this,record,index)}
                                            >
                                                重传
                                            </Button>
                                        </Fragment>
                                    :   <Fragment>
                                            <Divider type="vertical"/>  
                                            <Button 
                                                type='danger'
                                                size='small'
                                                onClick={this.handleUpload.bind(this,record,index)}
                                            >
                                                上传
                                            </Button>
                                        </Fragment>
                                : null
                            }
                        </Fragment>
                    )
                }
            }
        ] 

        
        return (
            <BasicLayoutForStu title={'作业管理/课堂作业'} describe='本页用于展示所有课堂作业'>
                {
                    /* classworks && classworks.length>0
                    ? */   <Fragment>
                            <Form  
                                layout='inline' 
                                style={{
                                    display:'flex',
                                    paddingBottom:'3vh',
                                    paddingLeft:"2vw"
                                }}>
                                <FormItem 
                                    label="课程名" 
                                >
                                    <Select 
                                        onChange={this.handleCourseNameSelect}
                                        onBlur={this.handleFindByCourseName}
                                        notFoundContent={'请确认您是否已经创建课程？？？'}
                                        placeholder='点击输入框选择课程'
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
                                <FormItem 
                                    label="作业名" 
                                >
                                    <Input 
                                        onChange={this.handleClassworkTitleChange} 
                                        onPressEnter={this.handleFindByClassworkTitle}
                                    />
                                </FormItem>
                            </Form>
                            <ConfigProvider locale={zhCN}>
                                <Table
                                    columns={ columns }
                                    dataSource={classworks&&classworks.length>0 ? classworks : null}
                                    rowKey={record => record.classworkId}
                                    bordered
                                    pagination={{ // 分页
                                        showQuickJumper: true, 
                                        hideOnSinglePage:true,
                                        current: this.state.currentPage, 
                                        showSizeChanger:true,
                                        pageSize: 7,
                                        total: this.state.totalEntries, 
                                        onChange: this.handlePageChange
                                    }}
                                    onChange={this.handleTableChange}
                                    style={{margin:'0 1.5rem'}}
                                />  
                            </ConfigProvider>
                        </Fragment>
                   /*  :   <Spin
                            size='large'
                            tip="Loading..."
                            className='spin'
                        >
                        </Spin> */
                }
                {
                    check_visible && <Modal
                                        title='作业详情'
                                        visible={check_visible}
                                        footer={null}
                                        closable={true}
                                        onCancel={this.handleCancel}
                                    >
                                        <CheckForm record={currentRecord} />
                                    </Modal>
                }
                {
                    upload_visible && <Modal
                                        title='上传作业'
                                        width='45vw'
                                        visible={upload_visible}
                                        footer={null}
                                        closable={true}
                                        onCancel={this.handleCancel}
                                    >
                                        <UploadForm record={currentRecord} onCancel={this.handleCancel} onLoad={this.loadAllSeatworks} />
                                    </Modal>
                }
            </BasicLayoutForStu>
        )
    }
}

export default Seatwork
