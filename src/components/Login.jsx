import React from 'react'
import { List, InputItem, Toast, Button, Modal, ActivityIndicator } from 'antd-mobile';
import { Link, hashHistory } from 'react-router';
import QueueAnim from 'rc-queue-anim';


const loginUrl = [
    require('../image/logo.png')
]

export default class Login extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            hasError: false,
            error: false,
            animating:false,
            // value: '15657185156',
            // keywords:'luolei251537',
            value: '17683993335',
            keywords: 'luolei1992',
            code:"",
            codeNum:2
        };
        this.handleSend = (res) => {
            console.log(res)
            if(res.success) {
                hashHistory.goBack();
            }else{
                
            }
        }
    }
    componentDidMount() {
        if(validate.getCookie('user_id')){
            hashHistory.push({
                pathname: '/login',
                query: { form: 'promise' }
            });
        };
    }
   
    onErrorClick = (val) => { //验证错误回调
        if (this.state.hasError) {
            Toast.info(val,2,null,false);
        } else if (this.state.error) {
            Toast.info(val, 2, null, false);
        }
    }
    
    onChange = (value) => {  //用户名输入
        this.setState({
            hasError: validate.CheckPhone(value).hasError,
            value:value
        });
    }
    onChangeKeyword = (value) => {   //密码输入
        this.setState({
            error: validate.CheckKeywords(value).hasError,
            keywords:value
        })
    }
    onLogin() {       //确认登陆
        runPromise("login", {
            username: this.state.value,
            password: this.state.keywords,
            code: this.state.code
        }, this.handleSend, false, "post");
    }
    render() {
        return (
            <QueueAnim className="topMargin" animConfig={[
                { opacity: [1, 0], translateX: [0, 50] }
            ]}>
                <div className="loginWrap" key="1">
                    <div className="loginIn loginCenter">
                        <div className="loginLogo">
                            <img src={loginUrl[0]} alt="" />
                        </div>
                        <h3 className="logoText">访客系统</h3>
                        <div className="loginIpt">
                            <List>
                                <InputItem
                                    type="number"
                                    placeholder="请输入您的用户名"
                                    error={this.state.hasError}
                                    maxLength={11}
                                    value={this.state.value}
                                    onErrorClick={()=>{
                                        this.onErrorClick(validate.CheckPhone(this.state.value).errorMessage);
                                    }}
                                    onChange={this.onChange}
                                ><i className="phone iconfont icon-shouji1"></i></InputItem>

                                <InputItem
                                    type="password"
                                    placeholder="请输入密码"
                                    error={this.state.error}        
                                    value={this.state.keywords}                                                                                       
                                    maxLength={18}
                                    onErrorClick={() => {
                                        this.onErrorClick(validate.CheckKeywords(this.state.keywords).errorMessage);
                                    }}
                                    onChange={this.onChangeKeyword}
                                ><i className="pwd iconfont icon-icon-test"></i></InputItem>
                            </List>
                        </div>
                        <div>
                            <Button type="warning"
                                className="loginBtn"
                                onClick={()=>{
                                    hashHistory.push({
                                        pathname: '/register'
                                    });
                                }}
                            >登 陆</Button>
                        </div>
                        {/* <ActivityIndicator
                            toast
                            text="登陆中..."
                            animating={this.state.animating}
                        /> */}
                    </div>
                </div>
            </QueueAnim >
        );
    }
}



