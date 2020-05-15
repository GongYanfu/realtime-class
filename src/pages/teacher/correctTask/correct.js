import React, { Component, Fragment } from 'react'
import {
    Icon, 
    Table, 
    ConfigProvider, 
    Button, 
    Form, 
    Input, 
    message,
    Card,
    Tabs,
    Row,
    Col
} from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { CSVLink } from "react-csv";

import moment from 'moment'
import { getItem, KEYS, setItem } from '../../../utils/localStorage'
import { NormaltimeToTimestamp } from '../../../utils/timeFormat'
import BasicLayoutForTea from '../../../components/BasicLayoutForTea/BasicLayoutForTea'

import './correct.css'

const FormItem = Form.Item
const { TabPane } = Tabs

class ResultTable extends Component {
    constructor(props){
        super(props)
        this.state = {
            user: '',
            classwork: '',
            source1:null,//至少提交一次
            source2:null,//未提交
            info:null,//提交情况
            currentPage: 1,
            totalPages: 0,
            totalEntries: 0,
            current: 1,
            tabKey:'1',
            csvData:[
                ['学号','姓名']
            ], //导出excel时的数据

            searchText:'',
            searchedColumn:'',

            filteredInfo:null,
            sortedInfo:null
        }
    }

    componentDidMount = () => {
        this.loadData()
    }

    loadData = async() => {
        const currentClasswork = JSON.parse(getItem(KEYS.KEY_CUR_CLASSWORK))
        this.setState({
            classwork: currentClasswork
        })
        const { classworkId } = currentClasswork

        const res1 = await axios({
            method: 'get',
            url:'http://118.24.233.16:8080/homeworkManager/answer/getAllbyClassworkId',
            params:{
                classworkId: classworkId
            }
        })
        if(res1 && res1.status===200){
            const { data } = res1
            if(data && data.length>0){
                const corrected = data.filter(item => item.answerIsProcessed==='1')
                const unCorrected = data.filter(item => item.answerIsProcessed!=='1')
                console.log('corected',corrected)
                console.log('unCorrected',unCorrected)
                this.setState({
                    source1: [...unCorrected,...corrected]
                })
            }
            else{
                message.info('该项作业到目前为止还没有任何学生作答！！',2)
            }
        }
        else{
            message.error('请求数据失败！！',2)
        }

        const res2 = await axios({
            url:'http://118.24.233.16:8080/homeworkManager/classwork/simpleClassworkInfo',
            method:'get',
            params:{
                classworkId: classworkId
            }
        })
        if(res2 && res2.status===200){
            if(res2.data){
                this.setState({
                    info: res2.data
                })
            }
        }
        else{
            message.error('请求作业提交情况失败！！！',2)
        }

        const res3 = await axios({
            url:'http://118.24.233.16:8080/homeworkManager/classwork/NotReceived',
            method:'get',
            params:{
                classworkId: classworkId
            }
        })
        if(res3 && res3.status===200){
            if(res3.data){
                let data = []
                res3.data.map((item) => {
                    const { studentSchoolNumber, name } = item
                    const newItem = [studentSchoolNumber+'\t', name]
                    data = [...data, newItem]
                    return null
                })
                if(data.length === res3.data.length){
                    this.setState({
                        source2: res3.data, //未提交名单
                        csvData: data //导出数据
                    })
                }
            }
        }
        else{
            message.error('请求未提交数据失败！！！',2)
        }
    }

    handleBack = () =>{
        const { history } = this.props
        setTimeout(()=> {
            history.push('/taskTable')
        },500)
    }

    TabChange = (key)=> {
        this.setState({
            tabKey:key
        })
    }

