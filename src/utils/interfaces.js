import axios from 'axios'
import { message } from 'antd'

export const getMineCourse = async(userType,userId) => {
    try{
        const res = await axios({
            url: userType==='teacher' ? 'http://118.24.233.16:8080/homeworkManager/course/getbyteacherId' : 'http://118.24.233.16:8080/homeworkManager/course/getbystudentId',
            method:'get',
            params: userType==='teacher' ? { courseTeacherId: userId } : { studentId: userId }
        })
        return res;
    } catch (error) {
        message.error('系统错误，刷新重试或者联系管理员！！！',2)
        return null;
    }
}