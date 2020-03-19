import request from '@/utils/request'

export function initData(url, params) {
  return request({
    url: url,
    method: 'get',
    params
  })
}

export function postData(url,data) {
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function deleteData(url,data) {
  return request({
    url: url,
    method: 'delete',
    data
  })
}

export function putData(url,data) {
  return request({
    url: url,
    method: 'put',
    data
  })
}
