import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Vant from 'vant';
import 'vant/lib/index.css';
import highlight from 'highlight.js';
import 'highlight.js/styles/dark.css';
import router from './router';
import VueClipboard from 'vue-clipboard2'
import copyContent from   '@/components/copy/copy.js'
import '@/styles/base.scss'
Vue.use(VueClipboard)
// import VConsole from 'vconsole';
Vue.use(Vant);

// new VConsole();
Vue.use(ElementUI);

Vue.use(highlight)
Vue.config.productionTip = false

Vue.directive('highlight', (el) => {
  let blocks = el.querySelectorAll('pre code')
  blocks.forEach((block) => {
    const parentNode = block.parentNode
    if(!parentNode.querySelector('.copy-wrap')){
      copyContent(block)
    }
    highlight.highlightBlock(block)
  })
})
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