    handleViewResult = (record,index) => {
        const { source1 } = this.state
        setItem(KEYS.KEY_CUR_ANSWER,record.answerId)
        setItem(KEYS.KEY_CUR_ANSWERS,JSON.stringify(source1))
    }
    handleTextAreaChange = (e) => {
        this.setState({
            note: e.target.value
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

    handleTableChange = (pagination,filters,sorter) => {
        this.setState({
            filteredInfo: filters,
            sortedInfo1: sorter
        })
    }
    clearFilters = () => {
        this.setState({
            filteredInfo: null
        })
    }

    
    render(){
        const { source1, source2, classwork, info, tabKey, csvData} = this.state
        let { filteredInfo } = this.state
        console.log(source1)
        console.log(csvData)
        filteredInfo = filteredInfo || {}
        const formItemLayout1 = {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 }
        }
        const columns1 = [
            {
                title:'答案ID',
                dataIndex:'answerId',
                key:'answerId'
            },
            {
                title:'学生姓名',
                dataIndex:'name',
                key:'name',
                ...this.getColumnsSearchProps('name')
            },
            {
                title:'学号',
                dataIndex:'studentSchoolNumber',
                key:'studentSchoolNumber',
                ...this.getColumnsSearchProps('studentSchoolNumber')
            },
            {
                title:'首次提交',
                dataIndex:'answerFirstImgPath',
                key:'answerFirstImgPath',
                render:(text,record,index) => {
                    if(record.answerFirstImgPath ){
                        return <Icon type="check" style={{color:'#1890ff'}} />
                    }
                    else{
                        return <Icon type='close' style={{color:'red'}} />
                    }
                }
            },
            {
                title:'提交时间',
                dataIndex:'answerFirstSubmittime',
                key:'answerFirstSubmittime'
            },
            {
                title:'二次提交',
                dataIndex:'answerSecondImgPath',
                key:'answerSecondImgPath',
                render:(text,record,index) => {
                    if(record.answerSecondImgPath){
                        return <Icon type="check" style={{color:'#1890ff'}} />
                    }
                    else{
                        return <Icon type='close' style={{color:'red'}} />
                    }
                }
            },
            {
                title:'提交时间',
                dataIndex:'answerSecondSubmittime',
                key:'answerSecondSubmittime'
            },
            {
                title:'批改状态',
                dataIndex:'answerIsProcessed',
                key:'answerIsProcessed',
                render:(text,record,index) => {
                    if(record.answerIsProcessed === '1'){
                        return <Icon type="check" style={{color:'#1890ff'}} />
                    }
                    else{
                        return <Icon type='close' style={{color:'red'}} />
                    }
                }
            },
            {
                title:'操作',
                dataIndex:'actions',
                key:'actions',
                render: (text,record,index) => {
                    return (
                        <Link to='/correctResult' >
                            <Button 
                                type='primary' 
                                size='small' 
                                onClick={this.handleViewResult.bind(this,record,index)}
                            >
                                查看
                            </Button>
                        </Link>            
                    )
                }
            }
        ] 
        const columns2 = [
            {
                title:'答案ID',
                dataIndex:'answerId',
                key:'answerId',
            },
            {
                title:'学生姓名',
                dataIndex:'name',
                key:'name',
                ...this.getColumnsSearchProps('name')
            },
            {
                title:'学号',
                dataIndex:'studentSchoolNumber',
                key:'studentSchoolNumber',
                ...this.getColumnsSearchProps('studentSchoolNumber')
            },
            {
                title:'提交状态',
                dataIndex:'submitState',
                key:'submitState',
                filters:[{text:'已提交',value:'answerFirstImgPath'},{text:'未提交',value:'answerSecondImgPath'}],
                filteredValue: filteredInfo.state || null,
                onFilter:(value,record) =>  value==='answerFirstImgPath' ? record[value] : !record[value],
                render:(text,record,index) => {
                    if(record.answerFirstImgPath ){
                        return <Icon type="check" style={{color:'#1890ff'}} />
                    }
                    else{
                        return <Icon type='close' style={{color:'red'}} />
                    }
                }
            },
            {
                title:'提交时间',
                dataIndex:'answerFirstSubmittime',
                key:'answerFirstSubmittime'
            },
            {
                title:'批改状态',
                dataIndex:'answerIsProcessed',
                key:'answerIsProcessed',
                render:(text,record,index) => {
                    if(record.answerIsProcessed === '1'){
                        return <Icon type="check" style={{color:'#1890ff'}} />
                    }
                    else{
                        return <Icon type='close' style={{color:'red'}} />
                    }
                }
            },
            {
                title:'操作',
                dataIndex:'actions',
                key:'actions',
                render: (text,record,index) => {
                    return (
                        <Link to='/correctResult' >
                            <Button 
                                type='primary' 
                                size='small' 
                                onClick={this.handleViewResult.bind(this,record,index)}
                            >
                                查看
                            </Button>
                        </Link>            
                    )
                }
            }
        ] 
        return (
            <BasicLayoutForTea title='作业管理/作业批改' describe='本页用于查看某个作业的提交情况'>
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
                    info
                    ?   <Card 
                            title='提交情况' 
                            size='small'
                            bordered
                            headStyle={{display:"flex",align:'left',fontWeight:"bold"}}
                            bodyStyle={{display:'float',align:"left"}}
                            style={{ position:"absolute", right:'0', width:'12vw',zIndex:999}}
                        >
                            <p>本班人数：{info.CourseNumber}</p>
                            {
                                classwork.classworkType === '课后作业'
                                ?   <Fragment>
                                        <p>提交一次：{info.SubmittedOnce}</p>
                                        <p>提交两次：{info.SubmittedTwice}</p>
                                    </Fragment>
                                :   <p>提交人数：{info.SubmittedOnce}</p>
                            }
                            <p>已批改：{info.processNumber}</p>
                        </Card>
                    : null
                }
                <Form {...formItemLayout1} style={{display:'flex', margin:"0 1.5rem"}}>
                    <FormItem label='科目' >
                        <Input value={classwork.courseName} disabled />
                    </FormItem>
                    <FormItem label='作业' >
                        <Input value={classwork.classworkTitle} disabled />
                    </FormItem>
                    <FormItem label='类型' >
                        <Input value={classwork.classworkType} disabled />
                    </FormItem>
                    <FormItem label='状 态' >
                        {
                            NormaltimeToTimestamp(moment()) >= NormaltimeToTimestamp(classwork.classworkDeadline)
                            ? (
                                <Input value='已截止' disabled />
                            )
                            : (
                                <Input value='进行中' disabled />
                            )
                        }
                    </FormItem>
                </Form>
                {
                    source2 && source2.length>0
                    ?   source1 && source1.length>0
                        ?   <Tabs 
                                type='card' 
                                tabBarStyle={{
                                    display:'flex',
                                    align:'left',
                                    marginLeft:'2vw',
                                    width:'70vw'
                                }}
                                onChange={this.TabChange}
                            >
                                <TabPane tab='已提交' key='1'>    
                                    <ConfigProvider locale={zhCN}>     
                                        <Table
                                            columns={
                                                classwork.classworkType === '课后作业'
                                                ? columns1
                                                : columns2
                                            }
                                            dataSource={source1}
                                            rowKey={record => record.answerId}
                                            bordered
                                            onChange={this.handleTableChange}
                                            style={{margin:'0 1.5rem',width:'70vw'}}
                                        />
                                    </ConfigProvider>
                                </TabPane>
                                <TabPane tab='未提交' key='2'>
                                    <div style={{margin:'0 1.5rem',width:'70vw'}}>
                                        <Row gutter={16}>
                                            {
                                                source2.map((item,index) => {
                                                    return  <Col span={4} key={index}>
                                                                <Card size='small' style={{width:'10vw',textAlign:'center'}}>
                                                                    <p>{item.studentSchoolNumber}</p>
                                                                    <p>{item.name}</p>
                                                                </Card>
                                                            </Col>
                                                })
                                            }
                                        </Row>
                                    </div>
                                </TabPane>
                            </Tabs>
                        :   <div style={{margin:'0 1.5rem',width:'70vw'}}>
                                <Row gutter={16}>
                                {
                                    source2.map((item,index) => {
                                        return  <Col span={4} key={index}>
                                                    <Card size='small'>
                                                        <p>{item.studentSchoolNumber}</p>
                                                        <p>{item.name}</p>
                                                    </Card>
                                                </Col>
                                    })
                                }
                                </Row>
                                <Button type='primary'>
                                    <Icon type='download' />
                                    <CSVLink data={csvData}>Download me</CSVLink>
                                </Button>
                            </div>
                    :   <ConfigProvider locale={zhCN}>     
                            <Table
                                columns={
                                    classwork.classworkType === '课后作业'
                                    ? columns1
                                    : columns2
                                }
                                dataSource={source1}
                                rowKey={record => record.answerId}
                                bordered
                                style={{margin:'0 1.5rem',width:'70vw'}}
                            />
                        </ConfigProvider>
                }
                {
                    source2 && source2.length>0
                    ?   tabKey==='2'
                        ?   <Button 
                                type='primary'
                                style={{
                                    position:'absolute',
                                    bottom:'2rem',
                                    right:'5rem'
                                }}
                            >
                                <CSVLink data={csvData} >
                                    <Icon type='download' />
                                    导出Excel
                                </CSVLink>
                            </Button>
                        :   null
                    :   null
                }
            </BasicLayoutForTea>
        )
    }
}

export default ResultTable