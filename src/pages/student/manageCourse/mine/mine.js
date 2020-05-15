import React,{ Component, Fragment } from 'react'
import { 
    Table, 
    Divider,
    Avatar, 
    ConfigProvider,
    Button  
} from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import BasicLayoutForStu from '../../../../components/BasicLayoutForStu/BasicLayoutForStu'
import { getItem, KEYS } from '../../../../utils/localStorage'
import axios from 'axios'

import './mine.css'

class MineCourse extends Component{
    constructor(props){
        super(props)
        this.state = {
            source:null,
            currentPage: 1,
            totalPages: 0,
            totalEntries: 0,
            current: 1,
            currentRecord:null
        }
    }

    componentDidMount = () => {
        this.loadData()
    }

    loadData = async() => {
        const studentId = getItem(KEYS.KEY_CUR_USER)
        if(studentId){
            const res = await axios({
                url: 'http://118.24.233.16:8080/homeworkManager/course/getbystudentId',
                method: 'get',
                params:{
                    studentId: studentId
                }
            })
            console.log('res',res)
        }
    }

    handlePageChange = (page) => {
        this.setState({
            currentPage: page
        })
        //this.loadData()
    }

    handleEdit = (record,index) => {
        this.setState({
            add_visible: true,
            currentRecord: record
        })
    }
    handleDelete = (record,index) => {
        this.setState({
            revoke_visible: true,
            currentRecord: record
        })
    }

    handleOK = () => {
        this.setState({
            add_visible: false,
            revoke_visible: false
        })
    }

    handleCancel = () => {
        this.setState({
            add_visible: false,
            revoke_visible: false
        })
    }

    render(){
        const { source } = this.state
        console.log('data',this.state.currentRecord)
        const columns = [
            {
                title:'课程号',
                dataIndex:'id',
                key:'id'
            },
            {
                title:'学期',
                dataIndex:'term',
                key:'term',
            },
            {
                title:'课程名',
                dataIndex:'name',
                key:'name',
            },
            {
                title:'学分',
                dataIndex:'credit',
                key:'credit',
            },
            {
                title:'类型',
                dataIndex:'type',
                key:'type',
            },
            {
                title:'ID',
                dataIndex:'ID',
                key:'ID',
            },
            {
                title:'操作',
                dataIndex:'actions',
                key:'actions',
                render: (text,record,index) => {
                    console.log(record,index)
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
                            <Button 
                                type='danger'
                                size='small'
                                onClick={this.handleDelete.bind(this,record,index)}
                            >
                                删除
                            </Button>                         
                        </Fragment>
                    )
                }
            }
        ] 
        return (
            <BasicLayoutForStu title='课程管理/我的课程'>
                <ConfigProvider locale={zhCN}>     
                    <Table
                        columns={ columns }
                        dataSource={source}
                        rowKey={record => record.id}
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
            </BasicLayoutForStu>
        )
    }
}

export default MineCourse