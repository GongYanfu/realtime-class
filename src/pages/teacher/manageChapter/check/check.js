//姓名、学号、得分、持续时间
import React, { Component, Fragment } from 'react'
import { 
    Table,
    ConfigProvider,
    Button 
} from 'antd'
import { Link } from 'react-router-dom'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import BasicLayoutForTea from '../../../../components/BasicLayoutForTea/BasicLayoutForTea'


const data = [
    {
        schoolNumber:'2016220104001',
        userName:'张小果',
        score:95,
        duration:'10分28秒'
    },
    {
        schoolNumber:'2016220104002',
        userName:'李大国',
        score:90,
        duration:'7分15秒'
    },
    {
        schoolNumber:'2016220104003',
        userName:'狗蛋',
        score:95,
        duration:'9分28秒'
    }
]

class CheckChapters extends Component {
    constructor(props){
        super(props)
        this.state = {
            data: data,
            chapterName:'集合的初见'
        }
    }

    handleBack = () => {
        const { history } = this.props
        setTimeout(() => {
            history.push('/chapters/test')
        },500)
    }

    render(){
        const { data, chapterName } = this.state
        const columns = [
            {

                title:"学号",
                dataIndex:'schoolNumber',
                key:'schoolNumber',
                defaultSortOrder:'ascend',
                sorter:(a,b) => a.schoolNumber - b.schoolNumber
            },
            {
                title:'姓名',
                dataIndex:'userName',
                key:'userName',
            },
            {
                title:'得分',
                dataIndex:'score',
                key:'score'
            },
            {
                title:'持续时间',
                dataIndex:'duration',
                key:'duration'
            },
            {
                title:'操作',
                dataIndex:'actions',
                key:'actions',
                render: (text,record,index) => {
                    return (
                        <Fragment>
                            <Link to='#'>
                                <Button 
                                    type='primary' 
                                    size='small' 
                                    //onClick={this.handleToCorrect.bind(this,record,index)}
                                >
                                    查看
                                </Button>
                            </Link>           
                        </Fragment>
                    )
                }
            }
        ] 
        return(
            <BasicLayoutForTea title={`章节测评/${chapterName}`} describe='本页用于查看每章节测评的提交情况'>
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
                <ConfigProvider locale={zhCN}>     
                    <Table
                        columns={ columns }
                        dataSource={ data }
                        rowKey={record => record.schoolNumber }
                        bordered
                        pagination={{ //分页
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
            </BasicLayoutForTea>
        )
    }
}

export default CheckChapters