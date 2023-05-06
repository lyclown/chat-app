import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'chat',
    component: () => import('@/components/layout/BasicsLayout'),
    redirect: '/chat',
    children: [{
            path: '/chat',
            name: 'chat',
            component: () => import('@/views/chat/ChatGPT.vue'),
        },
        {
            path: '/image',
            name: 'image',
            component: () => import('@/views/chat/ChatImage.vue'),
        },
        {
            path: '/video',
            name: 'video',
            component: () => import('@/views/chat/ChatVideo.vue'),
        }
    ]

}, ]

const router = new VueRouter({
    mode: 'hash',
    routes
})

export default router