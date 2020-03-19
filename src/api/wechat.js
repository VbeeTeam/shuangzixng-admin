import request from "@/utils/request";

// 获取菜单
export function getMenu() {
    return request({
        url: "api/wechat/menu/load",
        method: "get"
    });
}
// 保存菜单
export function saveMenu(data) {
    return request({
        url: "api/wechat/menu/save",
        method: "post",
        data
    });
}

// 删除所有菜单
export function deleteMenu() {
    return request({
        url: "api/wechat/menu/delete",
        method: "get"
    });
}

// 查询微信文章列表
export function listArticle(page, size, title, author, publishTime) {
    return request({
        url: "api/wechat/article",
        method: "get",
        params: { page, size, title, author, publishTime, sort: "id,desc" }
    });
}

// 新增公众号文章
export function newArticle(
    title,
    author,
    content,
    showCoverPic,
    thumbUrl,
    contentSourceUrl
) {
    return request({
        url: "api/wechat/article",
        method: "post",
        data: {
            title,
            author,
            content,
            showCoverPic,
            thumbUrl,
            contentSourceUrl
        }
    });
}

// 删除公众号文章
export function delArticle(id) {
    return request({
        url: "api/wechat/article/" + id,
        method: "delete"
    });
}

// 获取微信文章
export function fetchArticle(id) {
    return request({
        url: "api/wechat/article/" + id,
        method: "get"
    });
}

// 修改公众号文章
export function editArticle(
    id,
    title,
    author,
    content,
    showCoverPic,
    thumbUrl,
    contentSourceUrl
) {
    return request({
        url: "api/wechat/article/",
        method: "put",
        data: {
            id,
            title,
            author,
            content,
            showCoverPic,
            thumbUrl,
            contentSourceUrl
        }
    });
}

// 查询多媒体素材列表
export function listMedia(page, size, title, author, group, tag, publishTime) {
    return request({
        url: "api/wechat/media",
        method: "get",
        params: {
            page,
            size,
            title,
            author,
            group,
            tag,
            publishTime,
            sort: "id,desc"
        }
    });
}

// 同步多媒体素材到微信 菜单素材库获取ID
export function syncToWeChat(url) {
    return request({
        url: "api/wechat/media/syncToWeChat",
        method: "post",
        data: url
    });
}

// 新增多媒体素材
export function mediaUpload(title, tag, groupName, description, url) {
    return request({
        url: "api/wechat/media",
        method: "post",
        data: { title, tag, groupName, description, url }
    });
}

// 删除多媒体素材
export function delMedia(id) {
    return request({
        url: "api/wechat/media/" + id,
        method: "delete"
    });
}

// 查询多媒体图片素材列表
export function imageList(page, size) {
    return request({
        url: "api/wechat/media/imageList",
        method: "get",
        params: { page, size }
    });
}

// 发布公众号多图文  预览
/**
 * @description:
 * @param
 * isToAll 是否加入历史消息列表
 * previewWxName 预览
 * sendIgnoreReprint 判定转载时是否发送
 *
 * weChatArticleList
 * needOpenComment 打开评论
 * onlyFansCanComment 评论范围 true 只有粉丝
 *
 * @return:
 */
export function preview(
    isToAll,
    sendIgnoreReprint,
    weChatArticleList,
    previewWxName
) {
    return request({
        url: "api/wechat/article/preview",
        // url: 'api/wechat/article/publish',
        method: "post",
        data: { isToAll, sendIgnoreReprint, weChatArticleList, previewWxName }
    });
}

// 发布公众号多图文 正式发布
/**
 * @description:
 * @param
 * isToAll 是否加入历史消息列表
 * previewWxName 预览
 * sendIgnoreReprint 判定转载时是否发送
 *
 * weChatArticleList
 * needOpenComment 打开评论
 * onlyFansCanComment 评论范围 true 只有粉丝
 *
 * @return:
 */
export function publish(
    isToAll,
    sendIgnoreReprint,
    weChatArticleList,
    previewWxName
) {
    return request({
        url: "api/wechat/article/publish",
        // url: 'api/wechat/article/publish',
        method: "post",
        data: { isToAll, sendIgnoreReprint, weChatArticleList, previewWxName }
    });
}

