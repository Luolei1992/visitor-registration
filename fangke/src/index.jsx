import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';

import "babel-polyfill";

import App from './components/App';
import Login from './components/Login';
import Register from './components/Register';
import RegisterList from './components/RegisterList';
import ShareRegister from './components/ShareRegister';
import RegisterDetail from './components/RegisterDetail';
import RegisterDetailStatic from './components/RegisterDetailStatic';


import './css/font/iconfont.css'
import './css/index.less';

import 'lib-flexible/flexible'

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Login} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/registerList" component={RegisterList} />
            <Route path="/shareRegister" component={ShareRegister} />
            <Route path="/registerDetail" component={RegisterDetail} />
            <Route path="/registerStatic" component={RegisterDetailStatic} />
        </Route>
    </Router>
    , document.getElementById('visitorWrap'));
