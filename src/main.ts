import Vue from 'vue'
import Component from 'vue-class-component'
import Element from 'element-ui'
import { getSize } from '@/utils/auth'
import SvgIcon from 'vue-svgicon'
import App from './App.vue'
import router from './router'
import store from './store'
import './errorLog'
import './icons/components'
import './router/router.interceptor'
import './filters'
import './directives'
import './services'
import './pwa/register-service-worker'
// mock
import { mockXHR } from '../mock'

// 注册钩子函数
Component.registerHooks(['beforeRouteEnter', 'beforeRouteLeave', 'beforeRouteUpdate'])

// mock api in github pages site build
if (process.env.NODE_ENV === 'development') {
  mockXHR()
}

Vue.use(Element, {
  size: getSize() || 'medium' // set element-ui default size
})

Vue.use(SvgIcon, {
  tagName: 'svg-icon',
  defaultWidth: '1em',
  defaultHeight: '1em'
})

Vue.config.productionTip = process.env.NODE_ENV === 'production'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
