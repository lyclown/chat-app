import CopyContent from './index.vue'
import Vue from 'vue'
const CopyExtend = Vue.extend(CopyContent)
function copyContent(el){
    const app = new CopyExtend({el:document.createElement('div')});
    [...el.classList].forEach(cla=>{
        if(cla && cla.startsWith('language-')){
            app.language_type = cla.split('-')[1]
        }
    })
    app.contetnNode = el
    const parentNode = el.parentNode
    parentNode.insertBefore(app.$el,el)

}
Vue.prototype.$copy = copyContent
export default copyContent
