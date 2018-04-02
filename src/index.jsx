import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';

import App from './components/App';
import Login from './components/Login';
import Register from './components/Register';
import RegisterList from './components/RegisterList';
import RegisterDetail from './components/RegisterDetail';
import RegisterDetailStatic from './components/RegisterDetailStatic';
import ShareRegister from './components/ShareRegister';


import './css/font/iconfont.css'
import './css/index.less';

import 'lib-flexible/flexible'

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={RegisterList} />
            <Route path="/registerList" component={RegisterList} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/registerDetail" component={RegisterDetail} />
            <Route path="/registerStatic" component={RegisterDetailStatic} />
            <Route path="/shareRegister" component={ShareRegister} />
        </Route>
    </Router>
    , document.getElementById('visitorWrap'));
