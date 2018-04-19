import React, { Component } from 'react'
import { Router, Route, hashHistory, IndexRoute, Link } from 'react-router';
import QueueAnim from 'rc-queue-anim';
import { NavBar, Icon, InputItem, List, WhiteSpace, ImagePicker, DatePicker, TextareaItem, Toast, ActivityIndicator } from 'antd-mobile';
import QRious from 'qrious';
import { Line } from './Template';

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
            animating:false,
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
            identity: "",   //访客身份
            verif_code:""
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
                    verif_code: res.data.verif_code,
                    // is_vip: 0,   //多出参数
                    person_name: "", //多出参数
                    files: this.newArray(res.data.appendixs),
                    carNum: res.data.plate_num,  //缺少参数(访客车牌)
                    selec: res.data.is_vip, //缺少参数(访客身份)
                },()=>{
                    new QRious({
                        element: document.getElementById('qrious'),
                        size: 160,
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
        this.readyDo();
        this.props.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave
        )
        runPromise('get_visitor_info', {
            visitor_id: this.props.location.query.id
        }, this.handleVisitDetail, false, "post");
        window.onresize = () => {
            if (window.screen.width < 345) {
                document.querySelector('.idcards').style.display = "none";
            } else {
                document.querySelector('.idcards').style.display = "inline-block";
            }
        }
    }
    readyDo = () => {
        var btnGenerate = document.getElementById("btnGenerate");
        var downloadPng = document.getElementById("downloadPng");
        let dom = document.getElementById("fromHTMLtestdiv");
        var MIME = {
            "application/x-zip-compressed": "zip",
            "application/javascript": "js",
            "text/css": "css",
            "text/plain": "txt",
            "text/html": "html",
            "text/xml": "xml",
            "image/jpeg": "jpeg",
            "image/png": "png",
            "image/gif": "gif",
            "image/svg+xml": "svg"
        };
        //文件名默认当前时间戳  
        // filename.value = Date.now();
        //检测点击下载按钮  
        downloadPng.addEventListener("click", (e)=> {
            var width = dom.offsetWidth;  // 获取(原生）dom 宽度
            var height = dom.offsetHeight; // 获取(原生）dom 高
            var offsetTop = dom.offsetTop;  //元素距离顶部的偏移量

            var canvas = document.createElement('canvas');  //创建canvas 对象
            document.body.appendChild(canvas);
            canvas.id = "mycanvas";
            var newCanvas = document.getElementById("mycanvas");
            var type = "png";
            var context = canvas.getContext('2d');
            var opts = {
                allowTaint: true,//允许加载跨域的图片
                tainttest: true, //检测每张图片都已经加载完成
                scale: 2, // 添加的scale 参数
                canvas: canvas, //自定义 canvas
                logging: true, //日志开关，发布的时候记得改成false
                width: width, //dom 原始宽度
                height: height //dom 原始高度
            };
            html2canvas(dom, opts).then( (canvas)=> {
                var body = document.getElementsByTagName("body");
                body[0].appendChild(canvas);

                var base64text = canvas.toDataURL(type);
                newCanvas.remove();
                runPromise('send_notice', {
                    "arr": base64text
                }, (res) => {
                    if(res.success){
                        this.setState({ animating: false },()=>{
                            Toast.info(res.message, 2, null, false);
                        })
                    }else{
                        Toast.info(res.message, 2, null, false);
                    }
                }, false, "post");
            });

        });
    } 

    render() {
        return (
            <div className="registerWrap" style={{backgroundColor:"#fff",paddingBottom:"1.2rem"}}>
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
                <div style={{height:"1.4rem"}}></div>
                <div className="centerWrap borderNone" id="fromHTMLtestdiv" style={{backgroundColor:"#f6f6f6",paddingTop:"0",paddingBottom:"1rem"}}>
                    {
                        (this.state.qr_code == null || this.state.qr_code == "null" || this.state.qr_code == undefined || this.state.qr_code == "undefined" || this.state.qr_code == "") ? ""
                            : <div>
                                <div className="sharePic" style={{ background: "url(" + imgUrl + ") center center /100% 100% " }}>
                                    <img id="qrious" />
                                </div>
                            </div>
                    }
                    <p style={{ padding: "10px 0 10px 15px",textAlign:"center", fontSize: "17px", color:"#75CF39",letterSpacing:"1px"}}>访客申请审核通过！</p>
                    <div className="pubStyleList shareResultDetail">
                        <List>
                            <div className="datePickerWrap" style={{ paddingLeft: "0" }}>
                                <div className="pickerLeft">
                                    验证码
                                </div>
                                <div className="wrapTwoPicker" style={{ color: "#000" }}>
                                    {this.state.verif_code}
                                </div>
                            </div>
                            <Line border="line"></Line>
                            <div className="datePickerWrap" style={{paddingLeft:"0"}}>
                                <div className="pickerLeft">
                                    时间
                                </div>
                                <div className="wrapTwoPicker" style={{ color: "#000" }}>
                                    {this.state.add_time.split(" ")[0]}
                                </div>
                            </div>
                            <Line border="line"></Line>
                            <InputItem
                                clear
                                editable={this.state.edit}
                                ref={el => this.autoFocusInst = el}
                                value={this.state.name}
                                style={{color:"#000"}}
                                onChange={(value)=>{this.setState({name:value})}}
                                className="sharePadding"
                            >访客姓名</InputItem>
                            <Line border="line"></Line>
                            <div className="datePickerWrap sharePadding">
                                <div className="pickerLeft">
                                    性别
                                </div>
                                <div className="wrapTwoPicker"  style={{color:"#000"}}>
                                    {this.state.title == "1" ? "男" : this.state.title == "2"?"女":""}
                                </div>
                            </div>
                            <Line border="line"></Line>
                            <InputItem
                                clear
                                editable={this.state.edit}
                                // error={this.state.hasError}
                                style={{ color: this.state.hasError ? "red" : "#6d6d6d",color: "#000" }}
                                // onErrorClick={() => {
                                //     this.onErrorClick(validate.CheckPhone(this.state.phone).errorMessage);
                                // }}
                                className="sharePadding"
                                value={this.state.phone}
                                onChange={this.onChangePhone}
                                ref={el => this.customFocusInst = el}
                            >联系电话</InputItem>
                            <Line border="line"></Line>
                            <InputItem
                                clear
                                editable={this.state.edit}
                                ref={el => this.customFocusInst = el}
                                type="number"
                                value={this.state.person}
                                style={{ color: "#000" }}
                                className="sharePadding"
                                onChange={(value)=>{this.setState({person:value})}}
                            >来访人数</InputItem>
                            <Line border="line"></Line>
                            <div className="datePickerWrap sharePadding">
                                <div className="pickerLeft">
                                    来访时间
                                </div>
                                <div className="wrapTwoPicker">
                                    <input style={{color:"#000"}} className="fn-left" placeholder="来访" value={this.state.dateCome} readOnly />
                                </div>
                            </div>
                            <Line border="line"></Line>
                            <div className="datePickerWrap sharePadding">
                                <div className="pickerLeft">
                                    来访时间
                                </div>
                                <div className="wrapTwoPicker">
                                    <input style={{ color: "#000" }} className="fn-left" placeholder="离开" value={this.state.dateLeave} readOnly />
                                </div>
                            </div>
                            <Line border="line"></Line>
                            <div className="datePickerWrap sharePadding">
                                <div className="pickerLeft">
                                    证件
                                </div>
                                <div className="wrapTwoPicker" style={{color:"#000"}}>
                                    <span className="idcards">身份证：</span>{this.state.card}
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
                    </div>
                    <span style={{ float:"right",marginTop:"10px",marginRight:"20px", color:"#D6D6D6"}}>来自 浙商证券</span>
                </div>
                <div className="toast-example">
                    <ActivityIndicator
                        toast
                        text="正在发送通知..."
                        animating={this.state.animating}
                    />
                </div>
                <div className="registerBtm" id="downloadPng" style={{ backgroundColor:"#5683F3"}} onClick={()=>{this.setState({animating:true})}}>通知访客</div>
            </div>
        );
    }
}