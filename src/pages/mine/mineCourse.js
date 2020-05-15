import React, { Component, Fragment } from 'react'
import { 
    Modal, 
    message, 
    Table, 
    Divider,
    ConfigProvider, 
    Button, 
    Popconfirm, 
    Form, 
    Icon, 
    Input,
    Spin 
} from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import axios from 'axios'
import Qs from 'qs'

import { TimestampToNormaltime, NormaltimeToTimestamp} from '../../utils/timeFormat'
import { getItem, KEYS } from '../../utils/localStorage'
import BasicLayoutForTea from '../../components/BasicLayoutForTea/BasicLayoutForTea'
import BasicLayoutForStu from '../../components/BasicLayoutForStu/BasicLayoutForStu'

const FormItem = Form.Item

class MineCourse extends Component {
    constructor(props){
        super(props)
        this.state = {
            userType:'',
            source: [],
            currentPage: 1,
            totalPages: 0,
            totalEntries: 0,
            edit_visible: false,
            check_visible: false,
            currentRecord:null,
            courseId:'',
            courseName:'',
            courseTimes:'',
            courseBeginTime:'',
            courseType:'',
            courseSize:'',

            searchText:'',
            searchedColumn:'',
        }
    }
    
    componentDidMount = () => {
        this.loadData()
    }

    loadData = async() => {
        const userType = getItem(KEYS.KEY_CUR_USERTYPE)
        console.log(userType)
        if(userType){
            this.setState({
                userType: userType
            })
            const userId = getItem(KEYS.KEY_CUR_USER)
            if(userId){
                if(userType==='student'){
                    const res = await axios.get('http://118.24.233.16:8080/homeworkManager/course/getbystudentId?studentId='+userId)
                    console.log(res)
                    if(res && res.status===200){
                        if(res.data){
                            if(res.data.length>0){
                                const { data } = res
                                this.setState({
                                    source:[...data]
                                })
                            }
                            else{
                                message.error(`${res.data}`,2)
                            }
                        }
                        else{
                            message.info('您目前还没有参加任何课程！！！',2)
                        }
                    }
                    else{
                        message.error(`${res.data}`,2)
                    }
                }
                else if(userType==='teacher'){
                    const res = await axios.get('http://118.24.233.16:8080/homeworkManager/course/getbyteacherId?courseTeacherId='+userId)
                    console.log(res)
                    if(res && res.status===200){
                        if(res.data){
                            if(res.data.length>0){
                                const { data } = res
                                this.setState({
                                    source:[...data]
                                })
                            }
                            else{
                                message.error(`${res.data}`,2)
                            }
                        }
                        else{
                            message.info('您目前还没有添加任何课程！！！',2)
                        }
                    }
                    else{
                        message.error(`${res.data}`,2)
                    }
                }
            }
        }
    }

    handlePageChange = (page) => {
        this.setState({
            currentPage: page
        })
    }

    handleEdit = (record,index) => {
        this.setState({
            edit_visible: true,
            currentRecord: record,
            courseId: record.courseId,
            courseName: record.courseName,
            courseTimes: record.courseTimes,
            courseBeginTime: record.courseBeginTime,
            courseTeacherId: record.courseTeacherId,
            courseType: record.courseType,
            courseSize: record.courseSize
        })
    }
    handleCheck = (record,index) => {
        this.setState({
            check_visible: true,
            currentRecord: record,
            courseId: record.courseId,
            courseName: record.courseName,
            courseTimes: record.courseTimes,
            courseBeginTime: record.courseBeginTime,
            courseTeacherId: record.courseTeacherId,
            courseType: record.courseType,
            courseSize: record.courseSize
        })
    }
    handleDelete = (record,index) => {
        this.setState({
            currentRecord: record
        })
    }
    handleOk = async() => {
        const { courseId, courseName, courseSize, courseTeacherId, courseTimes, courseType, courseBeginTime } = this.state
        console.log('courseId'+courseId, courseName, courseSize, courseTeacherId, courseTimes, courseType, courseBeginTime)
        console.log(Boolean(courseId && courseName && courseSize && courseTeacherId && courseTimes && courseType && courseBeginTime))
        if( courseId && courseName && courseSize && courseTeacherId && courseTimes && courseType && courseBeginTime ){
            const res = await axios({
                method:'post',
                url:'http://118.24.233.16:8080/homeworkManager/course/update',
                data: Qs.stringify({
                    courseId: 1,
                    courseName: courseName,
                    courseSize: courseSize,
                    courseTeacherId: courseTeacherId,
                    courseTimes: courseTimes,
                    courseType: courseType,
                    courseBeginTime: TimestampToNormaltime(courseBeginTime)
                })
            })
            console.log('res',res)
            if(res && res.status===200){
                if(res.data==='ok'){
                    message.info('修改成功！！！',2)
                    this.setState({
                        edit_visible: false
                    },()=>{
                        this.loadData()
                    })
                }
                else{
                    message.error('修改失败！！！',2)
                }
            }
            else{
                message.error('修改失败！！！',2)
            }
        }
        else{
            message.error('请先完善信息再提交！！！',2)
        }
    }
    handleCancel = () => {
        this.setState({
            edit_visible: false,
            check_visible: false
        })
    }
    handleConfirm = async(record) => {
        const res = await axios.get('http://118.24.233.16:8080/homeworkManager/course/del?courseId='+record.courseId)
        if(res && res.status===200){
            if(res.data && res.data==='ok'){
                message.info('删除成功！',2)
                this.loadData()
            }
            else{
                message.warn('未能删除该课程！',2)
            }
        }
        else{
            message.error(`${res.data}`,2)
        }
    }

