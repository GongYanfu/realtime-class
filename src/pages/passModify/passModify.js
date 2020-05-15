import React, { Component } from 'react';
import PasswordModify from '../../components/ModifyPassword/ModifyPassword'
import './passModify.css';

class PassModify extends Component {
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div className="App">
                <PasswordModify type='teacher'></PasswordModify>
            </div>
        )
    }
}

export default PassModify;