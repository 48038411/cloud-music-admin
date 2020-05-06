<template>
  <v-app class="bg">
    <v-content>
      <v-container class="fill-height" fluid v-if="!dialog">
        <v-row align="center" justify="center" class="login">
          <v-col cols="12" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="cyan" dark flat>
                <v-toolbar-title>云音乐后台登录</v-toolbar-title>
                <v-spacer />
                <v-btn icon large bottom>
                  <v-icon>mdi-music</v-icon>
                </v-btn>
                <v-btn icon large right>
                  <v-icon>mdi-codepen</v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-text-field v-model="name" :counter="13" :rules="nameRules" label="Name" required></v-text-field>
                  <v-text-field v-model="password" :rules="passRules" label="Password" required></v-text-field>
                  <v-row>
                    <v-col cols="12" md="8">
                      <v-text-field v-model="verifyCode" :rules="codeRules" label="verifyCode" required></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <img class="verify" @click.prevent="refresh" ref="codeImg" />
                    </v-col>
                  </v-row>
                  <v-checkbox
                    v-model="checkbox"
                    :rules="[(v) => !!v || '同意才能继续!']"
                    label="是否同意协议?"
                    required
                  ></v-checkbox>
                  <v-card-actions class="justify-center">
                    <v-btn :disabled="!valid" color="success" @click="submit">
                      登录
                    </v-btn>
                    <v-btn color="deep-orange" dark @click="reset">
                      重置
                    </v-btn>
                    <v-btn color="purple" dark @click="gitHub">
                      GitHub
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>

    <!--遮罩-->
    <!-- <div class="mask"></div> -->

    <div class="mask">
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="800" style="z-index:999">
          <v-row class="fill-height" align="center" justify="center">
            <template v-for="(role, i) in roles">
              <v-col :key="i" cols="12" md="6">
                <v-hover v-slot:default="{ hover }">
                  <v-card :elevation="hover ? 12 : 2" :class="{ 'on-hover': hover }" class="my-card">
                    <v-img src="../../assets/images/card.jpg" height="305px">
                      <v-card-title class="title white--text">
                        <v-card-actions justify="center" align="center">
                          <v-btn class="mx-2" fab dark large color="pink" @click="gotoIndex(role.roleId)">
                            <v-icon dark>mdi-heart</v-icon>
                          </v-btn>
                          {{ role.roleName }}
                        </v-card-actions>
                      </v-card-title>
                    </v-img>
                  </v-card>
                </v-hover>
              </v-col>
            </template>
          </v-row>
        </v-dialog>
      </v-row>
    </div>
  </v-app>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      valid: true,
      name: 'guoruichang',
      nameRules: [(v) => !!v || 'Name is required', (v) => (v && v.length <= 13) || '用户名不能超过13位'],
      password: '123456',
      passRules: [
        (v) => !!v || 'Pass is required',
        (v) => (v.length >= 6 && v.length <= 10) || '密码必须在6到10位之间'
      ],
      verifyCode: '',
      codeRules: [(v) => !!v || '验证码不能为空', (v) => v.length == 4 || '验证码必须是4位字符 '],
      checkbox: false,
      dialog: false,
      overlay: false,
      roles: []
    }
  },
  components: {},
  created() {
    this.axios.get('/captcha?name=' + this.name, { responseType: 'blob' }).then((res) => {
      let img = this.$refs.codeImg
      let url = window.URL.createObjectURL(res.data)
      img.src = url
    })
  },
  mounted() {},
  methods: {
    validate() {
      this.$refs.form.validate()
    },
    reset() {
      this.$refs.form.reset()
    },
    resetValidation() {
      this.$refs.form.resetValidation()
    },
    submit() {
      //表单验证通过
      console.log('form valid: ')
      //表单验证通过后才显示验证码
      this.axios({
        method: 'post',
        url: '/sysAdmin/login',
        data: {
          name: this.name,
          password: this.password,
          verifyCode: this.verifyCode
        }
      }).then((res) => {
        //登录成功
        if (res.data.code === 1) {
          //存token
          localStorage.setItem('token', res.data.data.token)
          this.$store.commit('setToken', res.data.data.token)
          // let admin = {
          //   id: res.data.data.admin.id,
          //   name: res.data.data.admin.name,
          //   password: '',
          //   avatar: res.data.data.admin.avatar
          // }
          localStorage.setItem('id', res.data.data.admin.id)
          localStorage.setItem('name', res.data.data.admin.name)
          localStorage.setItem('avatar', res.data.data.admin.avatar)
          this.$store.commit('setName', res.data.data.admin.name)
          this.$store.commit('setAvatar', res.data.data.admin.avatar)
          // localStorage.setItem('admin', JSON.stringify(admin))
          // this.$store.commit('setAdmin', localStorage.getItem('admin'))
          this.roles = res.data.data.admin.roles
          //角色数量超过1个
          if (this.roles.length > 1) {
            //弹出遮罩层选择
            this.overlay = true
            this.dialog = true
          } else {
            //只有一个角色
            const roleId = res.data.data.admin.roles[0].roleId
            //将roleId存入全局
            localStorage.setItem('roleId', roleId)
            this.$router.push('/')
          }
        } else {
          //登录失败
          alert(res.data.msg)
          //清空验证码文本框
          this.verifyCode = ''
        }
      })
    },
    refresh() {
      //点击验证码图片，重新请求，刷新
      this.axios.get('/captcha?name=' + this.name, { responseType: 'blob' }).then((res) => {
        let img = this.$refs.codeImg
        let url = window.URL.createObjectURL(res.data)
        img.src = url
      })
    },
    clear() {
      this.$refs.form.clear()
      this.validateForm = {
        username: '',
        password: '',
        isAgree: false
      }
    },
    gotoIndex(roleId) {
      //将roleId存入本地存储
      localStorage.setItem('roleId', roleId)
      this.$router.push('/')
    },
    gitHub() {
      const authorize_uri = 'https://github.com/login/oauth/authorize'
      const client_id = 'b5e339efee2001ce3dc8'
      const redirect_uri = 'http://localhost:8080/oauth2/code/github'
      window.location.href = `${authorize_uri}?client_id=${client_id}&redirect_uri=${redirect_uri}`
    }
  },
  computed: {}
}
</script>

<style scoped lang="scss">
.bg {
  background-image: url('https://niit-soft.oss-cn-hangzhou.aliyuncs.com/wallpaper/18.jpg');
  background-size: 100% 100%;
  opacity: 0.8;
  .login {
    z-index: 9;
  }
}
.mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-image: linear-gradient(to right, #bf30ac 0%, #0f9d58 100%);
  opacity: 0.6;
}
.my-card {
  transition: opacity 0.4s ease-in-out;
}
.my-card:not(.on-hover) {
  opacity: 0.6;
}
.show-btns {
  color: rgba(255, 255, 255, 1) !important;
}
</style>