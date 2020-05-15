/** update以及图片展示功能 */
import React, { Component, Fragment } from 'react'
import { 
    Modal,
    message, 
    Table, 
    Divider, 
    ConfigProvider, 
    Button, 
    Select, 
    Form, 
    Spin,
    Input,
    Icon
} from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import ModifyForm from './ModifyForm/ModifyForm'
import CheckForm from './CheckForm/CheckForm'
import moment from 'moment'
import axios from 'axios'
import BasicLayoutForTea from '../../../components/BasicLayoutForTea/BasicLayoutForTea'
import { getItem, KEYS } from '../../../utils/localStorage'

import './manage.css'
import { NormaltimeToTimestamp } from '../../../utils/timeFormat';


const { Option } = Select
const FormItem = Form.Item
const classworkTypes  = ['课堂作业','课后作业']

class AllTasks extends Component {
    constructor(props){
        super(props)
        this.state = {
            courses:[],
            classworks: null,
            currentPage: 1,
            totalPages: 0,
            totalEntries: 0,
            current: 1,
            isSearched: false,
            currentRecord:null,
            courseName:'',
            classworkType:'',
            check_visible: false,
            modify_visible: false,

            searchText:'',
            searchedColumn:'',

            filteredInfo:null,
            sortedInfo:null
        }
    }

    componentDidMount = () => {
        this.loadAllClassworks()
        this.loadAllCourses()
    }
    componentWillUnmount(){
        clearTimeout(this.loadAllClassworks);
        clearTimeout(this.loadAllCourses);
    }

    loadAllClassworks = async() => {
        const teacherId = JSON.parse(getItem(KEYS.KEY_CUR_USERINFO)).userId
        const res = await axios.get('http://118.24.233.16:8080/homeworkManager/classwork/getByTeacherId?teacherId='+teacherId)
        if(res && res.status===200){
            if(res.data && res.data.length>0){
                const { data} = res
                let newData = []
                data.map(async(item, index) => {
                    const { classworkCourseId:courseId } = item
                    const res = await axios.get('http://118.24.233.16:8080/homeworkManager/course/getbycourseId?courseId=' + courseId)
                    if(res && res.status===200){
                        if(res.data){
                            const {courseName} = res.data
                            const obj1 = {
                                'courseName': courseName
                            }
                            let obj = {}
                            newData = [...newData,Object.assign(obj, item, obj1)]
                            if(newData.length === data.length){
                                this.setState({
                                    classworks: newData
                                })
                            }
                        }
                    }
                })
            }
        }
    }

    loadAllCourses = async() => {
        const teacherId = JSON.parse(getItem(KEYS.KEY_CUR_USERINFO)).userId
        const res = await axios.get('http://118.24.233.16:8080/homeworkManager/course/getbyteacherId?courseTeacherId='+teacherId)
        if(res && res.status===200){
            if(res.data && res.data.length>0){
                var Arr = []
                res.data.map((item,index) => {
                    Arr = [...Arr,item]
                    return null
                })
                this.setState({
                    courses: [...Arr]
                })
            }
            else{
                message.info('您是否创建课程？？',2)
            }
        }
        else{
            message.error('获取课程数据失败！！',2)
        }
    }

    handleCourseNameSelect = (value,option) => {
        this.setState({
            courseName: value
        })
    }
    handleFindByCourseName = async() => {
        const {courseName} = this.state
        if(courseName){
            const teacherId = JSON.parse(getItem(KEYS.KEY_CUR_USERINFO)).userId
            const res = await axios.get('http://118.24.233.16:8080/homeworkManager/classwork/getByTeacherId?teacherId='+teacherId)
            if(res && res.status===200){
                if(res.data && res.data.length>0){
                    const { data} = res
                    const newData = []
                    data.map(async(item, index) => {
                        const { classworkCourseId:courseId } = item
                        const res = await axios.get('http://118.24.233.16:8080/homeworkManager/course/getbycourseId?courseId=' + courseId)
                        if(res && res.status===200){
                            if(res.data){
                                const {courseName} = res.data
                                const obj1 = {
                                    'courseName': courseName
                                }
                                const obj = {}
                                newData[index] = Object.assign(obj, item, obj1)
                            }
                        }
                        this.setState({
                            classworks: newData.filter(item => item.courseName===String(courseName))
                        })
                    })
                }
            }
        }
    }
    handleClassworkTypeSelect = (value,option) => {
        this.setState({
            classworkType: value
        })
    }
    handleFindByClassworkType = async() => {
        const {classworkType}  = this.state
        if(classworkType){
            const teacherId = JSON.parse(getItem(KEYS.KEY_CUR_USERINFO)).userId
            const res = await axios.get('http://118.24.233.16:8080/homeworkManager/classwork/getByTeacherId?teacherId='+teacherId)
            if(res && res.status===200){
                if(res.data && res.data.length>0){
                    const { data} = res
                    const newData = []
                    data.map(async(item, index) => {
                        const { classworkCourseId:courseId } = item
                        const res = await axios.get('http://118.24.233.16:8080/homeworkManager/course/getbycourseId?courseId=' + courseId)
                        if(res && res.status===200){
                            if(res.data){
                                const {courseName} = res.data
                                const obj1 = {
                                    'courseName': courseName
                                }
                                const obj = {}
                                newData[index] = Object.assign(obj, item, obj1)
                            }
                        }
                        this.setState({
                            classworks: newData.filter(item => item.classworkType===String(classworkType))
                        })
                    })
                }
            }
        }
    }

