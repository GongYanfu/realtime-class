import React, { Component } from 'react'
import {
    Button,
    Input
} from 'antd'
import MathJax from 'react-mathjax3'
 
const html = '$\\sum\\limits_{i = 0}^n {i^2 } = \\frac{n(n + 1)(2n + 1)}{6}$<br>Have a good day!'

class AutoKeyboard extends Component {
    constructor(props){
        super(props)
        this.state = {
            info:''
        }
    }

    render(){
        const tex = `f(x) = \\int_{-\\infty}^\\infty\\hat f(\\xi)\\,e^{2 \\pi i \\xi x}\\,d\\xi`
        return (
            <div>
                <div>Hello</div>
                <MathJax.Context
                    input='tex'
                    onLoad={ () => console.log("Loaded MathJax script!") }
                    onError={ (MathJax, error) => {
                        console.warn(error);
                        console.log("Encountered a MathJax error, re-attempting a typeset!");
                        MathJax.Hub.Queue(
                        MathJax.Hub.Typeset()
                        );
                    } }
                    script="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js"
                    options={ {
                        messageStyle: 'none',
                        extensions: ['tex2jax.js'],
                        jax: ['input/TeX', 'output/HTML-CSS'],
                        tex2jax: {
                            inlineMath: [['$', '$'], ['\\(', '\\)']],
                            displayMath: [['$$', '$$'], ['\\[', '\\]']],
                            processEscapes: true,
                        },
                        TeX: {
                            extensions: ['AMSmath.js', 'AMSsymbols.js', 'noErrors.js', 'noUndefined.js']
                        }
                    } }
                >
                    <MathJax.Html html={ html } />
                </MathJax.Context>
            </div>
        )
    }
}

export default AutoKeyboard