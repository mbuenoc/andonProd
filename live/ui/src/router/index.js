import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
//change path to production add process.env create, report
const routes = [
    {
        path: '/andon',
        //path: process.env.NODE_ENV === 'production' ? '/andon/' : '/',
        name: 'create-report',
        component: () => import ("../views/CreateReport.vue")
    },
    {
        path: '/open-reports',
        //path: process.env.NODE_ENV === 'production' ? '/andon/open-reports' : '/open-reports',
        name: 'open-reports',
        component: () => import ("../views/Reports.vue"),
    },
    {
        path: '/support',
        //path: process.env.NODE_ENV === 'production' ? '/andon/support' : '/support',
        name: 'support',
        component: () => import ("../views/Support.vue"),
    },
    {
        path: '/administrator',
        //path: process.env.NODE_ENV === 'production' ? '/andon/administrator' : '/administrator',
        name: 'administrator',
        component: () => import ("../views/Administrator.vue"),
    }

]

const router = new VueRouter({
    mode: 'history',
    //base: process.env.BASE_URL,
    routes
  })
  
  export default router