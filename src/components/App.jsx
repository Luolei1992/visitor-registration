import React, { Component } from 'react'
import { hashHistory } from 'react-router';


export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    componentDidMount() {
        
    }
    render() {
        return (
            <div>
                {this.props.children && React.cloneElement(this.props.children, { state: this.state, props: this.props, setState: this.setState.bind(this) })}
                
            </div>
        );
    }
}

App.contextTypes = {
    router: React.PropTypes.object
};