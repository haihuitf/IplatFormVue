import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import index from '@/page/index'
import manage from '@/page/manage'
import addShop from '@/page/addModel'
import adminList from '@/page/modelList'
import addCase from '@/page/addCase'
import addProject from '@/page/addProject'
// import {addProject} from '../api/getData'
Vue.use(Router)

// const login = r => require.ensure([], () => r(require('@/page/login')), 'login')

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld
    // }
    // {
    //   path: '/',
    //   name: 'index',
    //   component: index
    // },
    {
      path: '/',
      name: 'manage',
      component: manage,
      children: [{
        path: '/home',
        name: 'home',
        component: addShop
      }, {
        path: '/modelList',
        name: 'modelList',
        component: adminList
      }, {
        path: '/addCase',
        name: 'addCase',
        component: addCase
      }, {
        path: '/addProject',
        name: 'addProject',
        component: addProject
      }]
    }
  ]
})
