// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import store from './store/store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/font/iconfont.css'
import vResultAlert from './components/resultAlert/resultAlert'
import vHeader from './components/header'
import vFooter from './components/footer'
import vContent from './components/content'
Vue.config.productionTip = false
Vue.prototype.API = 'http://localhost:4000/api/'  //接口地址
Vue.prototype.$http = axios
Vue.use(ElementUI);
Vue.component('v-header', vHeader) //注册全局组件
Vue.component('v-content', vContent) 
Vue.component('v-footer', vFooter) 

Vue.component('v-result-alert', vResultAlert) 
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
 