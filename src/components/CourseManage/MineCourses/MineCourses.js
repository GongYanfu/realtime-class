import React, { Component, Fragment } from 'react'
import { Modal, message, Table, Divider, Avatar, ConfigProvider, Button  } from 'antd'

import zhCN from 'antd/lib/locale-provider/zh_CN';

import './MineCourses.css'

const courses = [
    {
        id:'1909017a-1',
        term:'2018-2019-2',
        name:'离散数学',
        credit:4,
        type:'考试',
        ID:2
    },
    {
        id:'1909017b-1',
        term:'2018-2019-2',
        name:'离散数学',
        credit:3,
        type:'考查',
        ID:7
    },
    {
        id:'1909017c-1',
        term:'2018-2019-2',
        name:'离散数学',
        credit:2,
        type:'考试',
        ID:4
    },
    {
        id:'1909017a-1',
        term:'2018-2019-2',
        name:'离散数学',
        credit:4,
        type:'考试',
        ID:2
    },
    {
        id:'1909017b-1',
        term:'2018-2019-2',
        name:'离散数学',
        credit:3,
        type:'考查',
        ID:7
    },
    {
        id:'1909017c-1',
        term:'2018-2019-2',
        name:'离散数学',
        credit:2,
        type:'考试',
        ID:4
    },{
        id:'1909017a-1',
        term:'2018-2019-1',
        name:'离散数学',
        credit:4,
        type:'考试',
        ID:2
    },
    {
        id:'1909017b-1',
        term:'2018-2019-1',
        name:'离散数学',
        credit:3,
        type:'考查',
        ID:7
    },
    {
        id:'1909017c-1',
        term:'2018-2019-1',
        name:'离散数学',
        credit:2,
        type:'考试',
        ID:4
    }
]


class CourseList extends Component {
    constructor(props){
        super(props)
        this.state = {
            searchOrgName: '',
            source: courses,
            currentPage: 1,
            totalPages: 0,
            totalEntries: 0,
            current: 1,
            isSearched: false,
            add_visible: false,
            revoke_visible: false,
            currentRecord:null
        }
    }

    handlePageChange = (page) => {
        this.setState({
            currentPage: page
        })
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
        )
    }
}

export default CourseList