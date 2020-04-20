import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    token: localStorage.getItem('token'),
    // parse一下，因为user是我们json序列化过的数据
    user: JSON.parse(localStorage.getItem('user')),
    menuList: [
      {
        title: 'Dashboard',
        icon: 'mdi-view-dashboard',
        url: '/dashboard',
        subMenus: []
      },
      {
        title: '音乐管理',
        icon: 'mdi-music',
        // 因为是一个展开菜单，所以URL为空
        url: '',
        subMenus: [
          {
            title: '歌单管理',
            icon: 'mdi-domain',
            url: '/music-list',
            // 没有权限
            permissions: []
          },
          {
            title: '歌曲管理',
            icon: 'mdi-text',
            url: '/music',
            permissions: ['music:add', 'music:edit', 'music:delete']
          }
        ]
      },
      { title: 'about', icon: 'mdi-help-box', url: '/about', subMenus: [] }
    ]
  },
  // 几个set方法，方便vuex更新
  mutations: {
    setToken(state, data) {
      state.token = data
    },
    setUser(state, user) {
      state.user = user
    },
    setMenuList(state, menuList) {
      state.menuList = menuList
    }
  },
  actions: {}
})
// export default new Vuex.Store({
//   state: {},
//   mutations: {},
//   actions: {},
//   modules: {}
// });
export default store
