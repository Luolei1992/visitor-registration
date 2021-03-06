import React, { Component } from 'react'
import { Router, Route, hashHistory, IndexRoute, Link } from 'react-router';
import QueueAnim from 'rc-queue-anim';
import { NavBar, Icon, InputItem, List, WhiteSpace, ImagePicker, DatePicker, TextareaItem, Toast, Flex, Radio  } from 'antd-mobile';
import { Line, Jiange } from './Template'

import PhotoSwipeItem from './photoSwipeElement.jsx';
import '../js/photoswipe/photoswipe.css';
import '../js/photoswipe/default-skin/default-skin.css';
import PhotoSwipe from '../js/photoswipe/photoswipe.min.js';
import PhotoSwipeUI_Default from '../js/photoswipe/photoswipe-ui-default.min.js';

let openPhotoSwipe = function (items, index) {  //图片预览插件
    let pswpElement = document.querySelectorAll('.pswp')[0];
    let options = {
        index: index,
        showAnimationDuration: 100,
        hideAnimationDuration: 100
    }
    let gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();
}

let size = [];
export default class RegisterDetailStatic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: false,
            files: [],
            isSelect: true,   //控制证件类型的颜色
            ids: [],     //上传图片id
            time: "",
            isCardType: false,
            cardType: "身份证",
            hasError: false,
            hasError1:false,
            disabled:true,
            isShow:false,
            selec:false,
            name: "",      //访客姓名
            title: "",     //性别
            phone: "",     //手机号码
            person: "",    //来访人数
            dateCome: "",  //来访时间
            dateLeave: "",   //离开时间
            card: "",   //证件号码
            reason: "",   //来访事由
            carNum: "",     //来访车牌
            identity: ""    //访客身份
        };
        this.handleVisitDetail = (res) => {
            if(res.success) {
                this.setState({
                    isShow: res.data.appendixs.length>0?true:false,
                    name: res.data.visitor_name,
                    phone: res.data.phone,
                    person: res.data.person_num,
                    dateCome: this.dateResize(res.data.start_time),
                    dateLeave: this.dateResize(res.data.end_time),
                    identity_type: 0,
                    card: res.data.identity_num,
                    reason: res.data.purpose,
                    title: res.data.gender,  //多出参数
                    is_vip: 0,   //多出参数
                    person_name: "", //多出参数
                    files: this.newArray(res.data.appendixs),
                    carNum: res.data.plate_num,  //缺少参数(访客车牌)
                    selec: res.data.is_vip, //缺少参数(访客身份)
                })
            }
        };
    }
    dateResize = (date) =>{
        let fstDate = date.split(" ")[0];
        let secDate = date.split(" ")[1].split(":");
        secDate.splice(2,1);
        return fstDate + ' ' + secDate.join(":")
    }
    newArray = (arr) => {
        let newArr = [];
        arr.map((value)=>{
            let tmp = {};
            tmp.id = value.id;
            tmp.url = "http://"+value.path;
            tmp.width = value.width;
            tmp.height = value.height;
            newArr.push(tmp);
        })
        return newArr;
    }
    componentDidMount() {
        // if (!validate.getCookie('user_id')) {
        //     hashHistory.push({
        //         pathname: '/login'
        //     });
        // };
        this.props.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave
        )
        runPromise('get_visitor_info', {
            visitor_id: this.props.location.query.id
        }, this.handleVisitDetail, false, "post");
    }

    onTouchImg = (index) => {   //点击图片开始预览
        let items = [];
        this.state.files.map((value) => {
            let item = {};
            item.w = value.width || 300;
            item.h = value.height || 300;
            item.src = value.url;
            items.push(item);
        })
        openPhotoSwipe(items, index);
    }
    render() {
        return (
            <div className="registerWrap">
                <NavBar
                    mode="dark"
                    className="pubHeadStyle"
                    icon={<p>
                        <Icon type="left" size="lg" color="#fff" />
                        <i >返回</i>
                    </p>}
                    onLeftClick={() => hashHistory.goBack()}
                    // rightContent={[
                    //     <Icon key="1" type="ellipsis" color="#fff" />,
                    // ]}
                >访客详细</NavBar>
                <div className="centerWrap">
                    <div className="pubStyleList">
                        <div className="registerSuccess">
                            <div className="alignCenter">
                                <i className="iconfont icon-icon fn-left"></i>
                                <div className="fn-left wrap">
                                    <p className="fst">成功提交</p>
                                    <p>等待管理员审核!</p>
                                </div>
                            </div>
                            <p className="link">
                                <span style={{padding:"6px 0"}} onClick={() => { hashHistory.push({ pathname: '/registerList'})}}>访客列表</span> <i>|</i> 
                                <span style={{padding:"6px 0"}} onClick={() => { hashHistory.push({ pathname: '/register' }) }}>继续添加</span>
                            </p>
                        </div>
                        <List>
                            <InputItem
                                clear
                                editable={this.state.edit}
                                ref={el => this.autoFocusInst = el}
                                value={this.state.name} 
                                style={{ textAlign: "right" }}
                                onChange={(value)=>{this.setState({name:value})}}
                            >访客姓名</InputItem>
                            <div className="datePickerWrap">
                                <div className="pickerLeft">
                                    性别
                                </div>
                                <div className="wrapTwoPicker" style={{textAlign:"right",paddingRight:"15px"}}>
                                    {this.state.title=="1"?"男":this.state.title=="2"?"女":""}
                                </div>
                            </div>
                            <InputItem
                                clear
                                editable={this.state.edit}
                                // error={this.state.hasError}
                                style={{ color: this.state.hasError ? "red" : "#6d6d6d",textAlign:"right"}}
                                // onErrorClick={() => {
                                //     this.onErrorClick(validate.CheckPhone(this.state.phone).errorMessage);
                                // }}
                                value={this.state.phone}
                                onChange={this.onChangePhone}
                                ref={el => this.customFocusInst = el}
                            >联系电话</InputItem>
                            <InputItem
                                clear
                                editable={this.state.edit}
                                ref={el => this.customFocusInst = el}
                                type="number"
                                value={this.state.person}
                                style={{ textAlign: "right"}}
                                onChange={(value)=>{this.setState({person:value})}}
                            >来访人数</InputItem>

                            <div className="datePickerWrap">
                                <div className="pickerLeft">
                                    来访时间
                                </div>
                                <div className="wrapTwoPicker">
                                    <input className="fn-left" placeholder="来访时间" value={this.state.dateCome} readOnly style={{textAlign:"right"}} />
                                </div>
                            </div>
                            <div className="datePickerWrap">
                                <div className="pickerLeft">
                                    离开时间
                                </div>
                                <div className="wrapTwoPicker">
                                    <input className="fn-left" placeholder="离开时间" value={this.state.dateLeave} readOnly style={{ textAlign: "right" }}/>
                                </div>
                            </div>
                            <div className="datePickerWrap">
                                <div className="pickerLeft">
                                    证件
                                </div>
                                <div className="wrapTwoPicker" style={{textAlign:"right",paddingRight:"15px"}}>
                                    身份证：{this.state.card}
                                </div>
                            </div>

                            <Jiange name="jianGe"></Jiange>
                            <Line border="line"></Line>

                            <TextareaItem
                                title="来访事由"
                                data-seed="logId"
                                className="comeForWhat"
                                ref={el => this.autoFocusInst = el}
                                autoHeight
                                editable={this.state.edit}
                                value={this.state.reason}
                                style={{ textAlign:"right" }}
                                onChange={(value)=>{this.setState({reason:value})}}
                            />
                            <InputItem
                                clear
                                editable={this.state.edit}
                                ref={el => this.customFocusInst = el}
                                value={this.state.carNum}
                                style={{ textAlign: "right" }}
                                onChange={(value) => { this.setState({ carNum: value})}}
                            >访客车牌</InputItem>
                            <div className="datePickerWrap isVip" style={{textAlign:"right"}}>
                                <div className="pickerLeft">
                                    访客身份
                                </div>
                                <div className="wrapTwoPicker">
                                    {
                                        (this.state.selec == 1) ? "VIP客户" : (this.state.selec == 0) ? "非VIP客户" : ""
                                    }
                                </div>
                            </div>
                        </List>
                        <WhiteSpace size="xs" />
                        <ImagePicker
                            files={this.state.files}
                            className="imgPicStatic"
                            onImageClick={(index, fs) => { this.onTouchImg(index) }}
                            selectable={this.state.files.length < 10}
                            multiple={true}
                            selectable={this.state.edit}
                        />
                        <WhiteSpace size="xs" />
                        <span style={{ marginLeft: "15px",display:this.state.isShow?"none":"block" }}>附件：暂无</span>
                    </div>
                </div>
                <PhotoSwipeItem />
            </div>
        );
    }
}