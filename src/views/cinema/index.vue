<template>
  <div>
    <el-container>
      <el-header class="block" height="400">
        <!--查询表单-->
        <div class="search-div" style="margin: 10px">
          <el-form label-width="70px" size="small">
            <el-row>
              <el-col :span="24">
                <el-form-item label="影视名称">
                  <el-input
                    style="width: 100%"
                    v-model="searchObj.name"
                    placeholder="影视名称"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="display: flex">
              <el-button
                type="primary"
                icon="el-icon-search"
                size="mini"
                @click="fetchPageList()"
              >搜索
              </el-button
              >
              <el-button icon="el-icon-refresh" size="mini" @click="resetData"
              >重置
              </el-button
              >
            </el-row>
          </el-form>
        </div>
        <el-carousel height="400px" indicator-position="outside">
          <el-carousel-item v-for="index in carouselList" :key="index.id">
            <el-image
              class="carousel-img"
              :src="index.image">
            </el-image>
          </el-carousel-item>
        </el-carousel>
      </el-header>
      <el-main>
        <div>
          <span class="title">
            猜你喜欢
          </span>
          <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item :index="0">首页</el-menu-item>
            <el-menu-item :index="1">电视剧</el-menu-item>
            <el-menu-item :index="2">电影</el-menu-item>
          </el-menu>
        </div>
        <el-row :gutter="20">
          <el-col :span="5" v-for="movie in list" :key="movie.id">
            <div>
              <el-image
                style="height: 150px; margin-top: 10px"
                :src="movie.image">
              </el-image>
            </div>
            <!--跳转到播放影视-->
            <el-button size="medium" round @click="showPlayPage(movie.id)">{{ movie.name }}</el-button>
          </el-col>
        </el-row>
      </el-main>
      <el-aside width="200px" class="aside-card">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>今日排行</span>
            <el-button style="float: right; padding: 3px 0" type="text">全部</el-button>
          </div>
          <div v-for="o in 4" :key="o" class="text item">
            {{o+ '  ' + carouselList[o-1].name}}
          </div>
        </el-card>
      </el-aside>
      <el-footer height="50px">
        <el-pagination
          background
          layout="total, prev, pager, next, jumper"
          :current-page="page"
          :total="total"
          :page-size="limit"
          style="padding: 30px 0; text-align: center;"
          @current-change="fetchPageList">
        </el-pagination>
      </el-footer>
    </el-container>

  </div>
</template>

<script>
import api from '@/api/cinema/cinema'
import movie from "@/api/movie/movie";
import index from "v-viewer";

export default {
  computed: {
    index() {
      return index
    },
    movie() {
      return movie
    }
  },
  data() {
    return {
      listLoading: true, //  加载中的提示语.....
      list: [],
      carouselList: [],
      total: 0,
      page: 1,
      limit: 10,
      searchObj: {}
    }
  },
  created() {
    //this.listLoading=true;
    this.fetchPageList()
    this.findAll()
  },
  mounted() {
    setTimeout(() => {
      console.log('list', this.list)
      this.carouselList = this.list.slice(0, 4)
    }, 1000)
  },
  methods: {
    handleSelect(key){
      if (key === 0){
        this.searchObj = {}
      }else {
        this.searchObj.cid = key
      }
      this.fetchPageList()
    },
    // 跳转到播放视频页面
    showPlayPage(id) {
      this.$router.push('/system/assignVideo?id=' + id)
    },
    resetData() {
      //1.清空搜索条件
      this.searchObj = {};
      //2.再次刷新列表
      this.fetchPageList();
    },
    fetchPageList(page = 1) {
      this.page = page;
      api.getMoviePageInfo(this.page, this.limit, this.searchObj)
        .then((response) => {
          // this.listLoading=false;
          console.log("cinema:", response)
          this.list = response.data.records
          this.total = response.data.total
        }).catch((error) => {
        console.log('error:', error)
      })
    },
  }
}
</script>

<style scoped>
.title {
  font-weight: 500;
  font-size: 30px;
}

.carousel-img {
  height: 100%;
  font-size: 14px;
  margin-left: 500px;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.box-card {
  width: 200px;
}

.aside-card {
  position: fixed;
  right: 0%;
  top: 550px
}
</style>
