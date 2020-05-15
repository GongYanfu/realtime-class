import React,{ Component } from 'react'
import { Link } from 'react-router-dom'
import { 
    Button, 
    message, 
    Card,
    Icon,
    Row,
    Col,
    Result
} from 'antd'
import axios from 'axios'
import { getItem, KEYS } from '../../../../utils/localStorage'
import BasicLayoutForStu from '../../../../components/BasicLayoutForStu/BasicLayoutForStu'
import TernaryOperator from '../../../../components/TernaryOperator/TernaryOperator'

const { Meta } = Card

class CheckSource extends Component {
    constructor(props){
        super(props)
        this.state = {
            chapter:{},
            courseId:'',
            course:{},
            resources:[]
        }
    }

    componentDidMount = () => {
        this.loadData()
    }
    loadData = async() => {
        const { chapter, courseId } = JSON.parse(getItem(KEYS.KEY_CUR_CHAPTER))
        this.setState({
            chapter,
            courseId
        })
        try {
            const res = await axios({
                url:'http://118.24.233.16:8080/homeworkManager/Resources/List',
                method:'get',
                params:{
                    courseId: courseId,
                    chapterId: chapter.nodeid
                }
            })
            if(res && res.status===200){
                const { data } = res
                const { msg, code, data:resources } = data
                if(msg==='ok' || code===200){
                    this.setState({
                        resources
                    })
                }
                else{
                    message.error(data,2)
                }
            }
            else{
                message.error('获取本章学习资源失败！！！',2)
            }
        }
        catch(error){
            message.error('系统错误，刷新页面或者联系管理员！！',2)
        }

    }
    handleReset = () => {
        window.location.reload()
    }

    handleStudy = (resource) => {
        const { resoursepath } = resource
        if(resoursepath){
            window.open('http://118.24.233.16:8012/onlinePreview?url=http://118.24.233.16:8080'+resoursepath)
        }
    }

    render(){
        const { chapter, resources } = this.state
        return (
            <BasicLayoutForStu 
                title={`资源学习/${chapter.nodeindex} ${chapter.nodename}`} 
                describe='本页用于课程资源(视频、PDF、PPT等)在线学习'
            >
                <TernaryOperator boolean={resources.length!==0}>
                    <Row type='flex' justify='start' gutter={[48,64]}>
                    {
                        resources.map((item,index) =>{
                            return  <Col key={index}>
                                        <Card
                                            style={{
                                                width:'10rem'
                                            }}
                                            actions={[
                                                <Link
                                                    to='#'
                                                    onClick={this.handleStudy.bind(this,item)}
                                                >
                                                    <Icon 
                                                        type='android' 
                                                        style={{fontSize:18}} 
                                                    />
                                                    在线学习
                                                </Link>
                                            ]}
                                        >
                                        <Meta
                                            title={item.name}
                                        />
                                        </Card>
                                    </Col>
                        })
                    }
                    </Row>
                </TernaryOperator>
                <TernaryOperator boolean={resources.length===0}>
                    <Result
                        status="500"
                        title="500"
                        subTitle="系统错误，刷新页面或者联系管理员！"
                        extra={<Button type="primary" onClick={this.handleReset}>刷新页面</Button>}
                    />
                </TernaryOperator>
            </BasicLayoutForStu>
        )
    }
}

export default CheckSource