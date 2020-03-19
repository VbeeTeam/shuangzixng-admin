/*
产品管理
 */
import request from "@/utils/request";

// 新增保险产品
export function productCreat(data) {
    return request({
        url: "api/insure/product",
        method: "post",
        data
    });
}

// 修改保险产品 编辑
export function productEdit(data) {
    return request({
        url: "api/insure/product",
        method: "put",
        data
    });
}

// 查询保险产品列表
export function getProductList(
    page,
    size,
    name,
    companyId,
    insureAge,
    selling
) {
    return request({
        url: "api/insure/product",
        method: "get",
        params: {
            page,
            size,
            name,
            companyId,
            insureAge,
            selling,
            sort: "id,desc"
        }
    });
}
// 获取某个保险产品信息
export function getProductSingle(id) {
    return request({
        url: "api/insure/product/" + id,
        method: "get"
    });
}

// 删除保险产品
export function delProduct(id) {
    return request({
        url: "api/insure/product/" + id,
        method: "delete"
    });
}

// 保险产品上下架
export function sellingProduct(productId, selling) {
    return request({
        url: "api/insure/product/setSelling",
        method: "post",
        data: { productId, selling }
    });
}

// 查询保险产品数量统计列表
export function statList() {
    return request({
        url: "api/insure/product/statList",
        method: "get"
    });
}
// 查询保险产品标签列表
export function getTagList() {
    return request({
        url: "api/insure/product/tagList",
        method: "get"
    });
}

// 查询保险公司列表
export function getCompany() {
    return request({
        url: "api/insure/company",
        method: "get"
    });
}

// 查询保险产品保障项名称列表
export function getItemList() {
    return request({
        url: "api/insure/product/itemList",
        method: "get"
    });
}

// 查询文章列表 应用文章
export function applicationList(page, size, title, categoryId, status) {
    return request({
        url: "api/article",
        method: "get",
        params: { page, size, title, categoryId, status }
    });
}

// 查询分类TCategory
export function categoryList(sign) {
    return request({
        url: "api/category",
        method: "get",
        params: { sign }
    });
}

// 查询保险渠道列表
export function getChannel() {
    return request({
        url: "api/insure/channel",
        method: "get"
    });
}

/**
 * 产品规格
 */

// 新增规格行
// export function addSku(amount, productId, skuItems) {
//     return request({
//         url: "api/insure/product/sku",
//         method: "post",
//         data: { amount, productId, skuItems }
//     });
// }

// // 修改规格行
// export function editSku(amount, productId, skuItems) {
//     return request({
//         url: "api/insure/product/sku",
//         method: "put",
//         data: { amount, productId, skuItems }
//     });
// }

// // 查询某个产品的规格列表
// export function getSkuList(id) {
//     return request({
//         url: "api/insure/product/sku/" + id,
//         method: "get"
//     });
// }

// // 删除规格行
// export function delSku(productId, lineIndex) {
//     return request({
//         url: "api/insure/product/sku/" + productId + "/" + lineIndex,
//         method: "delete"
//     });
// }

// 保存投保规则
export function saveAttrs(productId, skuAttributeItems) {
    return request({
        url: "api/insure/product/sku/attrs",
        method: "post",
        data: { productId, skuAttributeItems }
    });
}

// 查询某个产品的投保规则
export function getAttrs(id) {
    return request({
        url: "api/insure/product/sku/attrs/" + id,
        method: "get"
    });
}

// 批量生成规格
export function generateBatch(id) {
    return request({
        url: "api/insure/product/sku/batch/" + id,
        method: "get"
    });
}

// 删除规格
export function delSku(productId, itemKey) {
    return request({
        url: "api/insure/product/sku/" + productId + "/" + itemKey,
        method: "delete"
    });
}

// 查询某个产品的规格列表
export function getSkuList(page, size, productId) {
    return request({
        url: "api/insure/product/sku/" + productId,
        method: "get",
        params: { page, size }
    });
}

// 修改规格
export function editSku(amount, itemKey, productId) {
    return request({
        url: "api/insure/product/sku",
        method: "put",
        data: { amount, itemKey, productId }
    });
}

// 新增规格
export function addSku(amount, productId, skuItem) {
    return request({
        url: "api/insure/product/sku",
        method: "post",
        data: { amount, productId, skuItem }
    });
}
