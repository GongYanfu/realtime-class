import React,{ Component, Fragment } from 'react'
import { 
    Menu, 
    Button,
    message,
    Spin,

} from 'antd'
import { Link } from 'react-router-dom'
import axios from 'axios'
import BasicLayoutForStu from '../../components/BasicLayoutForStu/BasicLayoutForStu'
import BasicLayoutForTea from '../../components/BasicLayoutForTea/BasicLayoutForTea'
import { getItem, KEYS, setItem } from '../../utils/localStorage'

const MenuItem = Menu.Item
const { SubMenu } = Menu

class Chapters extends Component {
    constructor(props){
        super(props)
        this.state = {
            userType:'', //用于进入下一页的判断
            chapters:[]
        }
    }


    componentDidMount = () => {
        const userInfo = JSON.parse(getItem(KEYS.KEY_CUR_USERINFO))
        this.setState({
            userType: userInfo.userType
        })
        this.loadData()
    }

    loadData = async() => {
        const res = await axios({
            url:'http://118.24.233.16:8080/homeworkManager/questionBank/getKnowlageGraph',
            method:'get',
            params:{
                courseId: '1'
            }
        })
        if(res && res.status===200){
            const { data } = res
            if(data){
                const { msg, code } = data
                if(msg==='ok' || code===200){
                    const { data : graphData } = data
                    const newData = JSON.parse(graphData)
                    if(newData){
                        const { catalogue } = newData
                        const { chapter } = catalogue
                        console.log(catalogue)
                        if(chapter && chapter.length>0){
                            this.setState({
                                chapters: [...chapter]
                            })
                        }
                    }
                }
            }
        }
        else{
            message.error('请求课程目录信息失败',2)
        }
    }

    handleToEvaluate = (name,e) => {
        this.setState({
            uploding: true
        })
        const { key } = e
        if(key && name){
            const obj = {
                chapter: 123,
                courseId:1
            }
            setItem(KEYS.KEY_CUR_CHAPTER,JSON.stringify(obj))
            setTimeout(()=>{
                this.setState({
                    uploading: false
                })
                const { history } = this.props
                history.push('/evaluate')
            },1000)
        }
    }

    handleToCheck = (e) => {
        const { history } = this.props
        history.push('/checkChapters')
    }

