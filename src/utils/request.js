import axios from "axios";
// 创建axios实例
const instance = axios.create({
    timeout: 10000000,
    baseURL:'/api'
});
// 请求拦截器
instance.interceptors.request.use(config => {
    // 处理Loading状态
    // ...

    return config;
}, error => {
    return Promise.reject(error);
});

// 响应拦截器
instance.interceptors.response.use(response => {
    // 处理Loading状态
    // ...

    return response.data;
}, error => {
    // 处理Loading状态
    // ...

    // 统一处理错误信息
    if (error.response) {
        // 请求已发出，但服务器响应的状态码不在 2xx 范围内
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
    } else {
        // 请求未发出，网络异常等原因
        console.log('Error', error.message);
    }

    return Promise.reject(error);
});

export default instance;

