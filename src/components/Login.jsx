import React from 'react'
import { List, InputItem, Toast, Button, ActivityIndicator } from 'antd-mobile';
import { hashHistory } from 'react-router';
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
            animating:true,
            value: '',
            keywords: ''
        };
        this.handleAutoSend=(res)=>{
            if(res.success){
                setTimeout(() => {
                    hashHistory.push({
                        pathname: '/registerList'
                    });
                    this.setState({ animating: false })
                }, 500);
            } else {
                this.setState({ animating: false },()=>{Toast.info('快速登陆失败，请重新登陆！', 2, null, false)})
            }
        }
        this.handleSend = (res) => {
            if(res.success) {
                hashHistory.push({
                    pathname: '/registerList'
                });
                this.setState({animating:false})
            } else {
                this.setState({ animating: false },()=>{Toast.info(res.message, 2, null, false)});
            }
        }
    }

    componentDidMount() {
        // if (!!validate.getCookie('user_id')) {
        //     hashHistory.push({
        //         pathname: '/registerList'
        //     });
        // };
        runPromise("auto_login", {
            username: this.props.location.query.username || ""
        }, this.handleAutoSend, false, "post");
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
        this.setState({ animating: true })
        runPromise("login", {
            username: this.state.value,
            password: this.state.keywords
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
                                    onChange={this.onChange}
                                ><i className="phone iconfont icon-ren"></i></InputItem>

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
                                    this.onLogin();
                                }}
                            >登 陆</Button>
                        </div>

                        <ActivityIndicator
                            toast
                            text="登陆中..."
                            size="large"
                            animating={this.state.animating}
                        />
                    </div>
                </div>
            </QueueAnim >
        );
    }
}




