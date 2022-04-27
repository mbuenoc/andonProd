import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import swal from 'sweetalert'
import VueToastr from 'vue-toastr'
import vuetify from '@/plugins/vuetify'
import JsonCSV from 'vue-json-csv'

Vue.config.productionTip = false

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'

Vue.use(axios, swal)
Vue.use(VueMaterial)
Vue.component('downloadCsv', JsonCSV)
Vue.use(require('vue-moment'))
Vue.use(VueToastr, {
  defaultTimeout: 7000
})

const moment = require('moment')
moment().format()
//axios.defaults.baseURL = '/andon-api/'

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