    handleCourseNameChange = (e) => {
        this.setState({
            courseName: e.target.value
        })
    }
    handleCourseTimesChange = (e) => {
        this.setState({
            courseTimes: e.target.value
        })
    }
    handleCourseBeginTimeChange = (e) => {
        this.setState({
            courseBeginTime: e.target.value
        })
    }
    handleCourseTypeChange = (e) => {
        this.setState({
            courseType: e.target.value
        })
    }
    handleCourseSizeChange = (e) => {
        console.log('coursesize',e.target.value)
        this.setState({
            courseSize: e.target.value
        })
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


    render(){
        const {  source, currentRecord, edit_visible, check_visible, userType } = this.state
        console.log('data',this.state.currentRecord)
        const FormItemLayout = {
            labelCol: {
                xs: { span: 12 },
                sm: { span: 4 },
              },
              wrapperCol: {
                xs: { span: 18 },
                sm: { span: 12 },
              }
        }
        const columnsForTea = [
            {
                title:'课程ID',
                dataIndex:'courseId',
                key:'courseId',
                defaultSortOrder:'ascend',
                sorter:(a,b) => a.courseId - b.courseId
            },
            {
                title:'课程名称',
                dataIndex:'courseName',
                key:'courseName',
                ...this.getColumnsSearchProps('courseName')
            },
            {
                title:'课时量',
                dataIndex:'courseTimes',
                key:'courseTimes',
            },
            {
                title:'开始时间',
                dataIndex:'courseBeginTime',
                key:'courseBeginTime',
                defaultSortOrder:'ascend',
                sorter:(a,b) => NormaltimeToTimestamp(a.courseBeginTime) - NormaltimeToTimestamp(b.courseBeginTime)
            },
            {
                title:'课程类型',
                dataIndex:'courseType',
                key:'courseType',
                ...this.getColumnsSearchProps('courseType')
            },
            {
                title:'课程人数',
                dataIndex:'courseSize',
                key:'courseSize',
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
                                onClick={this.handleEdit.bind(this,record,index)}
                            >
                                编辑
                            </Button>
                            <Divider type="vertical"/>  
                            <Popconfirm
                                title="确定删除本课程？"
                                icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                                onConfirm={this.handleConfirm.bind(this,record,index)}
                            >
                                <Button 
                                    type='danger'
                                    size='small'
                                    onClick={this.handleDelete.bind(this,record,index)}
                                >
                                    删除
                                </Button>
                            </Popconfirm>    
                        </Fragment>
                    )
                }
            }
        ]
        const columnsForStu = [
            {
                title:'课程ID',
                dataIndex:'courseId',
                key:'courseId',
                defaultSortOrder:'ascend',
                sorter:(a,b) => a.courseId - b.courseId
            },
            {
                title:'课程名称',
                dataIndex:'courseName',
                key:'courseName',
                ...this.getColumnsSearchProps('courseName')
            },
            {
                title:'课时量',
                dataIndex:'courseTimes',
                key:'courseTimes',
            },
            {
                title:'开始时间',
                dataIndex:'courseBeginTime',
                key:'courseBeginTime',
                sorter:(a,b) => NormaltimeToTimestamp(a.courseBeginTime) - NormaltimeToTimestamp(b.courseBeginTime)
            },
            {
                title:'课程类型',
                dataIndex:'courseType',
                key:'courseType',
                ...this.getColumnsSearchProps('courseType')
            },
            {
                title:'课程人数',
                dataIndex:'courseSize',
                key:'courseSize'
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
                            <Popconfirm
                                title="确定退出本课程？"
                                icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                            >
                                <Button 
                                    type='danger'
                                    size='small'
                                >
                                    退出
                                </Button>
                            </Popconfirm>    
                        </Fragment>
                    )
                }
            }
        ]
        const columns = userType==='student'?columnsForStu:columnsForTea
        return (
            <Fragment>
                <Fragment>
                    {
                        userType === 'student'
                        ?   <BasicLayoutForStu title='课程管理/我的课程' describe='本页用于显示自己的所有课程'>
                            {
                                source && source.length>0
                                ?   <ConfigProvider locale={zhCN}>
                                        <Table
                                            columns={ columns }
                                            dataSource={source}
                                            rowKey={record => record.courseId}
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
                                :   <Spin 
                                        size='large'
                                        tip="Loading..." 
                                        className='spin'
                                    >
                                    </Spin>
                            }
                            </BasicLayoutForStu>
                        :   <BasicLayoutForTea title='课程管理/我的课程' describe='本页用于显示自己的所有课程'>
                                {
                                    source && source.length>0
                                    ?   <ConfigProvider locale={zhCN}>
                                            <Table
                                                columns={ columns }
                                                dataSource={source}
                                                rowKey={record => record.courseId}
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
                                    :   <Spin 
                                            size='large'
                                            tip="Loading..." 
                                            className='spin'
                                        >
                                        </Spin>
                                }
                            </BasicLayoutForTea>
                    }
                </Fragment>
                {
                    edit_visible &&  <Modal
                                    visible={edit_visible}
                                    //footer={null}
                                    closable={true}
                                    onOk={this.handleOk}
                                    onCancel={this.handleCancel}
                                >
                                    <Form {...FormItemLayout}>
                                        <FormItem label='课程ID'>
                                            <Input defaultValue={currentRecord.courseId} disabled />
                                        </FormItem>
                                        <FormItem label='任课教师ID'>
                                            <Input defaultValue={currentRecord.courseTeacherId} disabled />
                                        </FormItem>
                                        <FormItem label='课程名'>
                                            <Input 
                                                defaultValue={currentRecord.courseName} 
                                                onChange={this.handleCourseNameChange}
                                            />
                                        </FormItem>
                                        <FormItem label='课时数'>
                                            <Input 
                                                defaultValue={currentRecord.courseTimes} 
                                                onChange={this.handleCourseTimesChange}
                                            />
                                        </FormItem>
                                        <FormItem label='开始时间'>
                                            <Input 
                                                defaultValue={TimestampToNormaltime(currentRecord.courseBeginTime)} 
                                                onChange={this.handleCourseBeginTimeChange}
                                            />
                                        </FormItem>
                                        <FormItem label='课程类型'>
                                            <Input 
                                                defaultValue={currentRecord.courseType} 
                                                onChange={this.handleCourseTypeChange}
                                            />
                                        </FormItem>
                                        <FormItem label='课程人数'>
                                            <Input 
                                                defaultValue={currentRecord.courseSize} 
                                                onChange={this.handleCourseSizeChange}
                                            />
                                        </FormItem>
                                    </Form>
                                </Modal>
                }
                {
                    check_visible &&  <Modal
                                    title='课程详情'
                                    visible={check_visible}
                                    footer={null}
                                    closable={true}
                                    //onOk={this.handleOk}
                                    onCancel={this.handleCancel}
                                >
                                    <Form {...FormItemLayout}>
                                        <FormItem label='课程ID'>
                                            <Input defaultValue={currentRecord.courseId} disabled />
                                        </FormItem>
                                        <FormItem label='任课教师ID'>
                                            <Input defaultValue={currentRecord.courseTeacherId} disabled />
                                        </FormItem>
                                        <FormItem label='课程名'>
                                            <Input 
                                                defaultValue={currentRecord.courseName} 
                                                disabled
                                            />
                                        </FormItem>
                                        <FormItem label='课时数'>
                                            <Input 
                                                defaultValue={currentRecord.courseTimes} 
                                                disabled
                                            />
                                        </FormItem>
                                        <FormItem label='开始时间'>
                                            <Input 
                                                defaultValue={TimestampToNormaltime(currentRecord.courseBeginTime)} 
                                                disabled
                                            />
                                        </FormItem>
                                        <FormItem label='课程类型'>
                                            <Input 
                                                defaultValue={currentRecord.courseType} 
                                                disabled
                                            />
                                        </FormItem>
                                        <FormItem label='课程人数'>
                                            <Input 
                                                defaultValue={currentRecord.courseSize} 
                                                disabled
                                            />
                                        </FormItem>
                                    </Form>
                                </Modal>
                }
            </Fragment>
        )
    }
}

export default MineCourse 