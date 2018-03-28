import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory, IndexRoute, Link } from 'react-router';

import App from './components/App';
import Login from './components/Login';


import './css/font/iconfont.css'
import './css/index.less';

import 'lib-flexible/flexible'

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            {/* <IndexRoute component={Index} /> */}
        </Route>
        <Route path="/login" component={Login} />
    </Router>
    , document.getElementById('visitorWrap'));
