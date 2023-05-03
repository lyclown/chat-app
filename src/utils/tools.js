import html2pdf from 'html2pdf.js'
import axios from 'axios'
import Recorder from 'js-audio-recorder';
import CryptoJS from 'crypto-js';
export const htmlTopdf = (section, option = {}) => {
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
export const downloadImage = async (path, iamgeNmae = 'image.jpg') => {
    if (!path) return
    const response = await axios({ url: path, method: 'GET', responseType: 'blob' })
    console.log(response)
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', iamgeNmae)
    document.body.appendChild(link)
    link.click()
}
// 创建音频文件
// 创建音频文件
export const createAudio = async () => {
    // 1. 开始录制
    const recorder = new Recorder({
        sampleBits: 16, // 采样位数，支持 8 或 16，默认是16
        sampleRate: 16000, // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
        numChannels: 1, // 声道，支持 1 或 2， 默认是1
    });
    let startTs;

    try {
        await recorder.start();
        // 开始录音，记录起始时间戳
        startTs = Date.now();
    } catch (error) {
        // 出错了
        console.log(`${error.name} : ${error.message}`);
        throw error;
    }

    // 2. 结束录制
    const wavBlob = await recorder.stop();

    // 3. 计算录音时长
    const duration = Date.now() - startTs; // 单位：ms

    // 4. blob 数据转成 File 对象
    const fileName = generateAudioFileName()
    const audioFile = new File([wavBlob], fileName, { type: 'wav' });
    audioFile.duration = duration;
    return audioFile;
};
// 生成不重复的音频文件名
export const generateAudioFileName = () => {
    const timestamp = new Date().getTime();
    const randomNum = Math.floor(Math.random() * 100000);
    const inputString = `${timestamp}_${randomNum}`;
    const hash = CryptoJS.SHA256(inputString).toString();
    const fileName = `${hash}.wav`;
    return fileName;
  };