// 上传微信多媒体文件 单图片上传
const uploadImg = process.env.VUE_APP_BASE_API + "/api/wechat/media/upload";
// 公众号图文内容图片上传 多图片上传
const uploadImages =
    process.env.VUE_APP_BASE_API + "/api/wechat/article/uploadImages";

// 图片上传接口 资源接口
const sourceUploadImages =
    process.env.VUE_APP_BASE_API + "/api/resources/uploadImg";

export { uploadImg, uploadImages, sourceUploadImages };

// 基础设置

// // 查询微信配置列表 左侧列表查询
// export function getWXList() {
//     return request({
//         url: "api/wechat/config",
//         method: "get"
//         // params: { }
//     });
// }

// // 新增微信配置 左侧列表添加
// export function addWXConfig(
//     appId,
//     appSecret,
//     name,
//     token,
//     type,
//     encodingAESKey
// ) {
//     return request({
//         url: "api/wechat/config",
//         method: "post",
//         data: { appId, appSecret, name, token, type, encodingAESKey }
//     });
// }

// // 获取当前使用的微信配置信息 顶部信息条
// export function getCurrentConfig() {
//     return request({
//         url: "api/wechat/config/getCurrentConfig",
//         method: "get"
//     });
// }

// // 获取微信配置 单个
// export function getWXSingle(id) {
//     return request({
//         url: "api/wechat/config/" + id,
//         method: "get"
//     });
// }

// // 修改微信配置 单个
// export function editWXConfig(
//     id,
//     appId,
//     appSecret,
//     name,
//     token,
//     type,
//     encodingAESKey
// ) {
//     return request({
//         url: "api/wechat/config",
//         method: "put",
//         data: { id, appId, appSecret, name, token, type, encodingAESKey }
//     });
// }

// // 切换微信配置
// export function activateWX(id) {
//     return request({
//         url: "api/wechat/config/activate",
//         method: "post",
//         data: id
//     });
// }

// // 查询当前微信公众号渠道列表
// export function getChannel() {
//     return request({
//         url: "api/wechat/channel",
//         method: "get"
//     });
// }

// // 新增微信渠道
// export function addChannelReq(channelCode, channelName) {
//     return request({
//         url: "api/wechat/channel",
//         method: "post",
//         data: { channelCode, channelName }
//     });
// }

// 自动回复

// 查询当前公众号自定义消息列表
export function getReplyList(page, size, isKeywordMsg) {
    return request({
        url: "api/wechat/message/custom/" + isKeywordMsg,
        method: "get",
        params: { page, size }
    });
}

// 新增公众号自定义消息
export function addReply(
    content,
    imgUrl,
    keyword,
    type,
    weChatAppId,
    keywordMsg,
    timeout
    // title,
    // appId,
    // pagePath,
    // thumbUrl,
    // thumbMediaId,
    // description,
    // picUrl,
    // url
) {
    return request({
        url: "api/wechat/message/custom",
        method: "post",
        data: {
            content,
            imgUrl,
            keyword,
            type,
            weChatAppId,
            keywordMsg,
            timeout
            // title,
            // appId,
            // pagePath,
            // thumbUrl,
            // thumbMediaId,
            // description,
            // picUrl,
            // url
        }
    });
}

// 修改公众号自定义消息
export function editReply(
    id,
    content,
    imgUrl,
    keyword,
    type,
    weChatAppId,
    keywordMsg,
    timeout
) {
    return request({
        url: "api/wechat/message/custom",
        method: "put",
        data: {
            id,
            content,
            imgUrl,
            keyword,
            type,
            weChatAppId,
            keywordMsg,
            timeout
        }
    });
}

// 删除公众号自定义消息
export function deleteReply(id) {
    return request({
        url: "api/wechat/message/custom/" + id,
        method: "delete"
    });
}

// 推送系统提醒接口

export function viewArticlePush(content, unionId) {
    return request({
        url: "api/consult/viewArticlePush",
        // url: 'api/wechat/article/publish',
        method: "post",
        data: { content, unionId }
    });
}
