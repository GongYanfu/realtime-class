import React,{ Component, Fragment } from 'react'
import { 
    Menu, 
    Button,
    message,
    Spin
} from 'antd'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { getItem, KEYS, setItem } from '../../utils/localStorage'
import TernaryOperator from '../TernaryOperator/TernaryOperator'

import "./BasicChapter.scss"

const MenuItem = Menu.Item
const { SubMenu } = Menu

class BasicChapter extends Component {
    constructor(props){
        super(props)
        this.state = {
            userType:'', //用于进入下一页的判断
            chapters:[],
            pageType:''
        }
    }

    componentDidMount(){
        const { userType } = JSON.parse(getItem(KEYS.KEY_CUR_USERINFO))
        console.log(this.props.type)
        const { type: pageType } =  this.props
        this.setState({
            userType,
            pageType
        })
        this.loadData()
    }

    componentWillUnmount = () => {
        return;
    }

    loadData = async() => {
        const res = await axios({
            url:'http://118.24.233.16:8080/homeworkManager/course/catalog',
            method:'get',
            params:{ courseId: '1'}
        })
        if(res && res.status===200){
            const { data } = res
            if(data){
                const { msg, code } = data
                if(msg==='ok' || code===200){
                    const { data : graphData } = data
                    if(graphData && graphData.length>0){
                        this.setState({
                            chapters:[...graphData]
                        })
                    }
                }
                else{
                    message.error('获取课程目录信息失败',2)
                }
            }
        }
        else{
            message.error('获取课程目录信息失败',2)
        }
    }

    handleToEvaluate = (chapter,e) => {
        this.setState({
            uploading: true
        })
        const { key } = e
        if(key && chapter){
            const obj = {
                chapter: chapter,
                courseId:1
            }
            setItem(KEYS.KEY_CUR_CHAPTER,JSON.stringify(obj))
            setTimeout(()=>{
                this.setState({
                    uploading: false
                })
                const { history } = this.props
                history.push('/evaluate')
                setTimeout(() => {
                    window.location.reload()
                },1)
            },500)
        }
    }

    handleToCheck = (e) => {
        const { history } = this.props
        history.push('/checkChapters')
    }

