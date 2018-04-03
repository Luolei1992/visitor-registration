import React, { Component } from 'react'
import { Router, Route, hashHistory, IndexRoute, Link } from 'react-router';
import QueueAnim from 'rc-queue-anim';
import { NavBar, Icon, InputItem, List, WhiteSpace, ImagePicker, DatePicker, TextareaItem, Toast } from 'antd-mobile';
import QRious from 'qrious'
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

let imgUrl = require('../image/erweima.png');

export default class ShareRegister extends Component {
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
            add_time:"",
            qr_code:"",
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
                    add_time: this.dateResize(res.data.add_time),
                    qr_code:res.data.qr_code,
                    isShow: res.data.appendixs.length > 0 ? true : false,
                    name: res.data.visitor_name,
                    phone: res.data.phone,
                    person: res.data.person_num,
                    dateCome: this.dateResize(res.data.start_time),
                    dateLeave: this.dateResize(res.data.end_time),
                    identity_type: 0,
                    card: res.data.identity_num,
                    reason: res.data.purpose,
                    title: res.data.gender,  //多出参数
                    // is_vip: 0,   //多出参数
                    person_name: "", //多出参数
                    files: this.newArray(res.data.appendixs),
                    carNum: res.data.plate_num,  //缺少参数(访客车牌)
                    selec: res.data.is_vip, //缺少参数(访客身份)
                },()=>{
                    new QRious({
                        element: document.getElementById('qrious'),
                        size: 140,
                        value: this.state.qr_code
                    })
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
        arr.map((value) => {
            let tmp = {};
            tmp.id = value.id;
            tmp.url = "http://" + value.path;
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

    // onTouchImg = (index) => {   //点击图片开始预览
    //     let items = [];
    //     this.state.files.map((value) => {
    //         let item = {};
    //         item.w = size[index].w;
    //         item.h = size[index].h;
    //         item.src = value.url;
    //         items.push(item);
    //     })
    //     openPhotoSwipe(items, index);
    // }

    render() {
        return (
            <div className="registerWrap" style={{backgroundColor:"#fff"}}>
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
                <div className="centerWrap borderNone">
                    <p style={{padding:"10px 0 5px 15px"}}>时间：{this.state.add_time.split(" ")[0]}</p>
                    <p style={{ padding: "10px 0 10px 15px", fontSize: "17px", color:"#75CF39",letterSpacing:"1px"}}>访客申请审核通过！</p>
                    <div className="pubStyleList">
                        <List>
                            <InputItem
                                clear
                                editable={this.state.edit}
                                ref={el => this.autoFocusInst = el}
                                value={this.state.name}
                                style={{color:"#000"}}
                                onChange={(value)=>{this.setState({name:value})}}
                            >访客姓名</InputItem>
                            <div className="datePickerWrap">
                                <div className="pickerLeft">
                                    性别
                                </div>
                                <div className="wrapTwoPicker"  style={{color:"#000"}}>
                                    {this.state.title == "1" ? "男" : this.state.title == "2"?"女":""}
                                </div>
                            </div>
                            <InputItem
                                clear
                                editable={this.state.edit}
                                // error={this.state.hasError}
                                style={{ color: this.state.hasError ? "red" : "#6d6d6d",color: "#000" }}
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
                                style={{ color: "#000" }}
                                onChange={(value)=>{this.setState({person:value})}}
                            >来访人数</InputItem>

                            <div className="datePickerWrap">
                                <div className="pickerLeft">
                                    来访时间
                                </div>
                                <div className="wrapTwoPicker">
                                    <input style={{color:"#000"}} className="fn-left" placeholder="来访" value={this.state.dateCome} readOnly />
                                </div>
                            </div>
                            <div className="datePickerWrap">
                                <div className="pickerLeft">
                                    来访时间
                                </div>
                                <div className="wrapTwoPicker">
                                    <input style={{ color: "#000" }} className="fn-left" placeholder="离开" value={this.state.dateLeave} readOnly />
                                </div>
                            </div>
                            <div className="datePickerWrap">
                                <div className="pickerLeft">
                                    证件
                                </div>
                                <div className="wrapTwoPicker" style={{color:"#000"}}>
                                    身份证：{this.state.card}
                                </div>
                            </div>

                        </List>
                        {/* <ImagePicker
                            files={this.state.files}
                            onChange={this.onChange}
                            onImageClick={(index, fs) => { this.onTouchImg(index) }}
                            selectable={this.state.files.length < 10}
                            multiple={true}
                            selectable={this.state.edit}
                        /> */}

                        {/* <span style={{ marginLeft: "15px",display:this.state.isShow?"none":"block" }}>附件：暂无</span> */}
                        {
                            (this.state.qr_code == null || this.state.qr_code == "null" || this.state.qr_code == undefined || this.state.qr_code == "undefined" || this.state.qr_code == "")?""
                            :<div>
                                <div className="sharePic" style={{ background: "url(" + imgUrl + ") center center /100% 100% " }}>
                                    <img id="qrious" />
                                </div>
                                <p style={{ textAlign: "center", marginTop: "5px", color: "#000" }}>微信通知访客</p>
                            </div>
                        }
                    </div>
                    <span style={{ position: "absolute", right: "15px", bottom: "15px", color:"#D6D6D6"}}>来自 浙商证券</span>
                </div>
                <PhotoSwipeItem />
            </div>
        );
    }
}