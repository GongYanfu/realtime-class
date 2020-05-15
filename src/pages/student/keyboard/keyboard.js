import React, { Component } from 'react'
import {
    Input,
    Button
}
from 'antd'
import MathJax from 'react-mathjax-preview'

const {TextArea} = Input

class AutoKeyboard extends Component {
    constructor(props){
        super(props)
        this.state ={
            latexString:"P $\\wedge $Q $\\to $P",
            commonString:'',
            symbols:[],
            answer:''
        }
    }

    componentDidMount = () => {
        const { symbols } = this.props
        this.setState({
            symbols: symbols.split('  ')
        })
    }

    handleChange = (e) => {
        const { id}  =this.props
        const { value } = e.target
        this.props.onChange(id, value)
        this.setState({
            answer: value
        })
    }
    handleClick = (symbol) => {
        const { id } = this.props
        const string = `$${symbol} $`
        this.setState({
            answer: this.state.answer+string
        })
        this.props.onChange(id, this.state.answer+string)
    }

    render(){
        const { symbols, answer } = this.state
        const { id } = this.props
        return (
            <div>
                <div>
                    {
                        symbols.map((item,index) => {
                            if((index+1)%8===0){
                                return <br key={index}/>
                            }
                            return  <Button 
                                        key={index}
                                        size='small' 
                                        type='default' 
                                        style={{marginRight:"5px",color:'black'}}
                                        onClick={this.handleClick.bind(this,item)}
                                    >
                                        <MathJax math={`$${item} $`} />
                                    </Button>
                        })
                    }
                </div>
                <div>
                    <TextArea
                        ref={`textarea${id}`}
                        rows={6}
                        value={answer}
                        style={{
                            width:'300px',
                            border:'1px solid rgba(0,0,0,0.5)'
                        }}
                        onChange={this.handleChange}
                    />
                    <div
                        style={{
                            width:'300px',
                            height:'100px',
                            overflow:'auto',
                            border:'1px solid rgba(0,0,0,0.5)'
                        }}
                    >
                        <MathJax math={answer} />
                    </div>
                </div>
            </div>
        )
    }
}

export default AutoKeyboard