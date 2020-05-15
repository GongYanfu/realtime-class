import React, { Component } from 'react'
import './BasicFooter.css'

class BasicFooter extends Component {
    render() {
        return (
            <div className='basic-footer-body'>
                <div className='basic-footer-item'>
                    <div className='a-box'><a href='http://www.ss.uestc.edu.cn/' target='_blank'>信息与软件工程学院</a></div>
                    <div className='a-box'><a href='#' target='_blank'>帮助</a></div> 
                </div>     
                <div className='basic-footer-item a-box'>
                    Copyright&nbsp;UESTC&nbsp;电子科技大学
                </div>          
            </div>
        )
    }
}

export default BasicFooter