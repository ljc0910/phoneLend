import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/view/Login'
import addPhone from '@/view/page/index/addPhone/addPhone'
import index from '@/view/page/index/index'
import lendDetail from '@/view/page/lendDetail'
import Nullpoint from '@/view/Nullpoint'
import page from '@/view/page/page'

Vue.use(Router)
const router = new Router({
  routes: [ {
      path: '/Nullpoint',
      name: 'Nullpoint',
      component: Nullpoint
    },
    {
      path: '/', 
      name: 'Login',
      component: Login 
    },
    {
      path: '/page',
      name: 'page',
      component: page,
      children:[
        {
          path: 'index',
          name: 'index',
          component: index
        },
        {
          path: 'lendDetail',
          name: 'lendDetail',
          component: lendDetail
        }
      ] 
    }
  ],
  hashbang: false,
  history: true
})
const getCookie = ()=>{
    let arrCookie = document.cookie.split("; ");
    for(let i = 0; i < arrCookie.length; i++){
        let arr = arrCookie[i].split("=");
        if(arr[0] == 'token'){
            return true;
        }
    }
    return false
}
router.beforeEach((to, from, next) => {
  if(to.name=='Login'){
      next();   
  }else if(getCookie()){
      if(to.matched.length ===0){
        // next('/Nullpoint')
        next()
      }else{
        next();
      }
    }else{
      next('/');
    }
  })

export default router


