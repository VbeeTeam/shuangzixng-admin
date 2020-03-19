<template>
  <div class="app-container allArticle">

    <el-row>
      <el-form label-width="60px">
        <el-form-item label="标题">
          <el-input v-model="search.title"></el-input>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="search.user"></el-input>
        </el-form-item>
        <el-form-item label="发布时间" label-width="80px">
            <el-date-picker v-model="value1" type="datetimerange" range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
        </el-form-item>
        <br />
        <el-form-item label="板块">
          <el-select v-model="search.plate">
            <el-option v-for="item in search.plateList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="search.cata">
            <el-option v-for="item in search.cataList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: 20px;">
          <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <div class="tables">
        <el-table class="tableStyle" border :data="tableData" :header-cell-style="tableHeaderColor"
        :cell-style="tableCellStyle" v-loading="loading">
          <el-table-column type="index" label="序号" width="59">
          </el-table-column>
          <el-table-column prop="title" label="标题" width="200">
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
          <el-table-column label="发布时间" width="200">
            <template slot-scope="scope">{{ parseTime(scope.row.publishTime) }}</template>
          </el-table-column>
          <el-table-column label="操作" width="150px">
            <template slot-scope="scope">
              <el-button type="text" class="btn-danger" size="mini" round @click="backArticle(scope.row)">撤回</el-button>
            </template>
          </el-table-column>

        </el-table>
        <div class="block" style="width: 1200px;text-align: right;">
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
    putData
  } from '@/api/data'

  export default {
    name: "AllArticle",
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
          status: 1,
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
      //撤回
      backArticle(row) {
        this.loading = true
        var obj = {
          id:row.id,
          status:0
        }
        var obj2 = {
          page: this.currentPage - 1,
          size: this.size,
          status: 1,
          sort: "updateTime,desc",
        }
        putData("/api/article", obj).then(res => {
            this.$message({
              type: 'success',
              offset: '200',
              duration: 1000,
              message: "撤回成功"
            });

          this.articleList(obj2)
          this.loading = false
        })
      },

      //分页
      handleSizeChange(val) {

        this.loading = true
        this.size = val
        var obj = {
          page: this.currentPage - 1,
          size: this.size,
          status: 1,
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
           status: 1,
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


    },
    created() {
      var obj = {
        status: 1,
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
        border-bottom: 1px solid #ccc;
        margin-bottom: 20px;
        .el-form-item {
          display: inline-block;
        }
      }
    }
    
    /deep/.tableStyle {
        width: 1200px;
      .el-table__footer-wrapper tbody td {
        text-align: center;
        font-size: 12px;
        padding: 5px 0;
      }
    }
    .block{
        background-color: #fff;
        padding: 20px;
    }
  }

</style>