    handlePageChange = (page) => {
        this.setState({
            currentPage: page
        })
    }
    handleCheck = (record,index) => {
        this.setState({
            check_visible: true,
            currentRecord: record
        })
    }
    handleModify = (record,index) => {
        this.setState({
            modify_visible: true,
            currentRecord: record
        })
    }

    handleOK = () => {
        this.setState({
            check_visible: false,
            modify_visible: false
        })
    }
    handleCancel = () => {
        this.setState({
            check_visible: false,
            modify_visible: false
        })
    }
    handlePageReset = ()=>{
        window.location.reload()
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
                    placeholder={`${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys,confirm,dataIndex)}
                    style={{width:120,marginBottom:'1vh', display:"block"}}
                />
                <Button
                    type='primary'
                    size='small'
                    icon='search'
                    onClick={() => this.handleSearch(selectedKeys,confirm,dataIndex)}
                    style={{width:65,marginRight:5}}
                >
                    搜索
                </Button>
                <Button
                    size='small'
                    onClick={() => this.handleReset(clearFilters)}
                    style={{width:50}}
                >
                    重置
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
        const { classworks, check_visible, modify_visible, currentRecord, courses } = this.state
        let { filteredInfo } = this.state
        filteredInfo = filteredInfo || {}
        const columns = [
            {
                title:'作业ID',
                dataIndex:'classworkId',
                key:'classworkId',
                defaultSortOrder:'descend',
                sorter: (a, b) => a.classworkId - b.classworkId
            },
            {
                title:'作业名称',
                dataIndex:'classworkTitle',
                key:'classworkTitle',
                ...this.getColumnsSearchProps('classworkTitle')
            },
            {
                title:'作业类型',
                dataIndex:'classworkType',
                key:'classworkType',
                ...this.getColumnsSearchProps('classworkType')
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
                key:'classworkBegintime',
                defaultSortOrder:'ascend',
                sorter:(a,b) => NormaltimeToTimestamp(a.classworkBegintime) - NormaltimeToTimestamp(b.classworkBegintime)
            },
            {
                title:'截止时间',
                dataIndex:'classworkDeadline',
                key:'classworkDeadline',
                defaultSortOrder:'ascend',
                sorter:(a,b) => NormaltimeToTimestamp(a.classworkDeadline) - NormaltimeToTimestamp(b.classworkDeadline)
            },
            {
                title: '状态',
                dataIndex:'classworkState',
                key:'classworkState',
                filters:[{text:'已截止',value:'classworkDeadline'},{text:'进行中',value:'deadline'}],
                filteredValue: filteredInfo.state || null,
                onFilter:(value,record) =>  value==='classworkDeadline' ? NormaltimeToTimestamp(record[value]) <= moment() : NormaltimeToTimestamp(record['classworkDeadline'])>moment(),
                render:(text,record,index) => {
                    if(moment()>NormaltimeToTimestamp(record.classworkDeadline)){
                        return '已截止'
                    }
                    else{
                        return '进行中'
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
                            <Divider type="vertical"/>  
                            <Button 
                                type='danger'
                                size='small'
                                onClick={this.handleModify.bind(this,record,index)}
                            >
                                修改
                            </Button>             
                        </Fragment>
                    )
                }
            }
        ] 
        return (
            <BasicLayoutForTea title='作业管理/作业管理' describe='本页用于管理自己所发布过的所有作业'>
                    {
                        classworks && classworks.length>0
                        ?   <Fragment>
                                <Form  layout='inline' style={{display:'flex',marginLeft:'2vw', marginBottom:'2vh'}}>
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
                                    <FormItem label='作业类型'>
                                    <Select 
                                            onChange={this.handleClassworkTypeSelect}
                                            onBlur={this.handleFindByClassworkType}
                                            notFoundContent={'请确认您是否已经创建课程？？？'}
                                            placeholder='点击选择作业类型'
                                            style={{width:'12vw'}}
                                        >
                                            {
                                                classworkTypes.map((item,index) => {
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
                                        style={{margin:'0 1.5rem'}}
                                    />    
                                </ConfigProvider>
                            </Fragment>
                        :   <Spin 
                                size='large'
                                tip="Loading..." 
                                className='spin'
                            >
                            </Spin>
                    }
                {
                    check_visible && <Modal
                                    visible={check_visible}
                                    title='作业详情'
                                    onCancel={this.handleCancel}
                                    onOk={this.handleOK}
                                    footer={null}
                                    closable={true}
                                >
                                    <CheckForm record={currentRecord} />
                                </Modal>   
                }
                {
                    modify_visible && <Modal
                                    visible={modify_visible}
                                    title='作业更新'
                                    onCancel={this.handleCancel}
                                    onOk={this.handleOK}
                                    footer={null}
                                    closable={true}
                                >
                                    <ModifyForm 
                                        record={currentRecord} 
                                        courses={courses}
                                        onCancel={this.handleCancel}
                                        onLoad={this.handlePageReset}
                                    />
                                </Modal>   
                }
            </BasicLayoutForTea>
        )
    }
}

export default AllTasks