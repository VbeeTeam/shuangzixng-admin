<template>
  <div class="app-container labelArticle">
    <el-row>
      <el-form>
        <el-form-item label="问题" label-width="60px" style="margin-left:0px">
          <el-input v-model="plateName"></el-input>
        </el-form-item>
        <el-form-item label="分类" label-width="80px">
          <el-select v-model="tabs">
            <el-option v-for="item in tabsList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
        </el-form-item>
        <br />
        <el-form-item>
          <el-button size="small" type="primary" icon="el-icon-edit-outline" @click="add()">新建</el-button>
        </el-form-item>
      </el-form>
      <el-dialog :visible.sync="dialogFormVisible" :modal-append-to-body='false' top="30vh">
        <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef">
          <el-form-item label="问题" :label-width="formLabelWidth" prop="name">
            <el-input v-model="ruleForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="分类" :label-width="formLabelWidth" prop="region">
            <el-select v-model="ruleForm.region" placeholder="请选择问题分类">
              <el-option v-for="item in tabsList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序" :label-width="formLabelWidth" prop="desc">
            <el-input v-model="ruleForm.desc" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="回答" :label-width="formLabelWidth" prop="problem">
            <el-input type="textarea" :rows="4" v-model="ruleForm.problem" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="cancel('ruleFormRef')" round>取 消</el-button>
            <el-button type="primary" @click="submitForm('ruleFormRef')" round>确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-row>
    <div class="tables">
        <el-table class="tableStyle" border :data="plateList" :header-cell-style="tableHeaderColor" :cell-style="tableCellStyle"
          style="width: 900px" v-loading="loading">
          <el-table-column type="index" label="序号" width="108">
          </el-table-column>
          <el-table-column prop="questions" label="问题" width="300">
          </el-table-column>
          <el-table-column prop="category.name" label="分类" width="120">
          </el-table-column>
          <el-table-column prop="topPriority" label="排序序号" width="120">
          </el-table-column>
          <el-table-column label="操作" width="250px">
            <template slot-scope="scope">
              <el-button type="text" class="btn-info" size="mini" round @click="change(scope.row,scope.$index)">修改</el-button>

              <el-button type="text" :class="scope.row.status ? 'btn-warning' : 'btn-success'" size="mini" round @click="statused(scope.row)">{{!scope.row.status ? '启用' : '禁用'}}</el-button>
              <!-- <el-button v-else-if="scope.row.status" type="text" class="btn-warning" size="mini" round @click="statused(scope.row)">禁用</el-button> -->

              <el-button type="text" class="btn-danger" size="mini" round @click="deletePlate(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="width: 900px;text-align: right; margin-top:20px;">
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
    name: 'ProlemArticle',
    components: {

    },

    data() {
      return {
        //关键词
        plateName: "",
        loading: true,
        dialogFormVisible: false,
        ruleForm: {
          name: '',
          region: '',
          desc: '',
          problem:''
        },
        rules: {
          name: [{
              required: true,
              message: '请输入问题',
              trigger: 'blur'
            },
            {
              min: 2,
              max: 100,
              message: '长度在 2 到 100 个字符',
              trigger: 'blur'
            }
          ],
          region: [{
            required: true,
            message: '请选择页签',
            trigger: 'change'
          }],
          desc: [{
            required: true,
            message: '请输入排序序号',
            trigger: 'blur'
          }],
          problem:[{
            required: true,
            message: '请输入回答',
            trigger: 'blur'
          }]
        },
        formLabelWidth: '100px',
        //页签
        tabsList: [],
        tabs: "",
        //问答
        plateList: [],
        changeBoolean: false,
        changeId: null,
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
      //获取问答列表
      getList(obj) {
        initData("/api/tQa", obj).then(res => {
          this.plateList = res.content
          this.totalNum = res.totalElements
          this.loading = false
        })
      },
      //获取分类列表
      getTabs() {
        initData("/api/category", {sign:2,status:1}).then(res => {
          this.tabsList = res.content
        })
      },
      //新建问答接口
      addPlate(obj) {

        postData("/api/tQa", obj).then(res => {
          this.getList({sort: "updateTime,desc"})
          this.toast("新建成功")
        })
      },
      //删除问答接口
      deletePlate(row) {
        var obj = {
          page: this.currentPage - 1,
          size: this.size,
          sort: "updateTime,desc",
        }
        deleteData("/api/tQa/" + row.id).then(res => {
          this.getList(obj)
          this.toast("删除成功")
        })
      },
      //修改问答接口
      changePlate(obj) {
        var obj2 = {
          page: this.currentPage - 1,
          size: this.size,
          sort: "updateTime,desc",
        }
        putData("/api/tQa", obj).then(res => {
          this.getList(obj2)
          this.changeBoolean = false
          this.toast("修改成功")
        })
      },

      //修改问答
      change(row,index) {

        this.dialogFormVisible = true
        this.changeBoolean = true
        this.changeId = row.id
        this.ruleForm.name = row.questions
        this.ruleForm.region = this.plateList[index].category.id
        this.ruleForm.desc = row.topPriority
        this.ruleForm.problem = row.answers
      },
      //启用禁用
      statused(row) {
        var statu = row.status;
        var obj = {
          id: row.id,
          status: statu == 0 ? 1 : 0
        }
        this.changePlate(obj)
      },
      //查询问答
      onSearch() {
        var obj = {
          questions: this.plateName,
          page: this.currentPage - 1,
          size: this.size,
          sort: "updateTime,desc",
          category_id: this.tabs
        }
        this.getList(obj);
      },
      add(){
          this.ruleForm = {
            name: '',
            region: '',
            desc: '',
            problem:''
          }
          this.dialogFormVisible = true
      },
      //取消
      cancel(formName){

        this.$refs.ruleFormRef.resetFields();//重置
        this.dialogFormVisible = false
      },
      //新增修改问答
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true

            if (this.changeBoolean) {
              var obj = {
                id: this.changeId,
                questions: this.$refs[formName].model.name,
                category: {
                  id:this.$refs[formName].model.region,
                },
                topPriority: this.$refs[formName].model.desc,
                answers: this.$refs[formName].model.problem
              }
              this.changePlate(obj); //修改

              this.$refs[formName].resetFields();//重置
            } else {
              var obj = {
                questions: this.$refs[formName].model.name,
                category: {
                  id:this.$refs[formName].model.region,
                },
                status: false,
                topPriority: this.$refs[formName].model.desc,
                answers: this.$refs[formName].model.problem
              }
              this.addPlate(obj); //新增

              this.$refs[formName].resetFields();//重置
            }
            this.dialogFormVisible = false
          } else {
            console.log('error submit!!');
            return false;
          }
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
          sort: "updateTime,desc"
        }
        this.getList(obj)

      },
      handleCurrentChange(val) {

        this.loading = true
        this.currentPage = val
        var obj = {
          page: this.currentPage -1,
          size: this.size,
          sort: "updateTime,desc"
        }
        this.getList(obj)
      },

    },
    created() {
      var obj = {
        page: this.currentPage,
        size: this.size,
        sort: "updateTime,desc"
      }
      this.getList(obj); //初始化问答列表
      this.getTabs(); //分类列表
    }

  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .labelArticle {

    .el-row {

      .el-form {
        border-bottom: 1px solid #ccc;
        margin-bottom: 20px;
        .el-form-item {
          display: inline-block;
          margin-left: 30px;
        }
      }

      /deep/.el-dialog {
        width: 400px;

        .el-dialog__body {
          padding: 20px 20px 0;
        }

        .el-form {
          border: 0;

          .el-form-item {
            display: block;
            margin-left: 0;

            &:last-of-type {
              display: -webkit-flex;
              justify-content: center;
              padding-bottom: 20px;
            }

            .el-input {
              width: 200px;
            }
            .el-input--small{
                width: 200px;
            }
          }
        }

      }
    }
   
  }
</style>
