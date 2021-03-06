import React, { Component } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom'
import { Layout, Menu, Icon, Avatar, Dropdown, message } from 'antd';
import { KEYS, getItem, removeItem } from '../../utils/localStorage'
import axios from 'axios'

import './BasicLayoutForStu.css'

const { Header, Sider, Content } = Layout;
const MenuItem = Menu.Item; 
const { SubMenu } = Menu

class BasicLayoutForStu extends Component {
  constructor(props){
    super(props)
    this.state = {
      collapsed: false,
      userSchoolNumber: '',
      userName:''
    }
  }

  componentDidMount = () => {
    const user = JSON.parse(getItem(KEYS.KEY_CUR_USERINFO))
    if(user){
        this.setState({
          userSchoolNumber: user.userSchoolNumber,
          userName:user.userName
        })
    }
}

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  handleLogOut = async()=>{
    try{
      const res = await axios.get('http://118.24.233.16:8080/homeworkManager/logout')
      if(res && res.data==='ok'){
        removeItem(KEYS.KEY_CUR_ANSWER)
        removeItem(KEYS.KEY_CUR_USERINFO)
        removeItem(KEYS.KEY_CUR_CLASSWORK)
        removeItem(KEYS.KEY_CUR_CHAPTER)
        setTimeout(()=>{
          window.location.reload()
        },100)
      }
    }
    catch(error){
      message.error('系统错误，刷新重试或者联系管理员！！',2)
    }
}

