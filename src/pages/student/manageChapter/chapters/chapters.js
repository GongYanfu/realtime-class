import React,{ Component, Fragment } from 'react'
import { 
    Menu, 
    Button,
} from 'antd'
import { Link } from 'react-router-dom'
import BasicLayoutForStu from '../../../../components/BasicLayoutForStu/BasicLayoutForStu'

const MenuItem = Menu.Item
const { SubMenu } = Menu

class Chapters extends Component {
    constructor(props){
        super(props)
    }

    handleToEvaluate = (e) => {
        e.preventDefault()
        const { history } = this.props
        history.push('/evaluate')
    }

    render(){
        return (
            <BasicLayoutForStu title='章节测评' describe='本业用于展示所有章节内容'>
                <Fragment>
                    <Menu
                        mode='inline'
                        style={{width:'60vw',backgroundColor:'rgba(0,0,0,0.1'}}
                    >
                        <SubMenu
                            key="sub1"
                            title={
                                <h4 style={{fontWeight:"bold"}}>第一章节 集合论基础</h4>
                            }
                            style={{marginBottom:'5vh'}}
                        >
                            <MenuItem key="3" title='1.1节'>
                                <Link to='#'>
                                    <span style={{fontWeight:'bold'}}>1.1节 集合的初见</span>
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
                            <Menu.Divider/>
                            <MenuItem key="4" title='1.2节'>
                                <Link to='#'>
                                    <span style={{fontWeight:'bold'}}>1.2节 特殊集合与特殊聚合关系</span>
                                    <Button 
                                        type='primary'
                                        size='default'
                                        style={{float:'right'}}
                                    >
                                        前往测评 >
                                    </Button>
                                </Link>
                            </MenuItem>
                            <Menu.Divider/>
                            <MenuItem key="4" title='1.3节'>
                                <Link to='#'>
                                    <span style={{fontWeight:'bold'}}>1.3节 集合的运算</span>
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
                        <Menu.Divider/>
                        <SubMenu
                            key="sub2"
                            title={
                                <h4 style={{fontWeight:"bold"}}>第二章节 命题逻辑</h4>
                            }
                            style={{marginBottom:'5vh'}}
                        >
                            <MenuItem key="3" title='1.1节'>
                                <Link to='#'>
                                    <span style={{fontWeight:'bold'}}>2.1节 什么是命题</span>
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
                            <Menu.Divider/>
                            <MenuItem key="4" title='1.2节'>
                                <Link to='#'>
                                    <span style={{fontWeight:'bold'}}>2.2节 命题联结词</span>
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
                        <Menu.Divider/>
                        <SubMenu
                            key="sub3"
                            title={
                                <h4 style={{fontWeight:"bold"}}>第三章节 谓词逻辑</h4>
                            }
                            style={{marginBottom:'5vh'}}
                        >
                            <MenuItem key="3" title='1.1节'>
                                <Link to='#'>
                                    <span style={{fontWeight:'bold'}}>3.1节 范式</span>
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
                            <Menu.Divider/>
                            <MenuItem key="4" title='1.2节'>
                                <Link to='#'>
                                    <span style={{fontWeight:'bold'}}>3.2节 主范式</span>
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
                            <Menu.Divider/>
                            <MenuItem key="4" title='1.2节'>
                                <Link to='#'>
                                    <span style={{fontWeight:'bold'}}>3.3节 命题蕴含公式</span>
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
                    </Menu>
                </Fragment>
            </BasicLayoutForStu>
        )
    }
}

export default Chapters