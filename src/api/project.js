/*
产品管理
 */
import request from "@/utils/request";

// 查询专题
export function getProjectList(page, size, title) {
    return request({
        url: "api/specialTopic",
        method: "get",
        params: { page, size, title }
    });
}

// 新增专题
export function projectCreat(
    title,
    subtitle,
    topPriority,
    picture,
    underPicture,
    articleList,
    module
) {
    return request({
        url: "api/specialTopic",
        method: "post",
        data: {
            title,
            subtitle,
            topPriority,
            picture,
            underPicture,
            articleList,
            module
        }
    });
}

// 修改专题
export function projectEdit(
    id,
    title,
    subtitle,
    topPriority,
    picture,
    underPicture,
    articleList,
    module
) {
    return request({
        url: "api/specialTopic",
        method: "put",
        data: {
            id,
            title,
            subtitle,
            topPriority,
            picture,
            underPicture,
            articleList,
            module
        }
    });
}

// 修改专题状态 上下架
export function projectStatus(id, status) {
    return request({
        url: "api/specialTopic",
        method: "put",
        data: {
            id,
            status
        }
    });
}
// 通过id查询专题
export function getProjectSingle(id) {
    return request({
        url: "api/specialTopic/" + id,
        method: "get"
    });
}

// 删除专题
export function delProject(id) {
    return request({
        url: "api/specialTopic/" + id,
        method: "delete"
    });
}

// 查询模块TModule
export function getModuleList() {
    return request({
        url: "api/tModule/web",
        method: "get"
    });
}
