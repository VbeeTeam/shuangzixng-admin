// 基础设置 渠道 接口
import request from "@/utils/request";

// 基础设置

// 查询微信配置列表 左侧列表查询
export function getWXList() {
    return request({
        url: "api/wechat/config",
        method: "get"
        // params: { }
    });
}

// 新增微信配置 左侧列表添加
export function addWXConfig(
    appId,
    appSecret,
    name,
    token,
    type,
    encodingAESKey
) {
    return request({
        url: "api/wechat/config",
        method: "post",
        data: { appId, appSecret, name, token, type, encodingAESKey }
    });
}

// 获取当前使用的微信配置信息 顶部信息条
export function getCurrentConfig() {
    return request({
        url: "api/wechat/config/getCurrentConfig",
        method: "get"
    });
}

// 获取微信配置 单个
export function getWXSingle(id) {
    return request({
        url: "api/wechat/config/" + id,
        method: "get"
    });
}

// 修改微信配置 单个
export function editWXConfig(
    id,
    appId,
    appSecret,
    name,
    token,
    type,
    encodingAESKey
) {
    return request({
        url: "api/wechat/config",
        method: "put",
        data: { id, appId, appSecret, name, token, type, encodingAESKey }
    });
}

// 切换微信配置
export function activateWX(id) {
    return request({
        url: "api/wechat/config/activate",
        method: "post",
        data: id
    });
}

// 查询当前微信公众号渠道列表
export function getChannel() {
    return request({
        url: "api/wechat/channel",
        method: "get"
    });
}

// 新增微信渠道
export function addChannelReq(channelCode, channelName) {
    return request({
        url: "api/wechat/channel",
        method: "post",
        data: { channelCode, channelName }
    });
}
// 修改微信渠道
export function editChannelReq(channelCode, channelName, id) {
    return request({
        url: "api/wechat/channel",
        method: "put",
        data: { channelCode, channelName }
    });
}

// 新增微信公众号渠道二维码
export function createQr(
    channelCode,
    channelName,
    weChatAppId,
    weChatChannelId
) {
    return request({
        url: "api/wechat/channel/createQr",
        method: "post",
        data: { channelCode, channelName, weChatAppId, weChatChannelId }
    });
}

// 查询微信公众号渠道二维码列表
export function getChannelQrList() {
    return request({
        url: "api/wechat/channel/getChannelQrList",
        method: "get"
        // params: { }
    });
}

// 删除微信渠道
export function deleteChannel(id) {
    return request({
        url: "api/wechat/channel",
        method: "delete",
        data: id
    });
}

// 文章码
// 新增微信公众号渠道二维码 文章码
export function createQrArt(
    channelCode,
    channelName,
    weChatAppId,
    weChatChannelId,
    articleId
) {
    return request({
        url: "api/wechat/channel/createQr",
        method: "post",
        data: {
            channelCode,
            channelName,
            weChatAppId,
            weChatChannelId,
            articleCode: true,
            articleId
        }
    });
}

// 查询微信公众号渠道二维码列表 文章码
export function getChannelQrListArt(page, size) {
    return request({
        url: "api/wechat/channel/getChannelQrList",
        method: "get",
        params: {
            articleCode: true,
            page,
            size
        }
    });
}
