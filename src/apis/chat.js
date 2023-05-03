import request from '@/utils/request'
export const loginTim = (data) => {
  return request({
    method: 'post',
    url: '/loginTim',
    data
  })
}
export const getAnswer = (data) => {
  return request({
    method: 'post',
    url: '/getAnswer',
    data
  })
}
export const getImage = (data) => {
  return request({
    method: 'post',
    url: '/getImage',
    data
  })
}
export const createTranscription = (data) => {
  return request({
    method: 'post',
    url: '/createTranscription',
    data
  })
}
export const uploadFile = (data) => {
  return request({
    method: 'post',
    url: '/upload',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
  })
}