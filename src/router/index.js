import Vue from 'vue'
import Router from 'vue-router'
import Auth from '@/components/Auth'
import Login from '@/components/Login'
import Register from '@/components/Register'
import ResetPasswd from '@/components/ResetPasswd'
import Chat from '@/components/Chat'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Auth',
      component: Auth,
      redirect:'/login',
      children:[
        {
          path: '/login',
          component: Login,
          
        },
        {
          path: '/register',
          component: Register, 
        },
        {
          path: '/reset',
          component: ResetPasswd, 
        }
      ]
    },
    {
      path:"/chat",
      component:Chat
    }
  
  ]
})