    render(){
        const { userType, chapters, uploading } = this.state
        console.log(chapters)
        return (
            <Fragment>
                {
                    userType === 'student'
                    ?   <BasicLayoutForStu title='章节测评' describe='本业用于展示所有章节内容'>
                            {
                                chapters && chapters.length>0
                                ?   <Fragment>
                                        {
                                            chapters.map((item,index) =>{
                                            return  <Menu
                                                        mode='inline'
                                                        style={{width:'60vw',backgroundColor:'rgba(0,0,0,0.2)',lineHeight:1.5}}
                                                        key={index}
                                                    >
                                                        {
                                                            item.node === 0
                                                            ?   <SubMenu
                                                                    key={item.index}
                                                                    title={
                                                                        <h4 style={{fontWeight:"bold"}}>{item.index} {item.name}</h4>
                                                                    }
                                                                    style={{
                                                                        paddingBottom:'4vh',
                                                                        borderBottom:'1.5px solid rgba(0,0,0,0.2)'
                                                                    }}
                                                                >
                                                                    <MenuItem 
                                                                        key={item.index} 
                                                                        title={ item.index + item.name}
                                                                        style={{
                                                                            marginTop:"0",
                                                                            marginBottom:"0",
                                                                            paddingRight:"48px",
                                                                            backgroundColor:'rgba(0,0,0,0.1)'
                                                                        }}
                                                                        onItemHover = { () => {} }
                                                                        onClick={this.handleToEvaluate.bind(this,item.name)}
                                                                    >
                                                                        <Link to='#'>
                                                                            <span style={{fontWeight:'bold',color:"#1890ff"}}>{item.index + ' ' + item.name}</span>
                                                                            <Button 
                                                                                type='primary'
                                                                                size='default'
                                                                                style={{float:'right',marginTop:"5px"}}
                                                                            >
                                                                                前往测评 >
                                                                            </Button>
                                                                        </Link>
                                                                    </MenuItem>
                                                                </SubMenu>
                                                            :   <SubMenu
                                                                    key={item.index}
                                                                    title={
                                                                        <h4 style={{fontWeight:"bold"}}>{item.index+ ' ' +item.name}</h4>
                                                                    }
                                                                    style={{
                                                                        paddingBottom:'4vh',
                                                                        borderBottom:'1.5px solid rgba(0,0,0,0.2)',
                                                                    }}
                                                                >
                                                                    {
                                                                        item.subchapter.map((item1,index) => {
                                                                            if(item1.node === 0){
                                                                                return  <MenuItem 
                                                                                            key={item1.index} 
                                                                                            title={item1.index + ' ' + item1.name}
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
                                                                                            onClick={this.handleToEvaluate.bind(this,item1.name)}
                                                                                        >
                                                                                            <Link to='#'>
                                                                                                <span style={{fontWeight:'bold',color:"#1890ff"}}>{item1.index + ' ' + item1.name}</span>
                                                                                                <Button 
                                                                                                    type='primary'
                                                                                                    size='default'
                                                                                                    style={{float:'right'}}
                                                                                                    onClick={this.handleToEvaluate.bind(this,item1.name)}
                                                                                                >
                                                                                                    前往测评 >
                                                                                                </Button>
                                                                                            </Link>
                                                                                        </MenuItem>
                                                                            }
                                                                            else if(item1.node === 1){
                                                                                return  <SubMenu
                                                                                            key={item1.index} 
                                                                                            title={
                                                                                                <h4 style={{fontWeight:"bold"}}>{item1.index + ' ' + item1.name}</h4>
                                                                                            }
                                                                                            style={{
                                                                                                backgroundColor:'rgba(0,0,0,0.1)'
                                                                                            }}
                                                                                        >
                                                                                            <MenuItem 
                                                                                                key={item1.index} 
                                                                                                title={item1.index + ' ' + item1.name}
                                                                                                style={{
                                                                                                    marginTop:"0",
                                                                                                    marginBottom:'0',
                                                                                                    padding:'5px 48px',
                                                                                                    backgroundColor:'rgba(0,0,0,0.1)',
                                                                                                    lineHeight:1.5,
                                                                                                    borderBottom:'1.5px solid rgba(0,0,0,0.15)'
                                                                                                }}
                                                                                                onItemHover = { () => {} }
                                                                                                onClick={this.handleToEvaluate.bind(this,item1.name)}
                                                                                            >
                                                                                                <Link to='#'>
                                                                                                    <span style={{fontWeight:'bold'}}>{item1.index + ' ' + item1.name}</span>
                                                                                                    <Button 
                                                                                                        type='primary'
                                                                                                        size='default'
                                                                                                        style={{float:'right'}}
                                                                                                        onClick={this.handleToEvaluate}
                                                                                                    >
                                                                                                        前往测评 >
                                                                                                    </Button>
                                                                                                </Link>
                                                                                            </MenuItem>
                                                                                        </SubMenu>
                                                                            }
                                                                            else{
                                                                                return  <SubMenu
                                                                                            key={item1.index} 
                                                                                            title={
                                                                                                <h4 style={{fontWeight:"bold",marginTop:'0'}}>{item1.index} {item1.name}</h4>
                                                                                            }
                                                                                            style={{
                                                                                                backgroundColor:'rgba(0,0,0,0.1)',
                                                                                                borderBottom:'1.5px solid rgba(0,0,0,0.15)'
                                                                                            }}
                                                                                        >
                                                                                            {
                                                                                                item1.subchapter.map((chapter,index) => {
                                                                                                    return  <MenuItem 
                                                                                                                key={chapter.index} 
                                                                                                                title={chapter.index + ' ' + chapter.name} 
                                                                                                                style={{
                                                                                                                    marginTop:"0",
                                                                                                                    marginBottom:"0",
                                                                                                                    padding:'5px 48px',
                                                                                                                    backgroundColor:'rgba(0,0,0,0.1)',
                                                                                                                    lineHeight:1.5,
                                                                                                                    borderBottom:'1px solid rgba(0,0,0,0.125)'
                                                                                                                }}
                                                                                                                onItemHover = { () => {} }
                                                                                                                onClick={this.handleToEvaluate.bind(this,item1.name)}
                                                                                                            >
                                                                                                                <Link to='#'>
                                                                                                                    <span style={{fontWeight:'bold',color:"#1890ff"}}>{chapter.index + ' ' + chapter.name}</span>
                                                                                                                    <Button 
                                                                                                                        type='primary'
                                                                                                                        size='default'
                                                                                                                        style={{float:'right'}}
                                                                                                                        onClick={this.handleToEvaluate.bind(this,item1.name)}
                                                                                                                    >
                                                                                                                        前往测评 >
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
                                    </Fragment>
                                :   <Spin 
                                        size='large'
                                        tip="Loading..." 
                                        className='spin'
                                    >
                                    </Spin>
                            }
                        </BasicLayoutForStu>
                    :   <BasicLayoutForTea title='章节测评' describe='本业用于展示所有章节内容'>
                            {
                                chapters && chapters.length>0
                                ?   <Fragment>
                                        {
                                            chapters.map((item,index) =>{
                                            return  <Menu
                                                        mode='inline'
                                                        style={{width:'60vw',backgroundColor:'rgba(0,0,0,0.2)',lineHeight:1.5}}
                                                        key={index}
                                                    >
                                                        {
                                                            item.node === 0
                                                            ?   <SubMenu
                                                                    key={item.index}
                                                                    title={
                                                                        <h4 style={{fontWeight:"bold"}}>{item.index + ' ' +item.name}</h4>
                                                                    }
                                                                    style={{
                                                                        paddingBottom:'4vh',
                                                                        borderBottom:'1.5px solid rgba(0,0,0,0.2)'
                                                                    }}
                                                                >
                                                                    <MenuItem 
                                                                        key={item.index} 
                                                                        title={ item.index + item.name}
                                                                        style={{
                                                                            marginTop:"0",
                                                                            marginBottom:"0",
                                                                            paddingRight:"48px",
                                                                            backgroundColor:'rgba(0,0,0,0.1)'
                                                                        }}
                                                                        onItemHover = { () => {} }
                                                                        onClick={this.handleToCheck.bind(this,item.name)}
                                                                    >
                                                                        <Link to='#'>
                                                                            <span style={{fontWeight:'bold',color:"#1890ff"}}>{item.index + ' ' + item.name}</span>
                                                                            <Button 
                                                                                type='primary'
                                                                                size='default'
                                                                                style={{float:'right',marginTop:"5px"}}
                                                                            >
                                                                                前往查看 >
                                                                            </Button>
                                                                        </Link>
                                                                    </MenuItem>
                                                                </SubMenu>
                                                            :   <SubMenu
                                                                    key={item.index}
                                                                    title={
                                                                        <h4 style={{fontWeight:"bold"}}>{item.index+ ' ' +item.name}</h4>
                                                                    }
                                                                    style={{
                                                                        paddingBottom:'4vh',
                                                                        borderBottom:'1.5px solid rgba(0,0,0,0.2)',
                                                                    }}
                                                                >
                                                                    {
                                                                        item.subchapter.map((item1,index) => {
                                                                            if(item1.node === 0){
                                                                                return  <MenuItem 
                                                                                            key={item1.index} 
                                                                                            title={item1.index + ' ' + item1.name}
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
                                                                                            onClick={this.handleToCheck.bind(this,item1.name)}
                                                                                        >
                                                                                            <Link to='#'>
                                                                                                <span style={{fontWeight:'bold',color:"#1890ff"}}>{item1.index + ' ' + item1.name}</span>
                                                                                                <Button 
                                                                                                    type='primary'
                                                                                                    size='default'
                                                                                                    style={{float:'right'}}
                                                                                                    onClick={this.handleToCheck.bind(this,item1.name)}
                                                                                                >
                                                                                                    前往查看 >
                                                                                                </Button>
                                                                                            </Link>
                                                                                        </MenuItem>
                                                                            }
                                                                            else if(item1.node === 1){
                                                                                return  <SubMenu
                                                                                            key={item1.index} 
                                                                                            title={
                                                                                                <h4 style={{fontWeight:"bold"}}>{item1.index + ' ' + item1.name}</h4>
                                                                                            }
                                                                                            style={{
                                                                                                backgroundColor:'rgba(0,0,0,0.1)'
                                                                                            }}
                                                                                        >
                                                                                            <MenuItem 
                                                                                                key={item1.index} 
                                                                                                title={item1.index + ' ' + item1.name}
                                                                                                style={{
                                                                                                    marginTop:"0",
                                                                                                    marginBottom:'0',
                                                                                                    padding:'5px 48px',
                                                                                                    backgroundColor:'rgba(0,0,0,0.1)',
                                                                                                    lineHeight:1.5,
                                                                                                    borderBottom:'1.5px solid rgba(0,0,0,0.15)'
                                                                                                }}
                                                                                                onItemHover = { () => {} }
                                                                                                onClick={this.handleToCheck.bind(this,item1.name)}
                                                                                            >
                                                                                                <Link to='#'>
                                                                                                    <span style={{fontWeight:'bold'}}>{item1.index + ' ' + item1.name}</span>
                                                                                                    <Button 
                                                                                                        type='primary'
                                                                                                        size='default'
                                                                                                        style={{float:'right'}}
                                                                                                        onClick={this.handleToCheck}
                                                                                                    >
                                                                                                        前往查看 >
                                                                                                    </Button>
                                                                                                </Link>
                                                                                            </MenuItem>
                                                                                        </SubMenu>
                                                                            }
                                                                            else{
                                                                                return  <SubMenu
                                                                                            key={item1.index} 
                                                                                            title={
                                                                                                <h4 style={{fontWeight:"bold",marginTop:'0'}}>{item1.index} {item1.name}</h4>
                                                                                            }
                                                                                            style={{
                                                                                                backgroundColor:'rgba(0,0,0,0.1)',
                                                                                                borderBottom:'1.5px solid rgba(0,0,0,0.15)'
                                                                                            }}
                                                                                        >
                                                                                            {
                                                                                                item1.subchapter.map((chapter,index) => {
                                                                                                    return  <MenuItem 
                                                                                                                key={chapter.index} 
                                                                                                                title={chapter.index + ' ' + chapter.name} 
                                                                                                                style={{
                                                                                                                    marginTop:"0",
                                                                                                                    marginBottom:"0",
                                                                                                                    padding:'5px 48px',
                                                                                                                    backgroundColor:'rgba(0,0,0,0.1)',
                                                                                                                    lineHeight:1.5,
                                                                                                                    borderBottom:'1px solid rgba(0,0,0,0.125)'
                                                                                                                }}
                                                                                                                onItemHover = { () => {} }
                                                                                                                onClick={this.handleToCheck.bind(this,item1.name)}
                                                                                                            >
                                                                                                                <Link to='#'>
                                                                                                                    <span style={{fontWeight:'bold',color:"#1890ff"}}>{chapter.index + ' ' + chapter.name}</span>
                                                                                                                    <Button 
                                                                                                                        type='primary'
                                                                                                                        size='default'
                                                                                                                        style={{float:'right'}}
                                                                                                                        onClick={this.handleToCheck.bind(this,item1.name)}
                                                                                                                    >
                                                                                                                        前往查看 >
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
                                    </Fragment>
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
        )
    }
}

export default Chapters