    render(){
        const { chapters, userType } = this.state
        const { pageType } = this.props
        console.log(userType)
        console.log(pageType)
        //根据Type显示不同按钮内容
        return (
            <Fragment>
            {
                chapters && chapters.length>0
                ?   <div className='menu'>
                        {
                            chapters.map((item,index) =>{
                            return  <Menu
                                        mode='inline'
                                        style={{
                                            backgroundColor:'rgba(0,0,0,0.2)',
                                            lineHeight:1.5,
                                        }}
                                        key={index}
                                        defaultOpenKeys={[`sub${item.nodeid}`]}
                                    >
                                        {
                                            item.childNumber === 0
                                            ?   <SubMenu
                                                    key={`sub${item.nodeid}`}
                                                    title={
                                                        <h4 style={{fontWeight:"bold"}}>{item.nodeindex} {item.nodename}</h4>
                                                    }
                                                    style={{
                                                        paddingBottom:'4vh',
                                                        borderBottom:'1.5px solid rgba(0,0,0,0.2)'
                                                    }}
                                                >
                                                    <MenuItem 
                                                        key={item.nodeindex} 
                                                        title={ item.nodeindex + item.nodename}
                                                        style={{
                                                            marginTop:"0",
                                                            marginBottom:"0",
                                                            paddingRight:"48px",
                                                            backgroundColor:'rgba(0,0,0,0.1)'
                                                        }}
                                                        onItemHover = { () => {} }
                                                        onClick={item.questionnumber===0 ? () => {} : this.handleToEvaluate.bind(this,item)}
                                                    >
                                                        <Link to='#'>
                                                            <span style={{fontWeight:'bold',color:"#1890ff"}}>{item.nodeindex + ' ' + item.nodename}</span>
                                                            <TernaryOperator boolean={item.questionnumber!==0}>
                                                                <Button 
                                                                    type='primary'
                                                                    size='default'
                                                                    style={{float:'right',marginTop:"5px"}}
                                                                    onClick={this.handleToEvaluate.bind(this,item)}
                                                                >
                                                                    <TernaryOperator boolean={pageType==='test'}>
                                                                        <TernaryOperator boolean={userType==='student'}>
                                                                            <p>前往测评 ></p>
                                                                        </TernaryOperator>
                                                                        <TernaryOperator boolean={userType==='teacher'}>
                                                                            <p>前往查看 ></p>
                                                                        </TernaryOperator>
                                                                    </TernaryOperator>
                                                                    <TernaryOperator boolean={pageType==='source'}>
                                                                        <TernaryOperator boolean={userType==='student'}>
                                                                            <p>查看资源 ></p>
                                                                        </TernaryOperator>
                                                                        <TernaryOperator boolean={userType==='teacher'}>
                                                                            <p>上传资源 ></p>
                                                                        </TernaryOperator>
                                                                    </TernaryOperator>
                                                                </Button>
                                                            </TernaryOperator>
                                                        </Link>
                                                    </MenuItem>
                                                </SubMenu>
                                            :   <SubMenu
                                                    key={`sub${item.nodeid}`}
                                                    title={
                                                        <h4 style={{fontWeight:"bold"}}>{item.nodeindex+ ' ' + item.nodename}</h4>
                                                    }
                                                    style={{
                                                        paddingBottom:'4vh',
                                                        borderBottom:'1.5px solid rgba(0,0,0,0.2)',
                                                    }}
                                                >
                                                    {
                                                        item.childNode.map((item1,index) => {
                                                            if(item1.childNumber === 0){
                                                                return  <MenuItem 
                                                                            key={item1.nodeid} 
                                                                            title={item1.nodeindex + ' ' + item1.nodename}
                                                                            style={{
                                                                                marginTop:"0",
                                                                                marginBottom:'0',
                                                                                paddingRight:"48px",
                                                                                padding:'5px 48px',
                                                                                backgroundColor:'rgba(0,0,0,0.1)',
                                                                                lineHeight:1.5,
                                                                                borderBottom:'1px solid rgba(0,0,0,0.15)'
                                                                            }}
                                                                            onItemHover = { () => {} }
                                                                            onClick={item1.questionnumber===0 ? () => {} : this.handleToEvaluate.bind(this,item1)}
                                                                        >
                                                                            <Link to='#'>
                                                                                <span style={{fontWeight:'bold',color:"#1890ff"}}>{item1.nodeindex + ' ' + item1.nodename}</span>
                                                                                <TernaryOperator boolean={item1.questionnumber!==0}>
                                                                                    <Button 
                                                                                        type='primary'
                                                                                        size='default'
                                                                                        style={{float:'right'}}
                                                                                        onClick={this.handleToEvaluate.bind(this,item1)}
                                                                                    >
                                                                                        <TernaryOperator boolean={pageType==='test'}>
                                                                                            <TernaryOperator boolean={userType==='student'}>
                                                                                                <p>前往测评 ></p>
                                                                                            </TernaryOperator>
                                                                                            <TernaryOperator boolean={userType==='teacher'}>
                                                                                                <p>前往查看 ></p>
                                                                                            </TernaryOperator>
                                                                                        </TernaryOperator>
                                                                                        <TernaryOperator boolean={pageType==='source'}>
                                                                                            <TernaryOperator boolean={userType==='student'}>
                                                                                                <p>查看资源 ></p>
                                                                                            </TernaryOperator>
                                                                                            <TernaryOperator boolean={userType==='teacher'}>
                                                                                                <p>上传资源 ></p>
                                                                                            </TernaryOperator>
                                                                                        </TernaryOperator>
                                                                                    </Button>
                                                                                </TernaryOperator>
                                                                            </Link>
                                                                        </MenuItem>
                                                            }
                                                            else if(item1.childNumber === 1){
                                                                return  <SubMenu
                                                                            key={item1.nodeid} 
                                                                            title={
                                                                                <h4 style={{fontWeight:"bold"}}>{item1.nodeindex + ' ' + item1.nodename}</h4>
                                                                            }
                                                                            style={{
                                                                                backgroundColor:'rgba(0,0,0,0.1)'
                                                                            }}
                                                                        >
                                                                            <MenuItem 
                                                                                key={item1.nodeid} 
                                                                                title={item1.nodeindex + ' ' + item1.nodename}
                                                                                style={{
                                                                                    marginTop:"0",
                                                                                    marginBottom:'0',
                                                                                    padding:'5px 48px',
                                                                                    backgroundColor:'rgba(0,0,0,0.1)',
                                                                                    lineHeight:1.5,
                                                                                    borderBottom:'1.5px solid rgba(0,0,0,0.15)'
                                                                                }}
                                                                                onItemHover = { () => {} }
                                                                                onClick={item.questionnumber===0 ? () => {} : this.handleToEvaluate.bind(this,item1)}
                                                                            >
                                                                                <Link to='#'>
                                                                                    <span style={{fontWeight:'bold'}}>{item1.nodeindex + ' ' + item1.nodename}</span>
                                                                                    <TernaryOperator boolean={item1.questionnumber!==0}>
                                                                                        <Button 
                                                                                            type='primary'
                                                                                            size='default'
                                                                                            style={{float:'right'}}
                                                                                            onClick={this.handleToEvaluate.bind(this,item1)}
                                                                                        >
                                                                                            <TernaryOperator boolean={pageType==='test'}>
                                                                                                <TernaryOperator boolean={userType==='student'}>
                                                                                                    <p>前往测评 ></p>
                                                                                                </TernaryOperator>
                                                                                                <TernaryOperator boolean={userType==='teacher'}>
                                                                                                    <p>前往查看 ></p>
                                                                                                </TernaryOperator>
                                                                                            </TernaryOperator>
                                                                                            <TernaryOperator boolean={pageType==='source'}>
                                                                                                <TernaryOperator boolean={userType==='student'}>
                                                                                                    <p>查看资源 ></p>
                                                                                                </TernaryOperator>
                                                                                                <TernaryOperator boolean={userType==='teacher'}>
                                                                                                    <p>上传资源 ></p>
                                                                                                </TernaryOperator>
                                                                                            </TernaryOperator>
                                                                                        </Button>
                                                                                    </TernaryOperator>
                                                                                </Link>
                                                                            </MenuItem>
                                                                        </SubMenu>
                                                            }
                                                            else{
                                                                return  <SubMenu
                                                                            key={item1.nodeid} 
                                                                            title={
                                                                                <h4 style={{fontWeight:"bold",marginTop:'0'}}>{item1.nodeindex} {item1.nodename}</h4>
                                                                            }
                                                                            style={{
                                                                                backgroundColor:'rgba(0,0,0,0.1)',
                                                                                borderBottom:'1.5px solid rgba(0,0,0,0.15)'
                                                                            }}
                                                                        >
                                                                            {
                                                                                item1.childNode.map((item2,index) => {
                                                                                    return  <MenuItem 
                                                                                                key={item2.nodeid} 
                                                                                                title={item2.nodeindex + ' ' + item2.nodename} 
                                                                                                style={{
                                                                                                    marginTop:"0",
                                                                                                    marginBottom:"0",
                                                                                                    padding:'5px 48px',
                                                                                                    backgroundColor:'rgba(0,0,0,0.1)',
                                                                                                    lineHeight:1.5,
                                                                                                    borderBottom:'1px solid rgba(0,0,0,0.125)'
                                                                                                }}
                                                                                                onItemHover = { () => {} }
                                                                                                onClick={item2.questionnumber===0 ? () => {} : this.handleToEvaluate.bind(this,item2)}
                                                                                            >
                                                                                                <Link to='#'>
                                                                                                    <span style={{fontWeight:'bold',color:"#1890ff"}}>{item2.nodeindex + ' ' + item2.nodename}</span>
                                                                                                    <TernaryOperator boolean={item2.questionnumber!==0}>
                                                                                                        <Button 
                                                                                                            type='primary'
                                                                                                            size='default'
                                                                                                            style={{float:'right'}}
                                                                                                            onClick={this.handleToEvaluate.bind(this,item2)}
                                                                                                        >
                                                                                                            <TernaryOperator boolean={pageType==='test'}>
                                                                                                                <TernaryOperator boolean={userType==='student'}>
                                                                                                                    <p>前往测评 ></p>
                                                                                                                </TernaryOperator>
                                                                                                                <TernaryOperator boolean={userType==='teacher'}>
                                                                                                                    <p>前往查看 ></p>
                                                                                                                </TernaryOperator>
                                                                                                            </TernaryOperator>
                                                                                                            <TernaryOperator boolean={pageType==='source'}>
                                                                                                                <TernaryOperator boolean={userType==='student'}>
                                                                                                                    <p>查看资源 ></p>
                                                                                                                </TernaryOperator>
                                                                                                                <TernaryOperator boolean={userType==='teacher'}>
                                                                                                                    <p>上传资源 ></p>
                                                                                                                </TernaryOperator>
                                                                                                            </TernaryOperator>
                                                                                                        </Button>
                                                                                                    </TernaryOperator>
                                                                                                </Link>
                                                                                            </MenuItem>
                                                                                })
                                                                            }
                                                                        </SubMenu>
                                                            }
                                                        })
                                                    }
                                                </SubMenu>
                                        }
                                    </Menu>
                            })
                        }
                    </div>
                :   <Spin 
                        size='large'
                        tip="Loading..." 
                        className='spin'
                    >
                    </Spin>
            }
            </Fragment>
        )
    }
}

export default BasicChapter