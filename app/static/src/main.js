import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Home from './container/Home.vue'
import Order from './container/Order.vue'
import Admin from './container/Admin.vue'
import AdminStatus from './container/AdminStatus.vue'

import 'normalize.css'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: "history",
  routes: [{
    path: "/",
    component: Home
  }, {
    path: "/order/:id",
    name: "order",
    component: Order
  }, {
    path: "/admin",
    component: Admin
  }, {
    path: "/admin/status",
    component: AdminStatus
  }]
})

new Vue({
  el: '#app',
  router: router,
  render: (h) => h(App)
})
