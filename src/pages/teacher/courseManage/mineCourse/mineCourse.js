/** 弃用 */

import React, { Component, Fragment } from 'react'
import { Modal, message, Table, Divider, ConfigProvider, Button, Spin, Popconfirm, Form, Icon, Alert, Input  } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import axios from 'axios'
import Qs from 'qs'

import { TimestampToNormaltime, NormaltimeToTimestamp } from '../../../../utils/timeFormat'
import { getItem, KEYS } from '../../../../utils/localStorage'
import BasicLayoutForTea from '../../../../components/BasicLayoutForTea/BasicLayoutForTea'

const FormItem = Form.Item

class MineCourse extends Component {
    constructor(props){
        super(props)
        this.state = {
            source: [],
            currentPage: 1,
            totalPages: 0,
            totalEntries: 0,
            visible: false,
            currentRecord:null,
            courseId:'',
            courseName:'',
            courseTimes:'',
            courseBeginTime:'',
            courseType:'',
            courseSize:''
        }
    }
    
    componentDidMount = () => {
        this.loadData()
    }

    loadData = async() => {
        const userId = getItem(KEYS.KEY_CUR_USER)
        if(userId){
            console.log(userId)
            const res = await axios.get('http://118.24.233.16:8080/homeworkManager/course/getbyteacherId?courseTeacherId='+userId)
            if(res && res.status===200){
                if(res.data){
                    const { data } = res
                    this.setState({
                        source:[...data]
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

    handleEdit = (record,index) => {
        this.setState({
            visible: true,
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
                }),
                headers: {'content-type': 'application/x-www-form-urlencoded'}
            })
            console.log('res',res)
            if(res && res.status===200){
                message.info('修改成功！！！',1)
                this.setState({
                    visible: false
                },()=>{
                    this.loadData()
                })
            }
        }
        else{
            console.log('xinxibuquan')
        }
    }
    handleCancel = () => {
        this.setState({
            visible: false
        })
    }
    handleConfirm = async(record) => {
        const res = await axios.get('http://118.24.233.16:8080/homeworkManager/course/del?courseId='+record.courseId)
        if(res && res.status===200){
            if(res.data && res.data==='ok'){
                message.info('删除成功！',1)
                this.loadData()
            }
            else{
                message.warn('未能删除该课程！',1)
            }
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


    render(){
        const {  source, currentRecord, visible } = this.state
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
        const columns = [
            {
                title:'课程ID',
                dataIndex:'courseId',
                key:'courseId'
            },
            {
                title:'课程名称',
                dataIndex:'courseName',
                key:'courseName',
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
                render: (text,record,index) => {
                    return TimestampToNormaltime(record.courseBeginTime)
                }
            },
            {
                title:'课程类型',
                dataIndex:'courseType',
                key:'courseType',
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
        return (
            <BasicLayoutForTea title='课程管理/我的课程'>
                <ConfigProvider locale={zhCN}>
                    <Fragment>
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
                    </Fragment>
                </ConfigProvider>
                {
                    visible &&  <Modal
                                    visible={visible}
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
            </BasicLayoutForTea>
        )
    }
}

export default MineCourse 