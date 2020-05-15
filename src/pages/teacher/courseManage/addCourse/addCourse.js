import React,{ Component } from 'react'
import { 
    Form, 
    Button, 
    Input, 
    DatePicker, 
    message,
    Icon
} from 'antd'
import axios from 'axios'
import moment from 'moment'
import Qs from 'qs'
import { getItem, KEYS } from '../../../../utils/localStorage'
import BasicLayoutForTea from '../../../../components/BasicLayoutForTea/BasicLayoutForTea'

const FormItem = Form.Item

class AddCoursePage extends Component {
    constructor(props){
        super(props)
        this.state = {
            courseId:'',
            courseName:'',
            courseTimes:'',
            courseBeginTime:'',
            courseTeacherId:'',
            courseType:'',
            uploading: false
        }
    }

    componentDidMount = async() => {
        const { userId } = JSON.parse(getItem(KEYS.KEY_CUR_USERINFO))
        this.setState({
            courseTeacherId: userId,
            courseBeginTime: moment()
        })
    }

    handleCourseNameInput = (e) => {
        this.setState({
            courseName: e.target.value
        })
    }
    handleCourseTimesInput = (e) => {
        this.setState({
            courseTimes: e.target.value
        })
    }
    handleCourseTypeInput = (e) => {
        this.setState({
            courseType: e.target.value
        })
    }
    handleCourseBeginTimeInput = (value, dateString) =>{
        this.setState({
            courseBeginTime: dateString
        })
    }

    handleSubmit = async() => {
        const { courseTeacherId, courseName, courseTimes, courseType, courseBeginTime } = this.state
        const { history } = this.props
        if(courseTeacherId && courseName && courseTimes && courseType && courseBeginTime){
            this.setState({
                uploading: true
            })
            const res = await axios({
                method:'post',
                url:'http://118.24.233.16:8080/homeworkManager/course/add',
                data: Qs.stringify({
                    courseName: courseName,
                    courseTeacherId: courseTeacherId,
                    courseTimes: courseTimes,
                    courseType: courseType,
                    courseSize: 9999,
                    courseBeginTime: courseBeginTime
                })
            })
            if(res && res.status===200){
                if(res.data==='ok'){
                    this.setState({
                        uploading: false
                    })
                    message.info('添加课程成功！！',2)
                    history.push('/mineCourse')
                }
                else{
                    message.warn('添加课程失败！！',2)
                    this.setState({
                        uploading: false
                    })
                }
            }
            else{
                message.warn('添加课程失败！！',2)
                this.setState({
                    uploading: false
                })
            }
        }
        else{
            message.warn('请先完善信息！！！',2)
        }
    }

    handleReset = () => {
        window.location.reload()
    }

    render(){
        const FormItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 8 },
        }
        const ButtonItemLayout = {
            wrapperCol: { 
                span: 7, 
                offset: 4
            }
        }
        const { getFieldDecorator } = this.props.form;
        const config = {
            rules: [{ type: 'object', message: 'Please select time!' }],
        }
        const { courseTeacherId, courseName, courseTimes, courseType, uploading } = this.state
        return (
            <BasicLayoutForTea title='课程管理/添加课程' describe='本页用于创建课程'>
                <div style={{width:'40vw'}}>
                    <Form {...FormItemLayout}>
                        <FormItem label='教师ID号'>
                            <Input value={courseTeacherId} disabled />
                        </FormItem>
                        <FormItem label='课程名称'>
                            <Input value={courseName} onChange={this.handleCourseNameInput} placeholder='请输入课程名称' />
                        </FormItem>
                        <FormItem label='课时数量'>
                            <Input value={courseTimes} onChange={this.handleCourseTimesInput} placeholder='请输入课时数' />
                        </FormItem>
                        <FormItem label='课程类型'>
                            <Input value={courseType} onChange={this.handleCourseTypeInput} placeholder='请输入课程类型' />
                        </FormItem>
                        <FormItem label="开始时间">
                            {getFieldDecorator('picker', config)(
                                <DatePicker 
                                    showTime
                                    onChange={this.handleCourseBeginTimeInput}
                                    format="YYYY-MM-DD HH:mm:ss" 
                                    placeholder='请选择课程开始时间'         
                            />
                            )}
                        </FormItem>
                        <FormItem {...ButtonItemLayout}>
                            <Button.Group>
                                <Button 
                                    type='danger'
                                    onClick={this.handleReset}
                                >
                                    <Icon type='delete' />
                                    重置
                                </Button>
                                <Button 
                                    type="primary"
                                    loading={uploading}
                                    onClick={this.handleSubmit}
                                >
                                    <Icon type="plus-square" />
                                    添加
                                </Button>
                            </Button.Group>
                        </FormItem>
                    </Form>
                </div>
            </BasicLayoutForTea>
        )
    }
}

const AddCourse = Form.create({name:'add'})(AddCoursePage)
export default AddCourse