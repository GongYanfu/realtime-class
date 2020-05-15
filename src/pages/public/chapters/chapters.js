import React,{ Component, Fragment } from 'react'
import BasicLayoutForStu from '../../../components/BasicLayoutForStu/BasicLayoutForStu'
import BasicLayoutForTea from '../../../components/BasicLayoutForTea/BasicLayoutForTea'
import { getItem, KEYS} from '../../../utils/localStorage'
import BasicChapterForTest from '../../../components/BasicChapterForTest/BasicChapterForTest'
import BasicChapterForSource from '../../../components/BasicChapterForSource/BasicChapterForSource'
import './chapters.scss'

class Chapters extends Component {
    constructor(props){
        super(props)
        this.state = {
            courses:[]
        }
    }

    handleRefresh = () =>{
        window.location.reload()
    }

    render(){
        const { userType } = JSON.parse(getItem(KEYS.KEY_CUR_USERINFO))
        const { history } = this.props
        const { type: pageType } = this.props.match.params
        //根据Type显示不同按钮内容
        return (
            <Fragment>
            {
                userType === 'student'
                ?   <BasicLayoutForStu 
                        title={pageType==='test' ? '章节目录' : '资源目录'} 
                        describe={pageType==='test' ? '本业用于展示所有测试章节目录' : '本业用于展示所有资源章节目录'}
                    >
                        {
                            pageType === 'test'
                            ?   <BasicChapterForTest pageType={pageType} history={history} onRefresh={this.handleRefresh}/>
                            :   <BasicChapterForSource pageType={pageType} history={history} onRefresh={this.handleRefresh}/>
                        }
                    </BasicLayoutForStu>
                :   <BasicLayoutForTea 
                        title={pageType==='test' ? '章节目录' : '资源目录'} 
                        describe={pageType==='test' ? '本业用于展示所有测试章节目录' : '本业用于展示所有资源章节目录'}
                    >
                        {
                            pageType === 'test'
                            ?   <BasicChapterForTest pageType={pageType} history={history} onRefresh={this.handleRefresh}/>
                            :   <BasicChapterForSource pageType={pageType} history={history} onRefresh={this.handleRefresh}/>
                        }
                    </BasicLayoutForTea>
            }
            </Fragment>
        )
    }
}

export default Chapters