import React, { Component } from 'react'
import { Router, Route, hashHistory, IndexRoute, Link } from 'react-router';
import QueueAnim from 'rc-queue-anim';
import { NavBar, Icon, InputItem, List, WhiteSpace, ImagePicker, DatePicker, TextareaItem, Toast, Flex ,Radio } from 'antd-mobile';
import { Line, Jiange } from './Template'

import PhotoSwipeItem from './photoSwipeElement.jsx';
import '../js/photoswipe/photoswipe.css';
import '../js/photoswipe/default-skin/default-skin.css';
import PhotoSwipe from '../js/photoswipe/photoswipe.min.js';
import PhotoSwipeUI_Default from '../js/photoswipe/photoswipe-ui-default.min.js';

let size = [];
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


const nowTimeStamp = Date.now();

let minDate = new Date(nowTimeStamp);
let fstDate = '';
let secDate = minDate;
const maxDate = new Date(nowTimeStamp + 1e7);
if (minDate.getDate() !== maxDate.getDate()) {
    // set the minDate to the 0 of maxDate
    minDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
}

export default class RegisterDetail extends Component {
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
            hasError1: false,
            disabled: true,
            selec:false,
            pageTitle: "访客详细",
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
        this.handleBackPicSrc = (res) => {
            let tmpArrIds = this.state.ids;
            tmpArrIds.push(res.data.id);
            this.setState({
                ids: tmpArrIds
            })
        };
        this.handleVisitDetail = (res) => {
            if (res.success) {
                this.setState({
                    name: res.data.visitor_name,
                    phone: res.data.phone,
                    person: res.data.person_num,
                    dateCome: this.dateResize(res.data.start_time),
                    dateLeave: this.dateResize(res.data.end_time),
                    identity_type: 0,
                    card: res.data.identity_num,
                    reason: res.data.purpose,
                    title: res.data.gender,  //多出参数
                    selec:res.data.is_vip,
                    person_name: "", //多出参数
                    files: this.newArray(res.data.appendixs),
                    carNum: res.data.plate_num,  //缺少参数(访客车牌)
                })
            }
        };
        this.handleSend = (res) => {
            if (res.success) {
                // hashHistory.push({
                //     pathname: '/registerStatic',
                //     query: { id: res.message }
                // });
                this.setState({
                    disabled: true,
                    edit: false,
                    pageTitle: "访客详细"
                })
            } else {
                Toast.info(res.message, 2, null, false);
            }
        }
    }
    dateResize = (date) => {
        let fstDate = date.split(" ")[0];
        let secDate = date.split(" ")[1].split(":");
        secDate.splice(2, 1);
        return fstDate + ' ' + secDate.join(":")
    }
    newArray = (arr) => {
        let newArr = [];
        let idArr = [];
        arr.map((value) => {
            let tmp = {};
            tmp.id = value.id;
            tmp.url = value.path.indexOf("http") != -1 ? value.path:"http://" + value.path;
            tmp.width = value.width;
            tmp.height = value.height;
            idArr.push(value.id);
            newArr.push(tmp);
        })
        this.setState({ids:idArr})
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
    routerWillLeave(nextLocation) {  //离开页面
        fstDate = '';
    }
    eddEventListenerEdit=()=>{
        let imgList = document.querySelectorAll('.am-image-picker-item-remove');
        for (let a = 0; a < imgList.length; a++) {
            if (this.state.disabled) {
                imgList[a].style.display = "block";
            } else {
                imgList[a].style.display = "none";
            }
        }
    }
    sendVisitMsg = () => {
        if(this.state.name.replace(/(^\s*)|(\s*$)/g, "") == "" ){
            Toast.info("姓名不能为空", 2, null, false);
        }else if(this.state.hasError || this.state.phone.length != 11){
            Toast.info("请输入正确的手机号", 2, null, false);
        }else if(this.state.person == 0){
            Toast.info("请输入正确的来访人数", 2, null, false);
        }else if(this.state.dateCome.replace(/(^\s*)|(\s*$)/g, "") == ""){
            Toast.info("请选择来访时间", 2, null, false);
        }else if(this.state.dateLeave.replace(/(^\s*)|(\s*$)/g, "") == ""){
            Toast.info("请选择离开时间", 2, null, false);
        }else if(this.state.hasError1 || this.state.card.length < 15){
            Toast.info("请输入15或18位有效身份证号", 2, null, false);
        }else{
            runPromise("add_visitor", {
                visitor_name: this.state.name,
                phone: this.state.phone,
                person_num: this.state.person,
                start_time: this.state.dateCome,
                end_time: this.state.dateLeave,
                identity_type: 0,
                identity_num: this.state.card,
                purpose: this.state.reason,
                sex: this.state.title,  
                person_name: "", 
                is_vip: this.state.selec ? 1 : 0,
                plate_num: this.state.carNum,
                appendix: this.state.ids.join("_"),
                id: this.props.location.query.id
            }, this.handleSend, false, "post");
        }
    }
    onChange = (files, type, index) => {  //上传图片
        let img, item;
        if (files.length > 0) {
            img = new Image();
            item = {};
        }
        img.src = files[files.length - 1].url;
        img.onload = function (argument) {
            item.w = this.width;
            item.h = this.height;
        }
        if (type == 'remove') {
            this.state.ids.splice(index, 1);
            this.state.files.splice(index, 1);
            size.splice(index, 1);
            this.setState({
                files,
            });
        } else {
            size.push(item);
            runPromise('upload_image', {
                "arr": files[files.length - 1].url
            }, this.handleBackPicSrc, false, "post");
            this.setState({
                files,
            });
        }
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

    getPickerDate = (date) => {
        let d = new Date(date);
        return d.getFullYear() + '-' + ((d.getMonth() + 1) >= 10 ? (d.getMonth() + 1) : '0' + (d.getMonth() + 1)) + '-'
            + (d.getDate() >= 10 ? d.getDate() : '0' + d.getDate())+ ' '
            + (d.getHours() >= 10 ? d.getHours() : ('0' + d.getHours()))
            + ':' + (d.getMinutes() >= 10 ? d.getMinutes() : ('0' + d.getMinutes()));
    }
    getComeDatePicker = (date) => {
        secDate = new Date(date) ? new Date(date) : minDate;
        let time = this.getPickerDate(date);
        this.setState({ dateCome: time });
    }
    getLeaveDatePicker = (date) => {
        fstDate = new Date(date) ? new Date(date) : maxDate;
        let time = this.getPickerDate(date);
        this.setState({ dateLeave: time });
    }
    whichClick = (e) => {
        let hasClass = e.target.getAttribute('class');
        if (hasClass && hasClass.indexOf('isSelect') != -1) {
            this.setState({
                isCardType: !this.state.isCardType
            })
        } else {
            this.setState({
                isCardType: false
            })
        }
    }
    onChangePhone = (value) => {  //用户名输入
        this.setState({
            hasError: validate.CheckPhone(value).hasError,
            phone: value
        });
    }
    // onErrorClick = (val) => { //验证错误回调
    //     if (this.state.hasError) {
    //         Toast.info(val, 2, null, false);
    //     } else if (this.state.error) {
    //         Toast.info(val, 2, null, false);
    //     }
    // }
    setCardNum = (value) => {
        this.setState({
            hasError1: validate.CheckIdCard(value).hasError,
            card: value
        });
    }
    render() {
        return (
            // <div className="registerWrap" onClick={(e) => { this.whichClick(e) }}>
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
                >{this.state.pageTitle}</NavBar>
                <div className="centerWrap">
                    <p className="warring">请输入访客基本身份信息（必填项）</p>
                    <div className="pubStyleList">
                        <List>
                            <InputItem
                                clear
                                editable={this.state.edit}
                                ref={el => this.autoFocusInst = el}
                                value={this.state.name}
                                style={{ textAlign: this.state.disabled ? "right" : "left" }}
                                onChange={(value) => { this.setState({ name: value }) }}
                            >访客姓名</InputItem>
                            <div className="datePickerWrap">
                                <div className="pickerLeft">
                                    性别
                                </div>
                                {
                                    this.state.disabled ? <div style={{width:"100%",textAlign:"right",paddingRight:"15px"}}>{this.state.title == '1' ? "男" : "女"}</div>: 
                                    <div className="wrapTwoPicker">
                                        <button
                                            style={{
                                                border: this.state.title == '1' ? '1px solid #6EB5E7' : '1px solid #ccc',
                                                color: this.state.title == '1' ? "#6EB5E7" : "#6d6d6d",
                                                margin: "0 15px",
                                                padding: "5px",
                                                borderRadius: "5px"
                                            }}
                                            onClick={() => {
                                                this.state.disabled ? "" : this.setState({ title: "1" })
                                            }}
                                        >男 <i className="icon-xingbienan iconfont"></i></button>
                                        <button
                                            style={{
                                                border: this.state.title == '2' ? '1px solid #FF3BC4' : '1px solid #ccc',
                                                color: this.state.title == '2' ? "#FF3BC4" : "#6d6d6d",
                                                margin: "0 15px",
                                                padding: "5px",
                                                borderRadius: "5px"
                                            }}
                                            onClick={() => {
                                                this.state.disabled ? "" : this.setState({ title: "2" })
                                            }}
                                        >女 <i className="icon-xingbienv iconfont"></i></button>
                                    </div>
                                }
                            </div>
                            <InputItem
                                clear
                                editable={this.state.edit}
                                // error={this.state.hasError}
                                style={{ color: this.state.hasError ? "red" : "#6d6d6d", textAlign: this.state.disabled ? "right" : "left" }}
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
                                style={{ textAlign: this.state.disabled ? "right" : "left" }}
                                onChange={(value) => { this.setState({ person: value }) }}
                            >来访人数</InputItem>

                            <div className="datePickerWrap">
                                <div className="pickerLeft">
                                    来访时间
                                </div>
                                <div className="wrapTwoPicker">
                                    <DatePicker
                                        minDate={minDate}
                                        maxDate={fstDate}
                                        disabled={this.state.disabled}
                                        value={this.state.date}
                                        onChange={date => { this.getComeDatePicker(date) }}
                                    >
                                        <input className="fn-left ellips" 
                                            placeholder="来访时间" 
                                            value={this.state.dateCome} readOnly 
                                            style={{textAlign:this.state.disabled?"right":"left"}}
                                        />
                                    </DatePicker>
                                </div>
                            </div>
                            <div className="datePickerWrap">
                                <div className="pickerLeft">
                                    来访时间
                                </div>
                                <div className="wrapTwoPicker">
                                    <DatePicker
                                        minDate={secDate}
                                        disabled={this.state.disabled}
                                        value={this.state.date}
                                        onChange={date => { this.getLeaveDatePicker(date) }}
                                    >
                                        <input className="fn-left ellips" 
                                            placeholder="离开时间" 
                                            value={this.state.dateLeave} readOnly 
                                            style={{textAlign:this.state.disabled?"right":"left"}}
                                        />
                                    </DatePicker>
                                </div>
                            </div>
                            <div className="datePickerWrap">
                                <div className="pickerLeft">
                                    证件
                                </div>
                                <div className="wrapTwoPicker" style={{textAlign:this.state.disabled?"right":"left"}}>
                                    {
                                        this.state.disabled?<span style={{marginRight:"15px"}}>身份证：{this.state.card}</span> :
                                        <div>
                                            <span className="fn-left cardType">
                                                <span className="isSelect" style={{ color: this.state.isSelect ? "#6d6d6d" : "#E2E2E2" }}>{this.state.cardType}</span>
                                                <div className="changeCardType" style={{ display: this.state.isCardType ? "block" : "none" }} >
                                                    <ul>
                                                        <li onClick={(e) => {
                                                            this.setState({
                                                                cardType: e.currentTarget.innerHTML,
                                                                isCardType: false,
                                                                isSelect: true
                                                            })
                                                        }}>身份证</li>
                                                        {/* <li onClick={(e) => {
                                                            this.setState({
                                                                cardType: e.currentTarget.innerHTML,
                                                                isCardType: false,
                                                                isSelect: true
                                                            })
                                                        }}>驾驶证</li> */}
                                                        {/* <li onClick={(e) => { this.setState({ 
                                                            cardType: e.currentTarget.innerHTML,
                                                            isCardType: false,
                                                            isSelect: true
                                                        })}}>学生证</li> */}
                                                    </ul>
                                                </div>
                                            </span>
                                            <span className="fn-left cardLine">|</span>
                                            <input className="fn-left cardNum"
                                                maxLength="18"
                                                placeholder="证件号码"
                                                disabled={this.state.disabled}
                                                value={this.state.card}
                                                style={{ color: this.state.hasError1 ? "red" : "#6d6d6d" }}
                                                onChange={(e) => {
                                                    // this.setState({ card: e.currentTarget.value.replace(/[^\w\.\/]/ig, '') }) 
                                                    this.setCardNum(e.currentTarget.value);
                                                }}
                                            />
                                        </div>
                                    }
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
                                style={{ textAlign: this.state.disabled ? "right" : "left" }}
                                onChange={(value) => { this.setState({ reason: value }) }}
                            />
                            <InputItem
                                clear
                                editable={this.state.edit}
                                ref={el => this.customFocusInst = el}
                                value={this.state.carNum}
                                style={{ textAlign: this.state.disabled ? "right" : "left" }}
                                onChange={(value) => { this.setState({ carNum: value }) }}
                            >访客车牌</InputItem>
                            <div className="datePickerWrap isVip" style={{ textAlign: this.state.disabled ? "right" : "left" }}>
                                <div className="pickerLeft">
                                    访客身份
                                </div>
                                <div className="wrapTwoPicker">
                                    {
                                        this.state.disabled ? ((this.state.selec == 1) ? "VIP客户" : (this.state.selec == 0) ? "非VIP客户" : ""):
                                            <Flex.Item>
                                                <Radio className="my-radio"
                                                    checked={this.state.selec == 1 ? true : false}
                                                    onChange={e => {
                                                        this.setState({ selec: !this.state.selec })
                                                    }}
                                                >是否为VIP客户</Radio>
                                            </Flex.Item>
                                    }
                                    
                                </div>
                            </div>
                        </List>
                        <WhiteSpace size="xs" />
                        <ImagePicker
                            files={this.state.files}
                            onChange={this.onChange}
                            className="editRegister"
                            onImageClick={(index, fs) => { this.onTouchImg(index) }}
                            selectable={this.state.files.length < 10}
                            multiple={false}
                            selectable={this.state.edit}
                        />
                        <WhiteSpace size="xs" />
                    </div>
                </div>
                <div className="registerDetailBtm">
                    <span style={{ backgroundColor: "#000" }}
                        onClick={() => {
                            hashHistory.goBack();
                        }}
                    >取&nbsp;&nbsp;&nbsp;&nbsp;消</span>
                    <span style={{ display: this.state.disabled ? "inline-block" : "none" }}
                        onClick={() => {
                            this.setState({
                                disabled: false,
                                edit: true,
                                pageTitle: "编辑信息"
                            })
                            this.eddEventListenerEdit();
                        }}>再次编辑</span>
                    <span style={{ display: this.state.disabled ? "none" : "inline-block" }}
                        onClick={() => {
                            this.sendVisitMsg()
                            this.eddEventListenerEdit()
                        }}
                    >保&nbsp;&nbsp;&nbsp;&nbsp;存</span>
                </div>
                <PhotoSwipeItem />
            </div>
        );
    }
}