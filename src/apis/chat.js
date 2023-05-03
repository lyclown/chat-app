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
    url: 'http://localhost:3001/api/getAnswer',
    data
  })
}
export const getImage = (data) => {
  return request({
    method: 'post',
    url: 'http://localhost:3001/api/getImage',
    data
  })
}
export const createTranscription = (data) => {
  return request({
    method: 'post',
    url: 'http://localhost:3001/api/createTranscription',
    data
  })
}
export const uploadFile = (data) => {
  return request({
    method: 'post',
    url: 'http://localhost:3001/api/upload',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
  })
}