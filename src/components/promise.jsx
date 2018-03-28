import { hashHistory } from 'react-router';
import { Toast } from 'antd-mobile';

import axios from 'axios';
import qs from 'qs';

let Ajax = axios.create({
    baseURL: 'https://www.huakewang.com/',      
    timeout: 4000,
    withCredentials: true,
    crossDomain: true,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
});

const ajaxURLList = {
    login:"hkapi/login",         //登陆
    logout:"hkw_newapi/logout",         //退出登陆
    get_project_list: "gdApi/get_project_list",      //获取项目列表
    get_project_info:"gdApi/get_project_info",         //获取项目详细信息
    get_meeting_info:"gdApi/get_meeting_info",         //获取会议详细信息
    book_service_simple: "quoteApi/book_service_simple", //创建订单-给设计师下单
    get_project_linker_list: "gdApi/get_project_linker_list", //获取项目相关联系人
    get_mission_list: "gdApi/get_mission_list", //获取任务交割记录
    add_mission: "gdApi/add_mission", //添加任务交割记录
    get_visit_back_list: "gdApi/get_visit_back_list", //获取回访列表
    add_visit_back: "gdApi/add_visit_back", //添加现场回访
    get_record_list: "gdApi/get_record_list", //现场记录列表
    get_record_info: "gdApi/get_record_info", //现场记录详细
    get_plan_list: "gdApi/get_plan_list", //获取计划列表
    add_record: "gdApi/add_record", //添加现场记录
    get_meeting_list: "gdApi/get_meeting_list", //会议记录列表
    add_meeting: "gdApi/add_meeting", //添加会议记录
    get_record_info: "gdApi/get_record_info", //会议详细记录
    add_project: "gdApi/add_project", //添加调研
    add_project_ex: "gdApi/add_project_ex", //添加调研
    upload_image_byw_upy2: "upload/upload_image_byw_upy2", //base64文件上传
    get_company_list: "gdApi/get_company_list", //获取公司列表
    get_company_info: "gdApi/get_company_info", //获取公司详细
    get_user_info: "gdApi/get_user_info", //获取联系人信息
    sign_up_document: "gdApi/sign_up_document", //保存为图片文档
    get_company_user_list: "gdApi/get_company_user_list", //获取客户公司联系人
    get_visit_back_simple_list: "gdApi/get_visit_back_simple_list", //回访的简要信息
    get_check_list: "gdApi/get_check_list", //获取验收阶段列表
    add_check: "gdApi/add_check", //添加验收单
    add_project_linker_ex: "gdApi/add_project_linker_ex", //添加项目相关人员
    del_project_linker: "gdApi/del_project_linker", //删除项目联系人
    get_staff_list: "gdApi/get_staff_list", //获取己方联系人
    get_survey_info: "gdApi/get_survey_info", //获取调研
    get_check_info: "gdApi/get_check_info", //获取验收详细
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
            pathname: '/login',
            query: { form: 'promise' },
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
