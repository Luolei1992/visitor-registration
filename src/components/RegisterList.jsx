import React, { Component } from 'react'
import { hashHistory, Link } from 'react-router';
import QueueAnim from 'rc-queue-anim';
import { NavBar, Icon, PullToRefresh, ListView } from 'antd-mobile';
import { Line, Jiange } from './Template'



let realData = [];
let realDataLength = realData.length;
const NUM_ROWS = 10;
let pageIndex = 0;

export default class RegisterList extends Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            dataSource: dataSource.cloneWithRows(JSON.parse(sessionStorage.getItem("registerList")) ? JSON.parse(sessionStorage.getItem("registerList")) : []),
            hasMore:false,
            refreshing: false,
            isLoading: true,
            height: "",
        };
        this.genData = (pIndex = 0, realLength, data) => {
            let dataBlob = [];
            dataBlob = data;
            return dataBlob;
        };
        this.handleSend = (res) => {
            console.log(res);
            if (res.success) {
                realData = res.data;
                realDataLength = res.data.length;
                if (pageIndex == 0) {
                    this.rData = [];
                    this.rData = [...this.rData, ...this.genData(pageIndex++, realDataLength, realData)];
                    sessionStorage.setItem("registerList", JSON.stringify(realData));
                } else {
                    this.rData = [...this.rData, ...this.genData(pageIndex++, realDataLength, realData)];
                }
                const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.rData),
                    // hasMore: res.data.total_count > this.state.size ? true : false,
                    hasMore: true,
                    // isLoading: res.data.total_count > this.state.size ? true : false,
                    isLoading: true,
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
        this.props.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave
        )
        if (!validate.getCookie('user_id')) {
            hashHistory.push({
                pathname: '/login'
            });
        };
        this.sendVisitMsg();
    }
    routerWillLeave(nextLocation) {  //离开页面
        pageIndex = 0;
    }
    onRefresh = () => {   //顶部下拉刷新数据
        this.setState({
            refreshing: true
        });
        pageIndex = 0;
        this.sendVisitMsg();
    };
    onEndReached = (event) => {
        // load new data   数据加载完成
        if (!this.state.isLoading && !this.state.hasMore) {
            return;
        }
        this.sendVisitMsg();
    };
    sendVisitMsg = () => {
        runPromise("get_visitor_list", {
            offset: 0,
            limit: 10
        }, this.handleSend, false, "post");
    }

    render() {
        const row = (rowData, sectionID, rowID) => {
            const obj = rowData;
            return (
                <div key={rowID}>
                    <div style={{}}>
                        hahah
                    </div>
                </div>
            );
        };
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
                >访客列表</NavBar>
                <div className="centerWrap">
                    <div className="pubStyleList">
                        <ListView
                            key={this.state.useBodyScroll}
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
                            useBodyScroll={this.state.useBodyScroll}
                            pullToRefresh={<PullToRefresh
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefresh}
                            />}
                            onEndReached={this.onEndReached}
                            pageSize={9}
                        />
                    </div>
                </div>
            </div>
        );
    }
}