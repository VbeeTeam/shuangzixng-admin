// 顾问IM会话信息 Consult Controller
import request from "@/utils/request";

// 获取所有顾问
export function getAllAdviser() {
    return request({
        url: "api/consult/getAllAdviser",
        method: "get"
    });
}

// 获取指定顾问和客户的聊天记录
export function getMessage(
    sort,
    adviserId,
    customerId,
    content,
    createTimeStart,
    createTimeEnd,
    page,
    size
) {
    return request({
        url: "api/consult/getAllMessageByAdviserAndCustomer",
        method: "get",
        params: {
            sort,
            adviserId,
            customerId,
            content,
            createTimeStart,
            createTimeEnd,
            page,
            size
        }
    });
}

// 获取指定顾问的会话列表
export function getSession(adviserId) {
    return request({
        url: "api/consult/getAllSessionByCustomer/" + adviserId,
        method: "get"
    });
}

// 分发规则

// 查询顾问列表-规则
export function getConfigAdviser(page, size) {
    return request({
        url: "api/consult/config/getAllAdviser",
        method: "get",
        params: { page, size }
    });
}
// 查询当前配置 - 单位时间接待上限
export function getConfig() {
    return request({
        url: "api/consult/config",
        method: "get"
    });
}

// 修改某顾问配置
export function setAdConfig(adviserVo) {
    return request({
        url: "api/consult/config/saveAdviserConfig",
        method: "post",
        data: adviserVo
    });
}

// 修改当前配置 - 单位时间接待上限
export function setConfig(consultConfigDTO) {
    return request({
        url: "api/consult/config/saveConfig",
        method: "post",
        data: consultConfigDTO
    });
}
