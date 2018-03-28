import React, { Component } from 'react'
import { Router, Route, hashHistory, IndexRoute, Link } from 'react-router';
import QueueAnim from 'rc-queue-anim';
import { TabBar } from 'antd-mobile';


export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    componentDidMount() {
        if (validate.getCookie('user_id')) {
            hashHistory.push({
                pathname: '/login',
                query: { form: 'promise' }
            });
        };
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