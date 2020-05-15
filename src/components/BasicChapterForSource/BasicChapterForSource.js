import React,{ Component, Fragment } from 'react'
import { 
    Menu, 
    Button,
    message,
    Select,
    Result
} from 'antd'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { getItem, KEYS, setItem } from '../../utils/localStorage'
import TernaryOperator from '../TernaryOperator/TernaryOperator'
import { getMineCourse } from '../../utils/interfaces'

const MenuItem = Menu.Item
const { SubMenu } = Menu
const { Option } = Select

class BasicChapterForSource extends Component {
    constructor(props){
        super(props)
        this.state = {
            userType:'',
            userId:'',
            courseId:'',
            chapters:[],
            courses:[]
        }
    }

    componentDidMount = () => {
        const { userType, userId } = JSON.parse(getItem(KEYS.KEY_CUR_USERINFO))
        this.setState({
            userType,
            userId
        })
        this.loadCourse()
        //this.loadChapter('1')
    }
  
    componentWillUnmount = () => {
        this.setState = (state, callback) => {
            return
        }
    }

    loadCourse = () => {
        const { userType, userId } = JSON.parse(getItem(KEYS.KEY_CUR_USERINFO))
        getMineCourse(userType,userId).then(res => {
            if(res && res.status===200){
                const { data } = res
                if(data && data.length>0 && data.type!==String){
                    this.setState({
                        courses: data
                    })
                    this.loadChapter('1')
                }
                else{
                    message.error(res.data,2)
                }
            }
        })
    }
    loadChapter = async(courseId) => {
        const { userType } = JSON.parse(getItem(KEYS.KEY_CUR_USERINFO))
        if(userType === 'student'){
            try {
                const res = await axios({
                    url:'http://118.24.233.16:8080/homeworkManager/Resources/catalog',
                    method:'get',
                    params:{ courseId: courseId }
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
                        else if(code===701){
                            message.error(msg,2)
                            this.setState({
                                chapters: null
                            })
                        }
                    }
                }
                else{
                    message.error(res.data,2)
                }
            }catch(error){
                message.error('系统错误，刷新重试或者联系管理员！！！')
            }
        }
        else{
            try{
                const res = await axios({
                    url:'http://118.24.233.16:8080/homeworkManager/course/catalog',
                    method:'get',
                    params:{ courseId: courseId }
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
                            else{
                                this.setState({
                                    chapters: null
                                })
                            }
                        }
                        else{
                            message.error(msg,2)
                            this.setState({
                                chapters: null
                            })
                        }
                    }
                }
                else{
                    message.error(res.data,2)
                }
            }
            catch(error){
                message.error('系统错误，刷新重试或者联系管理员！！！',2)
            }
        }
    }

    handleSelectChange = (value) => {
        this.loadChapter(`${value}`)
    }

    handleUpload = (chapter,e) => {
        if(chapter){
            const obj = {
                chapter: chapter,
                courseId:1
            }
            setItem(KEYS.KEY_CUR_CHAPTER,JSON.stringify(obj))
            setTimeout(()=>{
                const { history } = this.props
                history.push('/uploadSource')
            },500)
        }
    }
    handleDownload = (chapter,e) => {
        if(chapter){
            const obj = {
                chapter: chapter,
                courseId:1
            }
            setItem(KEYS.KEY_CUR_CHAPTER,JSON.stringify(obj))
            setTimeout(()=>{
                const { history } = this.props
                history.push('/checkSource')
            },500)
        }
    }
    handleRefresh = () => {
        window.location.reload()
    }

    render(){
        const { chapters, userType, courses } = this.state
        return (
            <Fragment>
            <TernaryOperator boolean={courses && courses.length>0}>
                <Select
                    showSearch
                    style={{ width:'12vw',position:'absolute',right:'3vw',top:'6rem' }}
                    placeholder="请选择查看资源课程"
                    optionFilterProp="children"
                    onChange={this.handleSelectChange}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                    {
                        courses.map((item,index) => {
                            return <Option value={item.courseId} key={index}>{item.courseName}</Option>
                        })
                    }
                </Select>
            </TernaryOperator>
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
                                                        style={{
                                                            marginTop:"0",
                                                            marginBottom:"0",
                                                            paddingRight:"48px",
                                                            backgroundColor:'rgba(0,0,0,0.1)'
                                                        }}
                                                        onItemHover = { () => {} }
                                                        onClick={() => {}}
                                                    >
                                                        <Link to='#'>
                                                            <span style={{fontWeight:'bold',color:"#1890ff"}}>{item.nodeindex + ' ' + item.nodename}</span>
                                                            <Button 
                                                                type='primary'
                                                                size='default'
                                                                style={{float:'right',marginTop:"5px"}}
                                                                onClick={userType==='teacher' ? this.handleUpload.bind(this,item) : this.handleDownload.bind(this,item)}
                                                            >
                                                                <TernaryOperator boolean={userType==='student'}>
                                                                    <p>查看资源 ></p>
                                                                </TernaryOperator>
                                                                <TernaryOperator boolean={userType==='teacher'}>
                                                                    <p>上传资源 ></p>
                                                                </TernaryOperator>
                                                            </Button>
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
                                                        item.childNode.map((item1) => {
                                                            if(item1.childNumber === 0){
                                                                return  <MenuItem 
                                                                            key={item1.nodeid} 
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
                                                                            onClick={() => {}}
                                                                        >
                                                                            <Link to='#'>
                                                                                <span style={{fontWeight:'bold',color:"#1890ff"}}>{item1.nodeindex + ' ' + item1.nodename}</span>
                                                                                <Button 
                                                                                    type='primary'
                                                                                    size='default'
                                                                                    style={{float:'right'}}
                                                                                    onClick={userType==='teacher' ? this.handleUpload.bind(this,item1) : this.handleDownload.bind(this,item1)}
                                                                                >
                                                                                    <TernaryOperator boolean={userType==='student'}>
                                                                                        <p>查看资源 ></p>
                                                                                    </TernaryOperator>
                                                                                    <TernaryOperator boolean={userType==='teacher'}>
                                                                                        <p>上传资源 ></p>
                                                                                    </TernaryOperator>
                                                                                </Button>
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
                                                                                key={item1.childNode[0].nodeid} 
                                                                                style={{
                                                                                    marginTop:"0",
                                                                                    marginBottom:'0',
                                                                                    padding:'5px 48px',
                                                                                    backgroundColor:'rgba(0,0,0,0.1)',
                                                                                    lineHeight:1.5,
                                                                                    borderBottom:'1.5px solid rgba(0,0,0,0.15)'
                                                                                }}
                                                                                onItemHover = { () => {} }
                                                                                onClick={() => {}}
                                                                            >
                                                                                <Link to='#'>
                                                                                    <span style={{fontWeight:'bold'}}>{item1.childNode[0].nodeindex + ' ' + item1.childNode[0].nodename}</span>
                                                                                    <Button 
                                                                                        type='primary'
                                                                                        size='default'
                                                                                        style={{float:'right'}}
                                                                                        onClick={userType==='teacher' ? this.handleUpload.bind(this,item1.childNode[0]) : this.handleDownload.bind(this,item1.childNode[0])}
                                                                                    >
                                                                                        <TernaryOperator boolean={userType==='student'}>
                                                                                            <p>查看资源 ></p>
                                                                                        </TernaryOperator>
                                                                                        <TernaryOperator boolean={userType==='teacher'}>
                                                                                            <p>上传资源 ></p>
                                                                                        </TernaryOperator>
                                                                                    </Button>
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
                                                                                                style={{
                                                                                                    marginTop:"0",
                                                                                                    marginBottom:"0",
                                                                                                    padding:'5px 48px',
                                                                                                    backgroundColor:'rgba(0,0,0,0.1)',
                                                                                                    lineHeight:1.5,
                                                                                                    borderBottom:'1px solid rgba(0,0,0,0.125)'
                                                                                                }}
                                                                                                onItemHover = { () => {} }
                                                                                                onClick={() => {}}
                                                                                            >
                                                                                                <Link to='#'>
                                                                                                    <span style={{fontWeight:'bold',color:"#1890ff"}}>{item2.nodeindex + ' ' + item2.nodename}</span>
                                                                                                    <Button 
                                                                                                        type='primary'
                                                                                                        size='default'
                                                                                                        style={{float:'right'}}
                                                                                                        onClick={userType==='teacher' ? this.handleUpload.bind(this,item2) : this.handleDownload.bind(this,item2)}
                                                                                                    >
                                                                                                        <TernaryOperator boolean={userType==='student'}>
                                                                                                            <p>查看资源 ></p>
                                                                                                        </TernaryOperator>
                                                                                                        <TernaryOperator boolean={userType==='teacher'}>
                                                                                                            <p>上传资源 ></p>
                                                                                                        </TernaryOperator>
                                                                                                    </Button>
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
                :   <Result
                        status="500"
                        title="701"
                        subTitle="抱歉，未能获取当前课程的资源目录"
                        extra={<Button type="primary" onClick={this.handleRefresh}>刷 新</Button>}
                    />
            }
            </Fragment>
        )
    }
}

export default BasicChapterForSource
