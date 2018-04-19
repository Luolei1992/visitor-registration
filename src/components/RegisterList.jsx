import React, { Component } from 'react'
import { hashHistory, Link } from 'react-router';
import QueueAnim from 'rc-queue-anim';
import { NavBar, Icon, PullToRefresh, ListView, Toast} from 'antd-mobile';
import { getLocationParam } from './Template'


let realData = [];
let realDataLength = realData.length;
const NUM_ROWS = 8;
let pageIndex = 0;

export default class RegisterList extends Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            // dataSource: dataSource.cloneWithRows(JSON.parse(sessionStorage.getItem("registerList")) ? JSON.parse(sessionStorage.getItem("registerList")) : []),
            dataSource: dataSource.cloneWithRows([]),
            hasMore: false,
            refreshing: false,
            isLoading: true,
            height: "",
            size: 0
        };
        this.genData = (pIndex = 0, realLength, data) => {
            let dataBlob = [];
            dataBlob = data || [];
            return dataBlob;
        };
        this.handleSend = (res) => {
            if (res.success) {
                realData = res.data.item_list;
                realDataLength = res.data.item_list.length;
                if (pageIndex == 0) {
                    this.rData = [];
                    this.rData = [...this.rData, ...this.genData(pageIndex++, realDataLength, realData)];
                    // sessionStorage.setItem("registerList", JSON.stringify(realData));
                } else {
                    this.rData = [...this.rData, ...this.genData(pageIndex++, realDataLength, realData)];
                }
                const hei = document.documentElement.clientHeight - document.querySelector(".pubStyleList").offsetTop
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.rData),
                    hasMore: res.data.total_count > (this.state.size + 8) ? true : false,
                    // hasMore: true,
                    isLoading: res.data.total_count > (this.state.size + 8) ? true : false,
                    // isLoading: true,
                    size: this.state.size + 8,
                    height: hei,
                });
                setTimeout(() => {
                    this.setState({
                        refreshing: false
                    })
                }, 300);
            } else {
                Toast.info(res.message, 2, null, false);
            }
        }
    }
    componentDidMount() {
        console.log(this.props.state.registerList);
        this.rData = this.genData();
        this.props.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave
        )
        // if (!validate.getCookie('user_id')) {
        //     hashHistory.push({
        //         pathname: '/login'
        //     });
        // };
        this.sendVisitMsg(0);
    }
    componentDidUpdate() {
        // if (this.state.useBodyScroll) {
        //     document.body.style.overflow = 'auto';
        // } else {
        //     document.body.style.overflow = 'hidden';
        // }
    }
    routerWillLeave(nextLocation) {  //离开页面
        pageIndex = 0;
    }
    onRefresh = () => {   //顶部下拉刷新数据
        this.setState({
            refreshing: true
        });
        pageIndex = 0;
        this.sendVisitMsg(0);
    };
    onEndReached = (event) => {
        // load new data   数据加载完成
        if (!this.state.isLoading && !this.state.hasMore) {
            return;
        }
        this.sendVisitMsg(this.state.size);
    };
    sendVisitMsg = (size) => {
        runPromise("get_visitor_list", {
            offset: size,
            limit: 8
        }, this.handleSend, false, "post");
    }

    render() {
        const row = (rowData, sectionID, rowID) => {
            const obj = rowData;
            let dateResize = (date) => {
                let fstDate = date.split(" ")[0];
                let secDate = date.split(" ")[1].split(":");
                secDate.splice(2, 1);
                return fstDate + ' ' + secDate.join(":")
            }
            let flg = obj.display == 2 ? "/shareRegister" : "/registerDetail";
            return (
                <div key={rowID}>
                    <Link to={{ pathname:  flg, query: { id: obj.id } }}>
                        <div className="registerItem" >
                            <h3>
                                {obj.visitor_name}&nbsp;
                                {obj.gender == 1 ? <i className="iconfont icon-xingbienan" style={{ color: "#6EB5E7",fontSize:"18px" }}></i> : <i className="iconfont icon-xingbienv" style={{ color: "#FF3BC4", fontSize: "18px"}}></i>}
                                {
                                    obj.display == 1 ? <span style={{ color: "#F05011" }}>待审核</span> :
                                        obj.display == 2 ? <span style={{ color: "#3FD80A" }}>已通过</span> :
                                            obj.display == 3 ? <span style={{ color: "#FF0000" }}>{obj.refuse_code ? obj.refuse_code : 审核不通过}</span> : ''
                                }
                            </h3>
                            <p className="person">来访人数：{obj.person_num}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;联系电话：{obj.phone}</p>
                            <p className="time">{obj.start_time.indexOf('-') != -1 ? dateResize(obj.start_time) : ""} ~ {obj.end_time.indexOf('-') != -1 ? dateResize(obj.end_time) : ""}</p>
                        </div>
                    </Link>
                </div>
            );
        };
        return (
            <div className="registerWrap">
                <NavBar
                    mode="dark"
                    className="pubHeadStyle"
                    // icon={<p>
                    //     <Icon type="left" size="lg" color="#fff" />
                    //     <i >返回</i>
                    // </p>}
                    onLeftClick={() => hashHistory.goBack()}
                    // rightContent={[
                    //     <Icon key="1" type="ellipsis" color="#fff" />,
                    // ]}
                >访客列表</NavBar>
                <div className="centerWrap" style={{ paddingBottom: "0"}}>
                    <div className="pubStyleList">
                        <ListView
                            key={false}
                            ref={el => this.lv = el}
                            dataSource={this.state.dataSource}
                            renderFooter={() => (<div style={{ padding: "0 10px", textAlign: 'center' }}>
                                {this.state.isLoading ? '加载中...' : '加载完成'}
                            </div>)}
                            style={{
                                height: this.state.height,
                                overflow: "auto"
                            }}
                            renderRow={row}
                            useBodyScroll={false}
                            pullToRefresh={<PullToRefresh
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefresh}
                            />}
                            onEndReached={this.onEndReached}
                            pageSize={9}
                        />
                    </div>
                </div>
                <div className="plusRegister" onClick={() => { hashHistory.push({ pathname: "/register" }) }}>
                    <i className="iconfont icon-jia"></i>
                </div>
                
            </div>
        );
    }
}