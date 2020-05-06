<template>
  <v-app>
    <v-app-bar
      fixed
      color="cyan darken-4"
      dark
      src="https://niit-soft.oss-cn-hangzhou.aliyuncs.com/wallpaper/18.jpg"
      height="120px"
      app
    >
      <template v-slot:img="{ props }">
        <v-img v-bind="props" gradient="to top right, rgba(55,71,79,.6), rgba(128,208,199,.7)"></v-img>
      </template>
      <v-app-bar-nav-icon @click.stop="mini = !mini"></v-app-bar-nav-icon>
      <v-toolbar-title>云音乐后台</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>
      <v-menu left bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title>系统设置</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>主题设置</v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout()">
            <v-list-item-title>退出系统</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer
      fixed
      class="blue-grey darken-3"
      v-model="drawer"
      :mini-variant.sync="mini"
      permanent
      dark
      app
      fluid
    >
      <v-card class="gradient-bg" min-height="130px">
        <router-link to="/profile">
          <v-avatar class="mt-6">
            <img :src="avatar" />
          </v-avatar>
        </router-link>
        <v-spacer></v-spacer>
        <h4>{{ name }}</h4>
      </v-card>

      <v-list>
        <template v-for="(menu, parent) in menuList">
          <v-list-group :key="parent" v-if="menu.subMenus.length !== 0" color="light-blue">
            <template v-slot:activator>
              <v-list-item-icon>
                <v-icon>{{ menu.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ menu.title }}</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item v-for="(subMenu, current) in menu.subMenus" :key="current" ripple>
              <v-list-item-icon>
                <v-icon>{{ subMenu.icon }}</v-icon>
              </v-list-item-icon>
              <router-link :to="subMenu.path">
                <v-list-item-content>
                  <v-list-item-title>{{ subMenu.title }}</v-list-item-title>
                </v-list-item-content>
              </router-link>
            </v-list-item>
          </v-list-group>

          <v-list-item v-else :key="parent" color="light-blue" mandatory="true" ripple>
            <v-list-item-icon>
              <v-icon>{{ menu.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <router-link :to="menu.path">
                <v-list-item-title>{{ menu.title }}</v-list-item-title>
              </router-link>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <router-view> </router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'Layout',
  data() {
    return {
      menuList: [],
      drawer: true,
      mini: false
    }
  },
  created() {
    if (localStorage.getItem('token') === null) {
      this.$router.push('/login')
    }
    this.axios.get(this.GLOBAL.baseUrl + '/sysAdmin/' + localStorage.getItem('id')).then((res) => {
      this.$store.commit('setAvatar', res.data.data.avatar)
      this.$store.commit('setName', res.data.data.name)
    })
    this.axios.get(this.GLOBAL.baseUrl + '/sysRole?roleId=' + localStorage.getItem('roleId')).then((res) => {
      this.menuList = res.data.data.menus
      console.log(this.menuList)
      this.$store.commit('setMenuList', JSON.stringify(res.data.data.menus))
      localStorage.setItem('menuList', JSON.stringify(res.data.data.menus))
    })
  },
  mounted() {},
  methods: {
    logout() {
      alert('log out')
      localStorage.removeItem('token')
      localStorage.removeItem('admin')
      localStorage.removeItem('menuList')
      this.$router.push('/login')
    }
  },
  computed: {
    avatar: {
      get: function() {
        return this.$store.state.avatar
      },
      set: function(newValue) {
        this.$store.commit('setAvatar', newValue)
      }
    },
    name: {
      get: function() {
        return this.$store.state.name
      },
      set: function(newValue) {
        this.$store.commit('setName', newValue)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.gradient-bg {
  background-image: linear-gradient(to bottom, rgba(55, 71, 79, 0.5), rgba(128, 208, 199, 0.8));
}
</style>
