import { hashHistory } from 'react-router';
import { Toast } from 'antd-mobile';

import axios from 'axios';
import qs from 'qs';

let Ajax = axios.create({
    baseURL: 'http://139.224.68.145:8080/',      
    timeout: 4000,
    withCredentials: true,
    crossDomain: true,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
});

const ajaxURLList = {
    login:"fkapi/login",                            //登陆
    add_visitor:"fkapi/add_visitor",                //新增访客
    get_visitor_list:"fkapi/get_visitor_list",      //获取访客列表
    get_visitor_info:"fkapi/get_visitor_info",      //获取访客详细信息
}

//定义一个基于Promise的异步任务执行器
function run(taskDef) {
    //创建迭代器
    let task = taskDef();

    //开始执行任务
    let result = task.next();

    //递归函数遍历
    (function step() {
        //如果有更多任务要做
        if (!result.done) {
            //用一个Promise来解决会简化问题
            let promise = Promise.resolve(result.value);
            promise.then(function (value) {
                result = task.next(value);
                step();
            }).catch(function (error) {
                result = task.throw(error);
                step();
            });
        }
    }())
}

/**
 * 执行异步任务执行器的函数
 * 
 * @param {String} ajaxName 具体执行ajax的请求名称
 * @param {Object} param ajax请求的参数对象，必须是对象，属性名和ajax参数的属性名相同
 * @param {Function} handle ajax执行完成后的处理函数
 * @param {Boolean} mustLogin 是否必须登录后才能发送请求，判断登录是查询本地存储的token
 * @param {String} method ajax请求类型，默认是post
 * @param {String} handleParam ajax执行完成后的处理函数的参数
 */
export default function runPromise(ajaxName, param, handle, mustLogin = false, method="post", handleParam) {
    let cookie_user_id = getCookie('user_id');
    if (mustLogin && !cookie_user_id) {
        //如果没登录，跳转到登录页
        hashHistory.push({
            pathname: '/login'
        });
        return;
    }

    run(function* () {
        // let contents = yield ajaxName(param);
        let contents = yield sendAjax(ajaxURLList[ajaxName], param, method);
        handle(contents.data, handleParam);
    })
}

//发送ajax请求通用
function sendAjax(url, param, method) {
    return new Promise(function (resolve, reject) {
        if (method.toLowerCase() == "get") {
            let URL = url;
            if (param instanceof Object) {
                for (const key in param) {
                    if (param.hasOwnProperty(key)) {
                        const element = param[key];
                        URL += "/" + param[key];
                    }
                }
            }
            Ajax.get(URL).then(req => {
                resolve(req);
            }).catch(error => {
                //全局处理网络请求错误
                console.log(error);
                reject(error);
            });
        } else {
            Ajax.post(url, qs.stringify(param)).then(req => {
                errLogin(req.data) && resolve(req);
            }).catch(error => {
                //全局处理网络请求错误
                console.log(error);
                Toast.info("网络错误，请重试！", 2, null, false);
                setTimeout(() => {
                    Toast.hide();
                }, 1000);
                reject(error);
            });
        }
    });
}
function errLogin(data)  {
    if (data.message == '会话已失效，请重新登录' || data.message == '不是公司员工') {
        Toast.info(data.message, .8, null, false);
        validate.setCookie("user_id","");
        setTimeout(() => {
            hashHistory.push({
                pathname: '/login'
            })
        }, 800);
        return false;
    } else {
        return true;
    }
}
/**
 * 获取cookie
 * 
 * @param {any} name 
 * @returns 
 */
function getCookie(name) {
    let arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) return decodeURIComponent(arr[2]); return null;
};
