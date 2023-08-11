import Vue from 'vue'
import axios from "axios";
import VueAxios from "vue-axios";
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import JsonViewer from 'vue-json-viewer'

let token = localStorage.getItem('accessToken');
axios.defaults.headers.common = {'Authorization': 'Bearer '+ token }

Vue.use(VueAxios,axios)
Vue.use(require('vue-moment'));
Vue.use(JsonViewer);
Vue.config.productionTip     = false


new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
