<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4">
        <v-card max-width="375" class="ml-1">
          <v-img :src="avatar" height="300px" @click="handleClick()">
            <input type="file" @change="changeAvatar($event)" style="display:none" ref="avatarFile" />
            <v-row class="fill-height">
              <v-card-title>
                <v-spacer></v-spacer>
              </v-card-title>

              <v-spacer></v-spacer>
            </v-row>
          </v-img>

          <v-list-item-icon @click="show = !show" v-if="!show">
            <v-icon color="cyan">mdi-pencil</v-icon>
          </v-list-item-icon>

          <v-list two-line v-if="show" class="animated zoomIn">
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="cyan">mdi-account</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-text-field
                  v-model="newName"
                  :counter="10"
                  :placeholder="name"
                  :value="name"
                  label="Name"
                  required
                ></v-text-field>
              </v-list-item-content>
            </v-list-item>

            <v-divider inset></v-divider>
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="cyan">mdi-lock</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-text-field
                  v-model="password"
                  :counter="10"
                  :value="password"
                  label="Password"
                  required
                ></v-text-field>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-btn color="cyan" dark @click="updateInfo">确定</v-btn>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <v-spacer></v-spacer>
  </v-container>
</template>

<script>
export default {
  name: 'Profile',
  data() {
    return {
      show: false,
      newName: '',
      password: '',
      homePage: '',
      user: null
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
  },
  created() {
    this.axios.get('/sysAdmin/' + localStorage.getItem('id')).then((res) => {
      this.password = res.data.data.password
      this.$store.commit('setAvatar', res.data.data.avatar)
      this.$store.commit('setName', res.data.data.name)
      // this.name = this.$store.state.name
      // this.avatar = this.$store.state.avatar
    })
  },
  methods: {
    handleClick() {
      this.$refs.avatarFile.click()
    },
    changeAvatar() {
      let formData = new FormData()
      formData.append('id', localStorage.getItem('id'))
      formData.append('file', event.target.files[0])
      this.axios({
        method: 'post',
        url: '/sysAdmin/upload',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: formData
      }).then((res) => {
        console.log(res.data.data)
        this.avatar = res.data.data
        this.$store.commit('setAvatar', res.data.data)
      })
    },
    updateInfo() {
      let sysAdminDto = {
        id: localStorage.getItem('id'),
        name: this.newName,
        password: this.password
      }
      this.axios({
        method: 'post',
        url: '/sysAdmin/profile',
        data: sysAdminDto
      }).then((res) => {
        console.log(res.data.data)
        this.show = !this.show
        this.password = ''
        this.$store.commit('setName', this.newName)
      })
    }
  }
}
</script>
<style scoped lang="scss">
.mr-1 {
  margin-top: -240px;
  margin-left: 300px;
}
</style>
