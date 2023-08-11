import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../components/Dashboard'
import CrossSeller from '../components/CrossSeller'
import Search from '../components/Search'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard
  },
  {
    path: '/search',
    name: 'Search',
    component: Search
  },
  {
    path: '/CrossSeller/:id',
    name: 'Cross Seller',
    component: CrossSeller
  }

]

const router = new VueRouter({
  routes
})

export default router
