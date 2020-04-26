<template>
  <div style="width: 100%">
    <div>
      <mu-text-field v-model="keywords" placeholder="search" @blur.prevent="shows"></mu-text-field>
      <mu-button color="primary" @click="search()">点击搜索</mu-button>
      <p style="margin:0 0px 0 0px">热门标签:</p>
      <mu-chip
        class="demo-chip"
        v-for="chip in chips"
        :key="chip.id"
        :color="chip.type"
        style="margin:0 20px 0 0;"
        @click="chipsSearch(chip.name)"
        >{{ chip.name }}</mu-chip
      >
    </div>

    <!-- 左边歌单表 -->
    <div style="display:flex;padding: 20px 20px">
      <div class="s-l-table">
        <mu-data-table :columns="columns" :data="song" class="s-l-table-content">
          <template slot-scope="scope">
            <!-- <td class="is-left">{{ scope.row.songId }}</td> -->
            <td class="is-left">{{ scope.row.songListName }}</td>
            <td class="is-right">{{ scope.row.commentCount }}</td>
            <td class="is-right">{{ scope.row.likeCount }}</td>
            <td class="is-right">{{ scope.row.songCount }}</td>
            <td class="is-right">{{ scope.row.createTime.slice(0, 10) }}</td>
          </template>
        </mu-data-table>
        <mu-flex justify-content="center" v-if="show">
          <!-- 每页显示的数量 -->
          <span style="margin-top: 10px">每页显示：</span>
          <mu-select style="width:70px" v-model="size" full-widt>
            <mu-option v-for="(option, index) in options" :key="index" :label="option" :value="option"></mu-option>
          </mu-select>
          <!-- 分页 -->
          <mu-pagination :total="totalPage" :current.sync="currentPage"></mu-pagination>
        </mu-flex>
      </div>
    </div>
  </div>
</template>

<script>
const initChips = [
  { id: 1, name: '怀旧', type: 'secondary' },
  { id: 2, name: '经典', type: 'success' },
  { id: 3, name: '时尚', type: 'info' },
  { id: 4, name: '音乐', type: 'warning' },
  { id: 5, name: '周杰伦', type: 'error' },
  { id: 6, name: '华语', type: 'primary' }
]
export default {
  name: 'MusicList',
  data() {
    return {
      chips: [...initChips],
      sort: {
        name: '',
        order: 'asc'
      },
      options: ['20', '5', '10', '15'],
      columns: [
        // { title: 'id', width: 160, name: 'name', align: 'center' },
        { title: '歌单名', name: 'name', width: 240, align: 'left', sortable: true },
        { title: '评论数', name: 'comment', width: 160, align: 'right', sortable: true },
        { title: '收藏数', name: 'like', width: 160, align: 'right', sortable: true },
        { title: '播放量', name: 'play', width: 160, align: 'right', sortable: true },
        { title: '创建时间', name: 'create_time', width: 160, align: 'right', sortable: true }
      ],
      song: [],
      buttonMenu: [],
      currentPage: 1,
      totalPage: 1000,
      size: 10,
      active: 0,
      types: [],
      typeChildSongList: [],
      keywords: '',
      show: true,
      id: ''
    }
  },
  components: {},
  created() {
    this.getSong()
    this.currentPage
    console.log('token的值' + this.token)
    console.log(localStorage.getItem('admin'))
  },
  mounted() {},
  watch: {
    size: function() {
      this.getSong()
    },
    currentPage: function() {
      this.getSong()
    }
  },
  methods: {
    //获取歌单
    getSong() {
      console.log('测试')
      let roleId = localStorage.getItem('roleId')
      console.log(roleId)
      //取得前一个页面传过来的roleId
      // let roleId = this.$route.query.roleId
      // console.log(roleId)
      this.axios({
        method: 'get',
        url: this.GLOBAL.baseUrl + '/songList/page?roleId=' + roleId,
        params: {
          currentPage: this.currentPage,
          size: this.size
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((res) => {
        this.song = res.data.data
        this.getButtonMenu()
        console.log(this.types)
        console.log(this.song)
      })
    },
    chipsSearch(name) {
      this.keywords = name
      this.search()
    },
    //模糊查询歌单
    search() {
      let roleId = localStorage.getItem('roleId')
      this.axios({
        method: 'get',
        url: this.GLOBAL.baseUrl + '/songList/blur?roleId=' + roleId,
        // 问号带参，表单提交
        params: {
          field: this.keywords
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((res) => {
        this.song = res.data.data
        this.show = false
      })
    },
    shows() {
      if (this.keywords === '') this.show = true
      this.getSong()
    },
    //获取歌单中的按钮权限
    getButtonMenu() {
      for (let i = 0; i < this.$store.state.menuList.length; i++) {
        let menu = this.$store.state.menuList[i].subMenus

        if (menu != null) {
          for (let j = 0; j < menu.length; j++) {
            if (menu[j].title === '歌曲管理') {
              this.buttonMenu = menu[j].subMenus
            }
          }
        }
      }
    }
  },
  computed: {}
}
</script>

<style scoped lang="scss">
.table {
  background-color: white;
  color: black;
}

.content {
  flex: 0 0 33%;
}

.btn {
  margin: 20px 20px;
}

.s-l-table {
  width: 150%;
  background-color: white;
  margin-right: 60px;
  box-shadow: 2px 2px 2px 2px #ddd;
  height: 500px;
  &-content {
    height: 550px;
    overflow-y: auto;
    overflow-x: hidden;
    margin-bottom: 10px;
  }
}

.tabs {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 120px;
  overflow-y: auto;
}

.s-l-tab {
  background-color: white;
  box-shadow: 2px 2px 2px 2px #ddd;
  height: 500px;
  display: flex;
}

.childTable {
  overflow: auto;
  width: 100%;
  height: 500px;
  overflow-x: hidden;
  overflow-y: auto;
}
.scroll-hidden {
  ::-webkit-scrollbar {
    width: 0 !important;
  }
  ::-webkit-scrollbar {
    width: 0 !important;
    height: 0;
  }
}
</style>
