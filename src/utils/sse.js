// import { EventSourcePolyfill } from 'event-source-polyfill';
class SSE {
    constructor(url, option, callback) {
        this.url = url
        this.option = option
        this.eventSource = null
        this.callback = typeof callback === 'function' ? callback : () => { }
        this.status = 'init'
        this.retryCount = 0
        this.maxRetryCount = 3
        this.init()
    }
    init = () => {
        this.eventSource = new EventSource(this.url, this.option)
        this.addEventListeners();
    }
    addEventListeners = () => {
        this.eventSource.addEventListener('message', this.onMessage)
        this.eventSource.addEventListener('error', this.onError)
        this.eventSource.addEventListener('open', this.onOpen)
        this.eventSource.addEventListener('close', this.onClose)
    }
    onError = (e) => {
        // 浏览器刷新会触发erroror事件,所以需要判断一下
        if(e  && e.target && e.target.readyState === 2) {
            this.onRetry();
        }
       
    }
    onMessage = (e) => {
        if(this.eventSource.readyState === 2) {
            this.status = 'close'
            return
        }
        this.status = 'message'
        this.callback({ event: e, error: null, status: this.status })
    }
    onClose = (e) => {
        this.status = 'close'
        this.callback({ event: e, error: null, status: this.status })
    }
    onOpen = (e) => {
        this.status = 'open'
        this.callback({ event: e, error: null, status: this.status })
    }
    onRetry = () => {
        console.log(666666)
        this.close();
        this.retryCount++;
        if (this.retryCount <= this.maxRetryCount) {
            setTimeout(() => {
                console.log(`Retry attempt ${this.retryCount}`);
                this.init();
            }, 5000);
        } else {
            const error = new Error(`Failed to connect after ${this.retryCount} attempts`);
            console.error(`Failed to connect after ${this.retryCount} attempts`);
            this.status = 'error'
            this.callback({ event: null, error, status: this.status })
        }
    }
    close = () => {
        this.eventSource.close()
        this.removeEventListeners()
        this.eventSource = null
        this.status = 'init'
    }
    removeEventListeners = () => {
        this.eventSource.removeEventListener('message', this.onMessage())
        this.eventSource.removeEventListener('error', this.onError())
        this.eventSource.removeEventListener('open', this.onError())
        this.eventSource.removeEventListener('close', this.onError())
    }

}
export default SSE