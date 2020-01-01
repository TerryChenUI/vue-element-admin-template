/**
 *
 * @authors liwb (lwbhtml@gmail.com)
 * @date    2019/01/12
 * @description 定义路由模块
 */

import Vue, { AsyncComponent } from 'vue'
import Router from 'vue-router'
import Layout from '@/layout/index.vue'

/* Router Modules */

Vue.use(Router)

const loadView = (view: string): AsyncComponent => (): any => import(`@views/${view}/index.vue`)

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if true, the page will no be cached(default is false)
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
 **/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: loadView('redirect')
      }
    ]
  },
  {
    path: '/login',
    component: loadView('login'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: loadView('dashboard'),
        name: 'Dashboard',
        meta: {
          title: '首页',
          icon: 'dashboard',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404.vue'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401.vue'),
    hidden: true
  }
]

export const asyncRouterMap = [
  {
    path: '/example',
    component: Layout,
    redirect: '/example/list',
    name: 'Example',
    meta: {
      title: '例子',
      icon: 'example'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/example/create.vue'),
        name: 'CreateArticle',
        meta: {
          title: '创建文章',
          icon: 'edit'
        }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/example/edit.vue'),
        name: 'EditArticle',
        meta: {
          title: '编辑文章',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/example/list.vue'),
        name: 'ArticleList',
        meta: {
          title: '文章列表',
          icon: 'list'
        }
      }
    ]
  },
  {
    path: '/error',
    component: Layout,
    redirect: 'noredirect',
    name: 'ErrorPages',
    meta: {
      title: '错误页面',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/errorPage/401.vue'),
        name: 'Page401',
        meta: {
          title: '401',
          noCache: true
        }
      },
      {
        path: '404',
        component: () => import('@/views/errorPage/404.vue'),
        name: 'Page404',
        meta: {
          title: '404',
          noCache: true
        }
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter: any = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({
      x: 0,
      y: 0
    }),
    routes: constantRouterMap
  })

const router = createRouter()

/*
 * Preventing "NavigationDuplicated" errors in console in Vue-router >= 3.1.0
 * https://github.com/vuejs/vue-router/issues/2881#issuecomment-520554378
 * */

const routerMethods = ['push', 'replace']

routerMethods.forEach((method: string) => {
  const originalCall = (Router.prototype as any)[method]
    // tslint:disable-next-line:space-before-function-paren
  ;(Router.prototype as any)[method] = function(location: any, onResolve: any, onReject: any): Promise<any> {
    if (onResolve || onReject) {
      return originalCall.call(this, location, onResolve, onReject)
    }
    return (originalCall.call(this, location) as any).catch((err: any) => err)
  }
})

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
