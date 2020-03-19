<template>
  <div class="app-container allArticle">

    <el-row>
      <el-form>
        <el-form-item label="标题" label-width="60px" style="margin-left:0px">
          <el-input v-model="search.title"></el-input>
        </el-form-item>
        <el-form-item label="作者" label-width="60px">
          <el-input v-model="search.user"></el-input>
        </el-form-item>
        <el-form-item label="发布时间" label-width="80px">
          <div class="block">
            <el-date-picker v-model="value1" type="datetimerange" range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </div>
        </el-form-item>
        <br />
        <el-form-item label="板块" label-width="60px" style="margin-left:0px">
          <el-select v-model="search.plate">
            <el-option v-for="item in search.plateList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类" label-width="60px">
          <el-select v-model="search.cata">
            <el-option v-for="item in search.cataList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: 80px;">
          <el-button size="small" type="primary" icon="el-icon-search" @click="onSearch()">查询</el-button>
          <router-link to='/article/release-article'>
              <el-button size="small" type="primary" icon="el-icon-edit-outline">新建</el-button>
          </router-link>
        </el-form-item>
      </el-form>
    </el-row>

    <div class="tables">
        <el-table class="tableStyle" border :data="tableData" :header-cell-style="tableHeaderColor" :cell-style="tableCellStyle"
          style="width: 100%" v-loading="loading">
          <el-table-column type="index" label="序号" width="50">
          </el-table-column>
          <el-table-column prop="title" label="标题">
          </el-table-column>
          <el-table-column label="封面" width="200">
            <template slot-scope="scope">
              <img :src="scope.row.coverUrl" alt="" style="
        height: 100px;max-width: 100%;">
            </template>
          </el-table-column>
          <el-table-column prop="module.name" label="板块" width="120">
          </el-table-column>
          <el-table-column prop="category.name" label="分类" width="120">
          </el-table-column>
          <el-table-column prop="author" label="作者" width="150">
          </el-table-column>
          <el-table-column label="创建时间" width="200">
            <template slot-scope="scope">{{ parseTime(scope.row.createTime) }}</template>
          </el-table-column>
          <el-table-column label="修改时间" width="200">
            <template slot-scope="scope">{{ parseTime(scope.row.updateTime) }}</template>
          </el-table-column>
          <el-table-column label="操作" width="250px">
            <template slot-scope="scope">
              <router-link :to="{path:'/article/release-article',query:{id:scope.row.id}}">
                 <el-button type="text" class="btn-info" size="mini" round>修改</el-button>
              </router-link>
              <el-button type="text" class="btn-success" size="mini" round @click="releaseArticle(scope.row)">发布</el-button>
              <el-button type="text" class="btn-danger" size="mini" round @click="deleteArticle(scope.row)">删除</el-button>
            </template>
          </el-table-column>

        </el-table>
        <div class="block" style="text-align: right;">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage"
            :page-sizes="[10, 20, 30, 50]" :page-size="size" layout="total,sizes, prev, pager, next" :total="totalNum">
          </el-pagination>
        </div>
    </div>

  </div>

</template>

<script>
  import {
    parseTime
  } from '@/utils/index'
  import {
    initData
  } from '@/api/data'
  import {
    postData
  } from '@/api/data'

  import {
    deleteData
  } from '@/api/data'

  export default {
    name: "DraftArticle",
    data() {
      return {
        // 搜索
        search: {
          plateList: [], //板块列表
          cataList: [], //分类列表
          title: "",
          user: "",
          plate: "",
          cata: ""
        },
        loading: true,
        // 发布时间
        value1: "",
        //文章列表
        tableData: [],
        //分页
        currentPage: 0,
        size: 20,
        totalNum: 0
      }
    },
    methods: {
      parseTime,
      //设置表格单元格的样式
      tableCellStyle({
        row,
        columnrowIndex,
        columnIndex
      }) {
        return 'font-size:12px;text-align:center;padding:7px 0;'
      },
      //设置表头行的样式
      tableHeaderColor({
        row,
        column,
        rowIndex,
        columnIndex
      }) {
        return 'font-size:12px;text-align:center;padding:2px 0;background:#f7f7f7;'
      },
      //查询
      onSearch() {
        this.loading = true
        var obj = {
          status: 0,
          title: this.search.title,
          author: this.search.user,
          categoryId: this.search.cata,
          moduleId: this.search.plate,
          publishTimeStart: this.value1[0],
          publishTimeEnd: this.value1[1],
          page: this.currentPage - 1,
          size: this.size,
          sort: "updateTime,desc",
        }
        this.articleList(obj)
      },
      //发布文章
      releaseArticle(row){
        var obj = {
          "id":row.id
        }
        var obj2 = {
          page: this.currentPage - 1,
          size: this.size,
          status: 0,
          sort: "updateTime,desc",
        }
        postData("/api/article/publish",obj).then(res => {
          this.articleList(obj2)
          this.toast("发布成功")
        })
      },
      //删除文章
      deleteArticle(row) {
        this.loading = true
        var obj = {
          page: this.currentPage - 1,
          size: this.size,
          status: 0,
          sort: "updateTime,desc",
        }
        deleteData("/api/article/" + row.id).then(res => {
          this.articleList(obj)
          this.toast("删除成功")
        })
      },
      //分页
      handleSizeChange(val) {

        this.loading = true
        this.size = val
        var obj = {
          page: this.currentPage - 1,
          size: this.size,
          status: 0,
          sort: "updateTime,desc",
        }
        this.articleList(obj)
      },
      handleCurrentChange(val) {

        this.loading = true
        this.currentPage = val
        var obj = {
          page: this.currentPage - 1,
          size: this.size,
          status: 0,
          sort: "updateTime,desc",
        }
        this.articleList(obj)
      },
      //请求文章列表
      articleList(obj) {
        initData("/api/article", obj).then(res => {
          this.tableData = res.content
          this.totalNum = res.totalElements
          this.loading = false
        })
      },
      //文章分类目录
      articleCatalog() {
        initData("/api/category", {sign:1,status:1}).then(res => {
          this.search.cataList = res.content
        })
      },
      //获取板块列表
      plateList() {
        initData("/api/tModule/web", {}).then(res => {
          this.search.plateList = res
        })
      },
      //提示
      toast(msg){
        this.$message({
          type: 'success',
          offset: '200',
          duration: 800,
          message: msg
        });
      }

    },
    created() {
      var obj = {
        status: 0,
        page: this.currentPage,
        size: this.size,
        sort: "updateTime,desc",
      }
      this.articleList(obj) //请求文章列表
      this.articleCatalog() //目录列表
      this.plateList() //板块列表
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .allArticle {

    .el-row {

      .el-form {
          margin-bottom: 20px;
          border-bottom: 1px solid #ccc;
        .el-form-item {
          display: inline-block;
        }

        /deep/.tableStyle {
          .el-table__footer-wrapper tbody td {
            text-align: center;
            font-size: 12px;
            padding: 5px 0;
          }
        }

      }

    }

    .tables{
        .block{
            padding-top: 20px;
        }
    }
  }
</style>
