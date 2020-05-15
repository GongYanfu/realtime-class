import React,{ Component, Fragment } from 'react'

class TernaryOperator extends Component {
    render(){
        const { children, boolean } = this.props
        return (
            <Fragment>
                {
                    boolean === true
                    ? children
                    : null
                }
            </Fragment>
        )
    }
}

export default TernaryOperator