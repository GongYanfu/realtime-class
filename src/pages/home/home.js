import React, { Component, Fragment } from 'react'

import BasicLayoutForTea from '../../components/BasicLayoutForTea/BasicLayoutForTea'
import BasicLayoutForStu from '../../components/BasicLayoutForStu/BasicLayoutForStu'
import { getItem, KEYS } from '../../utils/localStorage'

import './home.scss'

class Home extends Component {
    constructor(props){
        super(props)
        this.state = {
            userType:'',
            userName:''
        }
    }

    componentDidMount = () => {
        const userInfo = JSON.parse(getItem(KEYS.KEY_CUR_USERINFO))
        if(userInfo){
            const { userType, userName } = userInfo
            console.log(userName, userType)
            this.setState({
                userType,
                userName
            })
        }
    }

    render(){
        const { userName, userType } = this.state
        return (
            <Fragment>
                {
                    userType === 'student'
                    ?   <BasicLayoutForStu title='系统提示' describe='本页用于向用户展示暂有功能与操作'>
                        <div className="bruce">
                            <ul className="bubble-bgwall">
                                <li>命题</li>
                                <li>二元关系</li>
                                <li>集合</li>
                                <li>约束变元</li>
                                <li>自由变元</li>
                                <li>笛卡尔积</li>
                                <li>范式</li>
                                <li>等价类</li>
                                <li>有向图</li>
                                <li>无向图</li>
                                <div style={{position:'absolute',left:'2%',top:'10%',textAlign:'left'}}>
                                    <p style={{fontFamily:'Microsoft Yahei',fontWeight:'bold',color:'black'}}><span style={{fontStyle:'italic',color:'#0000e3'}}>{userName}同学</span>，您好！本系统操作教程大致如下:</p>
                                    <p style={{fontFamily:'Microsoft Yahei',fontWeight:'bold',color:'black'}}> 目前开放的功能模块主要是&nbsp;<span style={{fontStyle:'italic',color:'#0000e3'}}>作业图片上传功能。</span>&nbsp;</p>
                                    <p style={{fontFamily:'Microsoft Yahei',fontWeight:'bold',color:'black'}}>
                                        你可以在&nbsp;
                                        <span style={{fontStyle:'italic',color:'#0000e3'}}>课程管理>>我的课程</span>
                                        &nbsp;中实现对自己参加课程信息的查看;
                                    </p>
                                    <p style={{fontFamily:'Microsoft Yahei',fontWeight:'bold',color:'black'}}>
                                        在&nbsp;<span style={{fontStyle:'italic',color:'#0000e3'}}>作业管理>>课堂作业</span>
                                        &nbsp;中查看自己的课堂作业的内容以及作业的上传;
                                    </p>
                                    <p style={{fontFamily:'Microsoft Yahei',fontWeight:'bold',color:'black'}}>
                                        在&nbsp;<span style={{fontStyle:'italic',color:'#0000e3'}}>作业管理>>课后作业</span>
                                        &nbsp;中查看自己的课后作业的内容以及作业的上传。
                                    </p>
                                    <p style={{fontFamily:'Microsoft Yahei',fontWeight:'bold',color:'black'}}>
                                        其中课堂作业只能提交一次并且在截止之前可以对其进行更改;</p>
                                    <p style={{fontFamily:'Microsoft Yahei',fontWeight:'bold',color:'black'}}>
                                        课后作业在看见答案之前与之后各有一次上传机会,当然在截止之前可以分别对其进行更改。
                                    </p>
                                    <p style={{fontFamily:'Microsoft Yahei',fontWeight:'bold',color:'black'}}>
                                        作业上传时默认为第一次提交。当上传过课后作业之后再次上传时,如果想要更改第一次的提交则选择
                                        &nbsp;<span style={{fontStyle:'italic',color:'#0000e3'}}>首次重传</span>,
                                        &nbsp;第二次提交或者重传则选择&nbsp;<span style={{fontStyle:'italic',color:'#0000e3'}}>第二次上传(重传)</span>
                                    </p>
                                    <p style={{fontFamily:'Microsoft Yahei',fontWeight:'bolder',color:'black'}}>Tip: 目前只支持文件单选,抱歉</p>
                                </div>
                            </ul>
                        </div>
                        </BasicLayoutForStu>
                    :   <BasicLayoutForTea title='系统提示' describe='本页用于向用户展示暂有功能与操作'>
                        <div className="bruce">
                            <ul className="bubble-bgwall">
                                <li>命题</li>
                                <li>二元关系</li>
                                <li>集合</li>
                                <li>约束变元</li>
                                <li>自由变元</li>
                                <li>笛卡尔积</li>
                                <li>范式</li>
                                <li>等价类</li>
                                <li>有向图</li>
                                <li>无向图</li>
                                <div style={{position:'absolute',left:'2%',top:'10%',textAlign:'left'}}>
                                    <p style={{fontFamily:'Microsoft Yahei',fontWeight:'bold',color:'black'}}><span style={{fontStyle:'italic',color:'#0000E3'}}>{userName}老师</span>，您好！本系统操作教程大致如下:</p>
                                    <p style={{fontFamily:'Microsoft Yahei',fontWeight:'bolder',color:'black'}}>目前开放的功能模块主要是&nbsp;<span style={{fontStyle:'italic',color:'#0000e3'}}>创建课程、作业上传以及作业批改功能</span>&nbsp;。</p>
                                    <p style={{fontFamily:'Microsoft Yahei',fontWeight:'bolder',color:'black'}}>你可以在&nbsp;<span style={{fontStyle:'italic',color:'#0000e3'}}>课程管理>>我的课程</span>&nbsp;中查看自己所创建的课程;</p>
                                    <p style={{fontFamily:'Microsoft Yahei',fontWeight:'bolder',color:'black'}}>在&nbsp;<span style={{fontStyle:'italic',color:'#0000e3'}}>作业管理>>添加课程</span>&nbsp;中创建自己的课程;</p>
                                    <p style={{fontFamily:'Microsoft Yahei',fontWeight:'bolder',color:'black'}}>在&nbsp;<span style={{fontStyle:'italic',color:'#0000e3'}}>作业管理>>作业发布</span>&nbsp;中创建课堂/课后作业;</p>
                                    <p style={{fontFamily:'Microsoft Yahei',fontWeight:'bolder',color:'black'}}>在&nbsp;<span style={{fontStyle:'italic',color:'#0000e3'}}>作业管理>>作业发布</span>&nbsp;中创建课堂/课后作业;</p>
                                    <p style={{fontFamily:'Microsoft Yahei',fontWeight:'bolder',color:'black'}}>在&nbsp;<span style={{fontStyle:'italic',color:'#0000e3'}}>作业管理>>作业管理</span>&nbsp;中查看或者编辑自己已经发布的作业;</p>
                                    <p style={{fontFamily:'Microsoft Yahei',fontWeight:'bolder',color:'black'}}>在&nbsp;<span style={{fontStyle:'italic',color:'#0000e3'}}>作业管理>>作业批改</span>&nbsp;中查看学生上传作业的情况以及批阅各学生作业。</p>
                                    <p style={{fontFamily:'Microsoft Yahei',fontWeight:'bolder',color:'black'}}>Tip: 目前只支持文件单选,抱歉</p>
                                </div>
                            </ul>
                        </div>
                        </BasicLayoutForTea>
                }
            </Fragment>
        )
    }
}

export default Home