  render() {
    const { title, describe } = this.props
    const { userSchoolNumber, userName } = this.state
    const menu = (
      <Router>
      <Menu>
          <MenuItem 
             key="0"
             onClick={this.handleLogOut.bind(this)}
          >
              <Link to='/'>
                  <Icon type="poweroff" />
                  &nbsp;&nbsp;
                  <span>退 出</span>
              </Link>
          </MenuItem>
          <MenuItem 
             key="1"
          >
              <Link to='#'>
                  <Icon type="setting" />
                  &nbsp;&nbsp;
                  <span>设 置</span>
              </Link>
          </MenuItem>
    </Menu>
    </Router>
  )
    return (
      <Layout style={{width:'100vw',height:'100vh'}}>
        <Sider 
          trigger={null} 
          collapsible 
          collapsed={this.state.collapsed}
          style={{
            height:'100vh',
            overflow:'auto'
          }}
        >
          <div >
            {
              this.state.collapsed
              ? (
                <Avatar
                    src='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1580983809179&di=b0fa65de910657d9769ef12741e8950c&imgtype=0&src=http%3A%2F%2Fzt.yizimg.com%2FComFolder%2F200068392%2Fimage%2F201704%2F201704251314911391.png'
                    style={{ margin: '16px'}} 
                    size='large'
                />
              )
              : (
                <h3 className='logo'>作业管理系统</h3>
              )
            }
          </div>
            <Menu
                theme='dark'
                mode='inline'
            >
              <SubMenu
                key="sub1"
                title={
                  <Link to='#'>
                    <span>
                      <Icon type="profile" style={{fontSize:'12px'}} theme='filled' />
                      <span>信息管理</span>
                  </span>
                  </Link>
                }
              >
                <MenuItem key='1'>
                  <Link to='/passwordModify'>
                    <Icon type="edit" theme='filled' />
                    <span>修改密码</span>
                  </Link>
                </MenuItem>
                <MenuItem key='2'>
                  <Link to='#'>
                    <Icon type="mail" theme='filled' />
                    <span>基本信息</span>
                  </Link>
                </MenuItem>
              </SubMenu>
              <SubMenu
                key="sub2"
                title={
                  <Link to='#'>
                    <span>
                      <Icon type="project" style={{fontSize:'12px'}} theme='filled' />
                      <span>课程管理</span>
                  </span>
                  </Link>
                }
              >
                <MenuItem key='3'>
                  <Link to='/mineCourse'>
                    <Icon type="appstore" theme='filled' />
                    <span>我的课程</span>
                  </Link>
                </MenuItem>
                <MenuItem key="4">
                  <Link to='#'>
                    <Icon type="plus-circle" theme='filled' />
                    <span>申请课程</span>
                  </Link>
                </MenuItem>
              </SubMenu>
              <SubMenu
                key="sub3"
                title={
                  <Link to="#">
                    <span>
                      <Icon type="read" style={{fontSize:'12px'}} theme='filled' />
                      <span>作业管理</span>
                  </span>
                  </Link>
                }
              >
                <MenuItem key='5'>
                  <Link to='/seatwork'>
                    <Icon type="file-markdown" theme='filled' />
                    <span>课堂作业</span>
                  </Link>
                </MenuItem>
                <MenuItem key="6">
                  <Link to='/homework'>
                    <Icon type="file-text" theme='filled' />
                    <span>课后作业</span>
                  </Link>
                </MenuItem>
              </SubMenu>
              <SubMenu
                key='sub4'
                title={
                  <Link to='#'>
                    <span>
                      <Icon type="database" style={{fontSize:'12px'}} theme='filled' />
                      <span>课程测评</span>
                  </span>
                  </Link>
                }
              >
                <MenuItem key="7">
                  <Link to="/chapters/test">
                    <Icon type="file-word" theme='filled' />
                    <span>章节练习</span>
                  </Link>
                </MenuItem>
              </SubMenu>
              <SubMenu
                key="sub5"
                title={
                  <Link to='#'>
                    <span>
                      <Icon type="appstore" style={{fontSize:'13px'}} theme='filled' />
                      <span>课程资源</span>
                    </span>
                  </Link>
              }
              >
                <MenuItem
                  key='8'
                >
                  <Link to="/chapters/source">
                    <Icon type="file-ppt" theme="filled" />
                    <span>课程资源</span>
                  </Link>
                </MenuItem>
              </SubMenu>
              <SubMenu
                key="sub6"
                title={
                  <Link to='#'>
                    <span>
                      <Icon type="message" style={{fontSize:'12px'}} theme='filled' />
                      <span>实时客服</span>
                  </span>
                  </Link>
                }
              >
                <MenuItem key='9'>
                  <Link to='/home'>
                    <Icon type="info-circle" theme="filled" />
                    <span>系统提示</span>
                  </Link>
                </MenuItem>
                <MenuItem key='10'>
                  <Link to='#'>
                    <Icon type="cloud" theme='filled' />
                    <span>异常联系</span>
                  </Link>
                </MenuItem>
              </SubMenu>
            </Menu>
        </Sider>
        <Layout>
          <Header 
            style={{
              paddingLeft:0,
              minWidth:'350px',
            }}
          >
            <div style={{display:'flex'}}>
              <div style={{zIndex:9999}}>
                <Icon
                  className="trigger"
                  type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                  onClick={this.toggle}
                />
              </div>
              <div>
                <Dropdown overlay={menu}>
                  <div 
                    className='user'
                    style={{
                      display:'inline',
                      position:'absolute',
                      right:'5rem',
                    }}
                  >
                    <span>你好！</span>
                    &nbsp;
                    <span style={{fontStyle:'italic'}}>{userSchoolNumber}</span>
                    &nbsp;
                    <span style={{fontStyle:'italic'}}>{userName}</span> &nbsp;&nbsp;同学
                  </div>
                </Dropdown>
              </div>
            </div>
          </Header>

          <Layout 
            className='layout'
            style={{
              minWidth:'350px'
            }}
          >
              <Header 
                className='layout-header' 
                style={{
                  lineHeight: '32px',
                  height:'75px',
                  paddingLeft:0,
                  backgroundColor:'#eeeeee',
                  boxShadow:'inset 0px -2px 1px 0px #BEBEBE'
                }} 
              >
                    <div 
                      style={{
                        display:'flex',
                        fontWeight:'bold',
                        paddingLeft:'2vw',
                        paddingBottom:'1vh'
                      }}
                      >{title}</div>
                    <div 
                      style={{
                        display:'flex',
                        paddingLeft:'2vw',
                        paddingBottom:'1vh'
                        }}
                      >{describe}</div>
              </Header>
              <Content 
                style={{
                  minWidth:'350px',
                  overflow:'auto',
                  padding:'3vh 2vw'
                }}
              >
                  {this.props.children}
              </Content>
          </Layout>  
        </Layout>
      </Layout>
    );
  }
}

export default BasicLayoutForStu