import request from '@/utils/request'
export const getAnswer = (data)=>{
    return request({
        method:'post',
        url:'/getAnswer',
        data
    })
}
export const getImage = (data)=>{
    return request({
        method:'post',
        url:'/getImage',
        data
    })
}