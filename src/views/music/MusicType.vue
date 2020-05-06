<template>
  <div>
    <h3>登录</h3>
    <button @click="login()">点击登录</button>
  </div>
</template>

<script>
export default {
  name: 'MusicType',
  data() {
    return {}
  },
  components: {},
  created() {},
  mounted() {},
  methods: {
    login() {
      alert('click')
      const authorize_url = 'http://github.com/login/oauth/authorize'
      const client_id = '7e89e0304f0897d1114f'
      const redirect_url = 'http://localhost:8080/callback'
      window.location.href = `${authorize_url}?client_id=${client_id}&redirect_uri=${redirect_url}`
    }
  },
  computed: {}
}
</script>

<style scoped lang="scss"></style>
