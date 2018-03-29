import React, { Component } from 'react'
import { Router, Route, hashHistory, IndexRoute, Link } from 'react-router';
import QueueAnim from 'rc-queue-anim';
import { NavBar, Icon, InputItem, List, WhiteSpace, ImagePicker, DatePicker } from 'antd-mobile';
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
// console.log(minDate, maxDate);
if (minDate.getDate() !== maxDate.getDate()) {
    // set the minDate to the 0 of maxDate
    minDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
}

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: true,
            files: [],
            ids: [],
            dateCome: "",
            dateLeave: "",
            time: "",
            utcDate: "",
            dpValue: null,
            customChildValue: null,
            visible: false,
        };
        this.handleBackPicSrc = (res) => {
            console.log(res);
            let tmpArrIds = this.state.ids;
            tmpArrIds.push(res.data.id);
            this.setState({
                ids: tmpArrIds
            })
        }
    }

    componentDidMount() {
        this.props.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave
        )
        // if (!validate.getCookie('user_id')) {
        //     hashHistory.push({
        //         pathname: '/'
        //     });
        // };
    }
    routerWillLeave(nextLocation) {  //离开页面
        fstDate = '';
    }
    onChange = (files, type, index) => {  //上传图片
        console.log(files, type, index);
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
            runPromise('upload_image_byw_upy2', {
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
            item.w = size[index].w;
            item.h = size[index].h;
            item.src = value.url;
            items.push(item);
        })
        console.log(size);
        openPhotoSwipe(items, index);
    }

    getPickerDate = (date) => {
        let d = new Date(date);
        return (d.getMonth() + 1) + '月' + d.getDate() + '日' + ' '
            + (d.getHours() > 10 ? d.getHours() : ('0' + d.getHours()))
            + ':' + (d.getMinutes() > 10 ? d.getMinutes() : ('0' + d.getMinutes()));
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
                    rightContent={[
                        <Icon key="1" type="ellipsis" color="#fff" />,
                    ]}
                >访客登记</NavBar>
                <div className="centerWrap">
                    <p className="warring">请输入访客基本身份信息（必填项）</p>
                    <div className="pubStyleList">
                        <List>
                            <InputItem
                                clear
                                editable={this.state.edit}
                                ref={el => this.autoFocusInst = el}
                            >访客姓名</InputItem>
                            <InputItem
                                clear
                                editable={this.state.edit}
                                ref={el => this.customFocusInst = el}
                            >标题</InputItem>
                            <InputItem
                                clear
                                editable={this.state.edit}
                                ref={el => this.customFocusInst = el}
                            >联系电话</InputItem>
                            <InputItem
                                clear
                                editable={this.state.edit}
                                ref={el => this.customFocusInst = el}
                            >来访人数</InputItem>

                            <div className="datePickerWrap">
                                <div className="pickerLeft">
                                    来访时间
                                </div>
                                <div className="wrapTwoPicker">
                                    <DatePicker
                                        minDate={minDate}
                                        maxDate={fstDate}
                                        value={this.state.date}
                                        onChange={date => { this.getComeDatePicker(date) }}
                                    >
                                        <input className="fn-left" placeholder="来访" value={this.state.dateCome} readOnly/>
                                    </DatePicker>
                                    <i className="fn-left">——</i>
                                    <DatePicker
                                        minDate={secDate}
                                        value={this.state.date}
                                        onChange={date => { this.getLeaveDatePicker(date) }}
                                    >
                                        <input className="fn-left" placeholder="离开" value={this.state.dateLeave} readOnly />
                                    </DatePicker>
                                </div>
                            </div>

                            <InputItem
                                clear
                                editable={this.state.edit}
                                ref={el => this.customFocusInst = el}
                            >证件</InputItem>

                            <Jiange name="jianGe"></Jiange>
                            <Line border="line"></Line>

                            <InputItem
                                clear
                                editable={this.state.edit}
                                className="borderTop"
                                ref={el => this.customFocusInst = el}
                            >来访事由</InputItem>
                            <InputItem
                                clear
                                editable={this.state.edit}
                                ref={el => this.customFocusInst = el}
                            >访客车牌</InputItem>
                            <InputItem
                                clear
                                editable={this.state.edit}
                                ref={el => this.customFocusInst = el}
                            >访客身份</InputItem>
                        </List>
                        <WhiteSpace size="xs" />
                        <ImagePicker
                            files={this.state.files}
                            onChange={this.onChange}
                            onImageClick={(index, fs) => { this.onTouchImg(index) }}
                            selectable={this.state.files.length < 10}
                            multiple={true}
                        />
                        <WhiteSpace size="xs" />
                    </div>
                </div>
                <div className="registerBtm">
                    下一步
                </div>
                <PhotoSwipeItem />
            </div>
        );
    }
}