import {createAudio} from '@/utils/tools'
class SendMessage {
    constructor(options) {
      this.tim = options.tim
      this.TIM = options.TIM
    }
    sendMessage = async(message) => {
      try {
        const imResponse = await this.tim.sendMessage(message);
        return imResponse
      } catch (error) {
        console.log('发送失败', error);
      }
    }
    getImage(options){
      // count:可选图片数量,mediaType:类型,sourceType:图片来源，相册或相机，默认为相册
      options ={...{count:1,mediaType:['image'],sourceType: ['album']},...options}
      return new Promise((resolve,reject)=>{
          try {
              this.tim.chooseMedia({
                  ...options,
                  success(res) {resolve(res)}
                })
          } catch (error) {
            reject(error)A
          }
      })
    }
    getFile = (options) => {
      options = Object.assign({count:1,type:'all'},options)
      return new Promise((resolve,reject)=>{
          try {
            this.tim.chooseMessageFile({
                  ...options,
                  success(res) {resolve(res)}
                })
          } catch (error) {
              reject(error)
          }
      })
    };
    async sendImage(imageOption,sendOption,imageCallback,callback){
      console.log(33333)
        const image =await this.getImage(imageOption)
        console.log(image)
        if(imageCallback && typeof imageCallback === 'function'){
          imageCallback(image.tempFiles[0].tempFilePath)
        }
        const message =await this.tim.createImageMessage({
         
          conversationType: this.TIM.TYPES.CONV_C2C,
          payload: { file: image},
          onProgress: function(event) { 
            if(callback && typeof callback === 'function'){
              callback(event)
            }
           },
           ...sendOption,
        });
        return this.sendMessage(message)
    }
    sendText = async (textContent, sendOption) => {
      const message = this.tim.createTextMessage({
        conversationType: this.TIM.TYPES.CONV_C2C,
        payload: { text: textContent },
        ...sendOption,
      });
      console.log(message,88888)
      return this.sendMessage(message)
    }
    sendFile = async (fileOption, sendOption,fileCallback,callback) => {
      const file = await this.getFile(fileOption);
      console.log(file,222)
      if(fileCallback && typeof fileCallback === 'function'){
        fileCallback(file.tempFiles[0].path)
      }
      const message = this.tim.createFileMessage({
        conversationType: this.TIM.TYPES.CONV_C2C,
        payload: { file },
        onProgress: function(event) { 
          console.log(event)
          if(callback && typeof callback === 'function'){
            callback(event)
          }
         },
         ...sendOption,
      });
      return this.sendMessage(message)
    };
    sendAudio = async (audioOption, sendOption,audioCallback,callback) => {
        const audioFile = await createAudio()
        console.log(audioFile,111)
        if(audioCallback && typeof audioCallback === 'function'){
            audioCallback(audioFile)
        }
        const message = this.tim.createAudioMessage({
            conversationType: this.TIM.TYPES.CONV_C2C,
            payload: { file: audioFile },
            onProgress: function(event) { 
            console.log(event)
            if(callback && typeof callback === 'function'){
                callback(event)
            }
             },
             ...sendOption,
        });
        return this.sendMessage(message)
        }

}
export default SendMessage