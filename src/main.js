// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import '../static/lib/js/auto.js'
import mixin from './mixin/mixin.js'
Vue.config.productionTip = false 
//设置为 false 以阻止 vue 在启动时生成生产提示。
//# sourceMappingURL=auto-size.js.map
/* eslint-disable no-new */
document.title=TITLE;
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  mixins: [mixin],
})
