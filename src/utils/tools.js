import html2pdf from 'html2pdf.js'
import axios from 'axios'
export const htmlTopdf = (section,option={}) => {
    // 获取待转换的 DOM 元素
    const element = document.querySelector(section)
    if (!element) {
        throw ('未查找到相关DOM')
    }
    // 按照需要设置一些 html2pdf 的配置
    const options = {
        margin: 0,
        filename: 'file.pdf',
        image: {
            type: 'jpeg',
            quality: 0.98
        },
        html2canvas: {
            scale: 3, // 提高分辨率
            useCORS: true // 允许跨域
        },
        jsPDF: {
            unit: 'in',
            format: 'a4',
            orientation: 'portrait'
        },
        ...option
    }
    // 将 DOM 元素转换为 PDF 文件
    html2pdf().set(options).from(element).save()
}
export const downloadImage =async (path,iamgeNmae='image.jpg')=> {
    if(!path)return
    const response =await axios({url:path,method: 'GET',responseType :'blob'})
    console.log(response)
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', iamgeNmae)
    document.body.appendChild(link)
    link.click()
  }