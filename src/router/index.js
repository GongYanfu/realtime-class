import React, { Component } from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import CustomRoute from './custom'

import Login from '../pages/public/login/login'
import Home from '../pages/public/home/home'
import MineCourse from '../pages/public/mine/mineCourse'
import Chapters from '../pages/public/chapters/chapters'
import PassModify from '../pages/public/passModify/passModify'

import Seatwork from '../pages/student/manageTask/seatwork/seatwork'
import Homework from '../pages/student/manageTask/homework/homework'
import CheckTask from '../pages/student/manageTask/check/check'
import UploadResult from '../pages/student/manageTask/upload/upload'
import CheckReview from '../pages/student/manageTask/check/review'
import Evaluate from '../pages/student/manageChapter/evaluate/evaluate'
import AutoKeyboard from '../pages/student/keyboard/keyboard'
import CheckSource from '../pages/student/manageSource/check/check'

import AddTask from '../pages/teacher/addTask/addTask'
import TaskTable from '../pages/teacher/checkTask/checkTask'
import AllTasks from '../pages/teacher/manageTask/manage'
import ResultTable from '../pages/teacher/correctTask/correct'
import CorrectResult from '../pages/teacher/correctResult/correctResult'
import AddCourse from '../pages/teacher/courseManage/addCourse/addCourse'
import CheckChapters from '../pages/teacher/manageChapter/check/check'
import UploadSource from '../pages/teacher/manageSource/upload/upload'

class MyRoute extends Component {
    render() {
        return (
                <Router>
                    <Switch>
                        <Route exact path='/autoKeyboard' component={AutoKeyboard} />
                        <Route exact path='/' component={Login} />
                        <CustomRoute path='/mineCourse' component={MineCourse} />
                        <CustomRoute path='/home' component={Home} />
                        <CustomRoute path='/chapters/:type' component={Chapters} />
                        <CustomRoute path='/passwordModify' component={PassModify} />

                        <CustomRoute path='/seatwork' component={Seatwork} />
                        <CustomRoute path='/checkTask' component={CheckTask} />
                        <CustomRoute path='/upload' component={UploadResult} />
                        <CustomRoute path='/homework' component={Homework} />
                        <CustomRoute path='/checkReview' component={CheckReview} />
                        <Route path='/evaluate' component={Evaluate} />
                        <CustomRoute path='/checkSource' component={CheckSource} /> 

                        <CustomRoute path='/addTask' component={AddTask} />
                        <CustomRoute path='/allClassworks' component={AllTasks} />
                        <CustomRoute path='/taskTable' component={TaskTable} />
                        <CustomRoute path='/resultTable' component={ResultTable} />
                        <CustomRoute path='/correctResult' component={CorrectResult} />
                        <CustomRoute path='/addCourse' component={AddCourse} />
                        <CustomRoute path='/checkChapters' component={CheckChapters} /> 
                        <CustomRoute path='/uploadSource' component={UploadSource} /> 
                    </Switch>
                </Router>
        )
    }
}

export default MyRoute