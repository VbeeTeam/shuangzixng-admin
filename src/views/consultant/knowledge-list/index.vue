<template>
    <div class="app-container consultant">
        <el-row>
            <el-form>
                <el-form-item label="标题" label-width="60px" style="margin-left:0px">
                    <el-input v-model="search.title"></el-input>
                </el-form-item>
                <el-form-item label="类型" label-width="60px" style="margin-left:0px">
                    <el-select v-model="search.plate">
                        <el-option v-for="(item, i) in search.plateList" :key="i" :label="item.label" :value="item.id"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分类" label-width="60px">
                    <el-select v-model="search.cata">
                        <el-option v-for="(item, i) in search.cataList" :key="i" :label="item.text" :value="item.id"> </el-option>
                    </el-select>
                </el-form-item>
                <br />
                <el-form-item style="margin-left: 20px;">
                    <el-button type="primary" icon="el-icon-edit-outline" @click="dialogFormVisible = true">新建</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
                </el-form-item>

            </el-form>

            <el-dialog :visible.sync="dialogFormVisible" :modal-append-to-body="false" top="30vh">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
                    <el-form-item label="标题" :label-width="formLabelWidth" prop="name">
                        <el-input v-model="ruleForm.name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="分类" :label-width="formLabelWidth" prop="region">
                        <el-select v-model="ruleForm.region" placeholder="请选择分类">
                            <el-option v-for="item in search.cataList" :key="item.id" :label="item.text" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <br />
                    <el-form-item label="所属" :label-width="formLabelWidth">
                        <el-radio v-model="ruleForm.radio" label="0">公用</el-radio>
                        <el-radio v-model="ruleForm.radio" label="1">个人</el-radio>
                    </el-form-item>
                    <el-form-item label="类型" :label-width="formLabelWidth" prop="region2" style="margin-left:60px">
                        <el-select v-model="ruleForm.region2" placeholder="请选择类型" @change="typeChange">
                            <el-option v-for="item in search.plateList" :key="item.id" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <br />

                    <el-form-item v-if="ruleForm.region2 == 4" label="图片" :label-width="formLabelWidth">
                        <el-upload ref="upload" :action="actionUrl" :headers="headerToken" list-type="picture-card" :limit="1" :on-success="handleSuccess">
                            <i v-if="ruleForm.problem == ''" class="el-icon-plus"></i>
                            <img style="width:146px;height:146px;" v-else :src="ruleForm.problem" alt="" />
                        </el-upload>
                    </el-form-item>
                    <el-form-item v-else-if="ruleForm.region2 == 5" label="音频" :label-width="formLabelWidth" prop="problem">
                        <el-upload ref="upload" :action="actionUrl" :headers="headerToken" list-type="text" :limit="1" :on-success="handleSuccess" :on-remove="removeFile">
                            <i class="el-icon-plus"></i>
                            <audio v-if="ruleForm.problem" style="display: block;" :src="ruleForm.problem" controls="controls"></audio>
                        </el-upload>
                    </el-form-item>
                    <el-form-item v-else label="内容" :label-width="formLabelWidth" prop="problem">
                        <el-input type="textarea" v-model="ruleForm.problem" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button @click="cancel('ruleForm')" round>取 消</el-button>
                        <el-button type="primary" @click="submitForm('ruleForm')" round>确 定</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </el-row>

        <el-table class="tableStyle" border :data="conList" :header-cell-style="tableHeaderColor" :cell-style="tableCellStyle" style="width: 100%" v-loading="loading">
            <el-table-column type="index" label="序号" width="100"> </el-table-column>
            <el-table-column prop="title" label="标题" width="200"> </el-table-column>
            <el-table-column prop="generalType.text" label="分类" width="200"> </el-table-column>
            <el-table-column prop="type" label="类型" width="100">
                <template slot-scope="scope">
                    <span v-if="scope.row.type == 3">常用语</span>
                    <span v-else-if="scope.row.type == 4">图片</span>
                    <span v-else>音频</span>
                </template>
            </el-table-column>
            <el-table-column prop="content" label="内容">
                <template slot-scope="scope">
                    <span v-if="scope.row.type == 3">{{ scope.row.content }}</span>
                    <img v-else-if="scope.row.type == 4" style="width:100px;height: 100px" :src="scope.row.content" alt="" />
                    <audio v-else :src="scope.row.content" controls="controls"></audio>
                </template>
            </el-table-column>
            <el-table-column prop="belong" label="所属" width="100">
                <template slot-scope="scope">
                    <span v-if="scope.row.belong == 0">公用</span>
                    <span v-else-if="scope.row.belong == 1">{{ scope.row.creater }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button type="text" class="btn-info" size="mini" round @click="change(scope.row, scope.$index)">修改</el-button>

                    <el-button type="text" class="btn-danger" size="mini" round @click="deleteConsultant(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="block" style="text-align: right; margin-top:20px;">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="size" layout="total,sizes, prev, pager, next" :total="totalNum"> </el-pagination>
        </div>
    </div>
</template>

<script>
import { initData } from '@/api/data'
import { postData } from '@/api/data'
import { deleteData } from '@/api/data'
import { putData } from '@/api/data'
import { getToken } from '@/utils/auth'

export default {
    name: '',
    dicts: ['knowledge_type'],
    data() {
        return {
            // 搜索
            search: {
                plateList: [],
                cataList: [],
                title: '',
                cata: '',
                plate: ''
            },
            conList: [],
            loading: true,
            totalNum: 0,
            currentPage: 0,
            size: 10,
            dialogFormVisible: false,
            actionUrl: '',
            headerToken: {
                Authorization: ''
            },

            ruleForm: {
                name: '',
                region: '',
                region2: '',
                problem: '',
                radio: '0'
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: '请输入标题',
                        trigger: 'blur'
                    },
                    {
                        min: 2,
                        max: 20,
                        message: '长度在 2 到 20 个字符',
                        trigger: 'blur'
                    }
                ],
                region: [
                    {
                        required: true,
                        message: '请选择分类',
                        trigger: 'change'
                    }
                ],
                region2: [
                    {
                        required: true,
                        message: '请选择类型',
                        trigger: 'change'
                    }
                ],
                problem: [
                    {
                        required: true,
                        message: '请输入相关类型内容',
                        trigger: 'blur'
                    }
                ]
            },
            formLabelWidth: '100px',
            changeId: ''
        }
    },
    methods: {
        token() {
            this.actionUrl = process.env.BASE_API + '/api/oss/resources?configId=3'
            this.headerToken.Authorization = ' ' + getToken()
        },

        //设置表格单元格的样式
        tableCellStyle({ row, columnrowIndex, columnIndex }) {
            return 'font-size:12px;text-align:center;padding:7px 0;'
        },
        //设置表头行的样式
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            return 'font-size:12px;text-align:center;padding:5px 0;background:#f7f7f7;'
        },
        //获取知识库列表
        getList(obj) {
            initData('/api/knowledgeBase', obj).then(res => {
                this.conList = res.content
                this.totalNum = res.totalElements
                this.loading = false
            })
        },
        //获取分类列表
        cataList(obj) {
            initData('/api/generalType', obj).then(res => {
                this.search.cataList = res.content
            })
        },
        //新建板块接口
        addConsultant(obj) {
            var obj2 = {
                page: 0,
                size: this.size,
                sort: 'updateTime,desc'
            }
            postData('/api/knowledgeBase', obj).then(res => {
                this.getList(obj2)
                this.toast('新建成功')
                this.dialogFormVisible = false
            })
        },
        //删除板块接口
        deleteConsultant(row) {
            var obj = {
                title: this.search.title,
                type: this.search.plate,
                generalTypeId: this.search.cata,
                page: this.currentPage - 1,
                size: this.size,
                sort: 'updateTime,desc'
            }
            deleteData('/api/knowledgeBase/' + row.id).then(res => {
                this.getList(obj)
                this.toast('删除成功')
            })
        },
        //修改板块接口
        changeConsultant(obj) {
            var obj2 = {
                title: this.search.title,
                type: this.search.plate,
                generalTypeId: this.search.cata,
                page: 0,
                size: this.size,
                sort: 'updateTime,desc'
            }
            putData('/api/knowledgeBase', obj).then(res => {
                this.getList(obj2)
                this.toast('修改成功')
                this.dialogFormVisible = false
            })
        },

        // 搜索
        onSearch() {
            var obj = {
                title: this.search.title,
                type: this.search.plate,
                generalTypeId: this.search.cata,
                page: this.currentPage - 1,
                size: this.size,
                sort: 'updateTime,desc'
            }
            this.getList(obj)
        },
        //取消
        cancel(formName) {
            // this.$refs[formName].resetFields();
            this.dialogFormVisible = false
        },

        //新增修改问答
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.loading = true

                    if (this.changeId) {
                        var obj = {
                            id: this.changeId,
                            belong: this.ruleForm.radio,
                            title: this.$refs[formName].model.name,
                            generalType: {
                                id: this.$refs[formName].model.region
                            },
                            type: this.$refs[formName].model.region2,
                            content: this.$refs[formName].model.problem
                        }
                        this.changeConsultant(obj) //修改
                        this.$refs[formName].resetFields() //重置
                        this.changeId = ''
                    } else {
                        var obj = {
                            belong: this.ruleForm.radio,
                            title: this.$refs[formName].model.name,
                            generalType: {
                                id: this.$refs[formName].model.region
                            },
                            type: this.$refs[formName].model.region2,
                            content: this.$refs[formName].model.problem
                        }
                        this.addConsultant(obj) //新增
                        this.$refs[formName].resetFields() //重置
                    }
                    this.dialogFormVisible = false
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },

        //修改
        change(row) {
            this.dialogFormVisible = true
            this.changeId = row.id
            this.ruleForm.name = row.title
            this.ruleForm.region = Number(row.generalType.id)
            this.ruleForm.problem = row.content
            this.ruleForm.region2 = Number(row.type)
            this.ruleForm.radio = row.belong.toString()
        },

        //提示框
        toast(msg) {
            this.$message({
                type: 'success',
                offset: '200',
                duration: 1000,
                message: msg
            })
        },
        //分页
        handleSizeChange(val) {
            this.loading = true
            this.size = val
            var obj = {
                title: this.search.title,
                type: this.search.plate,
                generalTypeId: this.search.cata,
                page: this.currentPage - 1,
                size: this.size,
                sort: 'updateTime,desc'
            }
            this.getList(obj)
        },
        handleCurrentChange(val) {
            this.loading = true
            this.currentPage = val
            var obj = {
                title: this.search.title,
                type: this.search.plate,
                generalTypeId: this.search.cata,
                page: this.currentPage - 1,
                size: this.size,
                sort: 'updateTime,desc'
            }
            this.getList(obj)
        },
        typeChange() {
            if (this.ruleForm.problem) {
                this.ruleForm.problem = ''
                this.$refs.upload.clearFiles()
            }
        },
        //上传图片
        handleSuccess(response, file, fileList) {
            this.dialogImageUrl = response.data[0]
            this.ruleForm.problem = response.data[0]
        },
        removeFile() {
            this.dialogImageUrl = ''
            this.ruleForm.problem = ''
        }
    },
    created() {
        this.token() //获取token
        // 得到完整数据类型字典

        this.search.plateList = this.dict.knowledge_type

        var obj = {
            page: this.currentPage,
            size: this.size,
            sort: 'updateTime,desc'
        }
        this.getList(obj) //初始化知识库列表
        this.cataList({
            sign: 3
        })
    }
}
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
.consultant {

    .el-row {
        .el-form {
            border-bottom: 1px solid #ccc;
            margin-bottom: 20px;
            .el-form-item {
                display: inline-block;

            }
        }

        /deep/ .el-dialog {
            width: 700px;

            .el-dialog__body {
                padding: 20px 20px 0;
            }

            .el-form {
                border: 0;

                .el-form-item {
                    margin-left: 0;

                    &:last-of-type {
                        display: -webkit-flex;
                        justify-content: center;
                        padding-bottom: 20px;
                    }

                    .el-input {
                        width: 200px;
                    }

                    .el-textarea {
                        width: 500px;

                        textarea {
                            height: 100px;
                        }
                    }
                }
            }
        }
    }
}
</style>
