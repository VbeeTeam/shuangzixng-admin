<template>
  <div class="app-container catalogArticle">
    <el-row>
      <el-form>
        <el-form-item label="名称" label-width="60px" style="margin-left:0px">
          <el-input v-model="catalogName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
        </el-form-item>
        <br />
        <el-form-item label="名称" label-width="60px">
          <el-input v-model="catalogText"></el-input>
        </el-form-item>
        <el-form-item label="类目" label-width="80px">
          <el-select v-model="cataId" placeholder="文章类目">
            <el-option v-for="item in cata" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" icon="el-icon-edit-outline" @click="addCatalog()">新建</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <div class="tables">
        <el-table class="tableStyle" border :data="cataList" :header-cell-style="tableHeaderColor" :cell-style="tableCellStyle"
        style="width: 701px;"  v-loading="loading">
          <el-table-column type="index" label="序号" width="50">
          </el-table-column>
          <el-table-column prop="name" label="名称" width="200" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="sign" label="类目" width="200" show-overflow-tooltip>
            <template slot-scope="scope">
               <span v-if="scope.row.sign == 1 ">文章</span>
               <span v-else>问答</span>
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作" width="250px">
            <template slot-scope="scope">
              <el-button type="text" class="btn-info" size="mini" round @click="change(scope.row)">修改</el-button>

              <el-button v-if="!scope.row.status" type="text" class="btn-success" size="mini" round @click="status(scope.row)">启用</el-button>
              <el-button v-else-if="scope.row.status" type="text" class="btn-warning" size="mini" round @click="status(scope.row)">禁用</el-button>

              <el-button type="text" class="btn-danger" size="mini" round @click="deleted(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="width: 700px;text-align: right; margin-top:20px;">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage"
            :page-sizes="[10, 20, 30, 50]" :page-size="size" layout="total,sizes, prev, pager, next" :total="totalNum">
          </el-pagination>
        </div>
    </div>

  </div>
</template>

<script>
  import {
    initData
  } from '@/api/data'
  import {
    postData
  } from '@/api/data'
  import {
    deleteData
  } from '@/api/data'
  import {
    putData
  } from '@/api/data'



  export default {
    name: "AllArticle",
    data() {
      return {
        loading: true,
        catalogName: "", //名称
        catalogText: "", //文本
        cata:[{
          name:"文章分类",
          id:1
        },
        {
          name:"问答分类",
          id:2
        }],
        cataId:1,
        inputIndex: null,
        inputName: "", //修改目录
        cataList: [], //目录列表
        currentPage: 0,
        size: 20,
        totalNum: 0
      }
    },
    methods: {
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
        return 'font-size:12px;text-align:center;padding:5px 0;background:#f7f7f7;'
      },
      //查询文章分类目录列表
      onSearch(obj) {
        this.loading = true
        var obj = {
          name: this.catalogName,
          page: this.currentPage - 1,
          size: this.size,
          sort: ""
        }
        this.getList(obj)
      },
      // 文章分类目录列表
      getList(obj) {
        initData("/api/category", obj).then(res => {
          this.cataList = res.content
          this.totalNum = res.totalElements
          this.loading = false
        })
      },
      //新增文章目录
      addCatalog() {
       if(this.catalogText == ""){
          this.toast("请输入文本名称")

       }else{
         this.loading = true
         var obj = {
           "name": this.catalogText,
           "status": false,
           "sign": this.cataId
         }
         var obj2 = {
           page: this.currentPage - 1,
           size: this.size,
           sort: ""
         }
         postData("/api/category", obj).then(res => {
           this.getList(obj2)
           this.toast("新建成功")
         })
       }

      },
      //删除分类
      deleted(row) {
        this.loading = true
        var obj = {
          page: this.currentPage - 1,
          size: this.size,
          sort: ""
        }
        deleteData("/api/category/" + row.id).then(res => {
            this.getList(obj)
            this.toast("删除成功")
        })
      },
      //启用禁用
      status(row) {
        var statu = null;
        this.inputName = row.name
        if (!row.status) {
          statu = true
        } else {
          statu = false
        }
        this.changeApi(row, statu)
      },

      //修改分类
      changeApi(row, statu) {
        var obj = {
          id: row.id,
          name: this.inputName,
          status: statu
        }
        var obj2 = {
          page: this.currentPage - 1,
          size: this.size,
          sort: ""
        }
        putData("/api/category", obj).then(res => {
          this.getList(obj2)
          this.toast("修改成功")
        })
      },
      //修改名称窗口
      change(row) {
        this.$prompt('请输入名称', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue:row.name
        }).then(({
          value
        }) => {
          this.inputName = value
          this.changeApi(row)


        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      //提示框
      toast(msg){
        this.$message({
          type: 'success',
          offset: '200',
          duration: 1000,
          message: msg
        });
      },

      //分页
      handleSizeChange(val) {

        this.loading = true
        this.size = val
        var obj = {
          page: this.currentPage - 1,
          size: this.size,
          sort: ""
        }
        this.getList(obj)

      },
      handleCurrentChange(val) {

        this.loading = true
        this.currentPage = val
        var obj = {
          page: this.currentPage - 1,
          size: this.size,
          sort: ""
        }
        this.getList(obj)
      },

    },
    created() {
      var obj = {
        page: this.currentPage,
        size: this.size,
        sort: ""
      }
      this.onSearch(obj); //初始化分类列表
    }

  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .catalogArticle {

    .el-form {
      border-bottom: 1px solid #ccc;
      margin-bottom: 20px;
      .el-form-item {
        display: inline-block;
        margin-left: 0;

        .el-button {
          margin-left: 40px;
        }
      }
    }

  }
</style>
