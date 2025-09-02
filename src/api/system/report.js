import request from '@/utils/request'


export function getReportCount(query) {
    return request({
        url: '/system/report/getReportCount',
        method: 'post',
        data: query
    })
}

export function getReportList(query) {
    return request({
        url: '/system/report/getReportList',
        method: 'post',
        data: query
    })
}
export function getClassList() {
    return request({
        url: '/system/report/getClassList',
        method: 'get',
    })
}