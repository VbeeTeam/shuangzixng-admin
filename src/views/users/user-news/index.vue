<template>
    <div class="app-container news">
        <el-row>
            <el-form>
                <el-form-item label="标题" label-width="60px">
                    <el-input v-model="search.title" clearable></el-input>
                </el-form-item>
                <el-form-item label="类型" label-width="60px">
                    <el-select v-model="search.type" clearable>
                        <el-option v-for="(item,index1) in search.typeList" :key="index1" :label="item.name" :value="item.ids">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="时间" label-width="80px">
                    <div class="block">
                        <el-date-picker v-model="search.date" type="datetimerange" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item style="margin-left: 20px;">
                    <el-button size="small" type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
                </el-form-item>

            </el-form>
        </el-row>
        <el-row>
            <el-button type="primary" icon="el-icon-edit-outline" @click="dialogSend(0)">新建系统消息</el-button>
            <el-button type="primary" icon="el-icon-edit-outline" @click="dialogSend(1)">新建个人消息</el-button>

            <el-dialog :visible.sync="dialogFormVisible" :modal-append-to-body='false' top="30vh" width="500px">
                <el-form :model="forms" :rules="rules" ref="ruleForm">
                    <h3 v-if="forms.type == 0">发送系统消息</h3>
                    <h3 v-else>发送个人消息</h3>
                    <el-form-item label="标题" label-width="100px" prop="title">
                        <el-input v-model="forms.title" placeholder="请输入标题" />
                    </el-form-item>
                    <el-form-item label="链接" label-width="100px" prop="url">
                        <el-input v-model="forms.url" placeholder="请输入链接" />
                    </el-form-item>
                    <el-form-item v-if="forms.type == 1" label="ID" label-width="100px" prop="userId">
                        <el-input v-model="forms.userId" placeholder="请输入用户ID" />
                    </el-form-item>
                    <el-form-item label="内容" label-width="100px" prop="content">
                        <el-input v-model="forms.content" type="textarea" placeholder="请输入内容" :autosize="{ minRows: 5, maxRows: 6}" />
                    </el-form-item>
                    <el-form-item style="display: block;text-align: center;">
                        <el-button type="success" @click="toCtrl('ruleForm')" :loading="btnLoading">保存</el-button>
                        <el-button type="info" @click="cancel('ruleForm')">取消</el-button>
                    </el-form-item>

                </el-form>
            </el-dialog>

        </el-row>
        <div class="tables">
            <el-table class="tableStyle" border :data="messageList" :header-cell-style="tableHeaderColor" :cell-style="tableCellStyle"
                style="width: 100%" v-loading="loading">
                <el-table-column type="index" label="序号" width="80">
                </el-table-column>
                <el-table-column prop="title" label="标题" width="200">
                </el-table-column>
                <el-table-column prop="" label="类型" width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.type">个人</span>
                        <span v-else>系统</span>
                    </template>
                </el-table-column>
                <el-table-column prop="userId" label="用户" width="150">
                </el-table-column>
                <el-table-column prop="content" label="内容">
                </el-table-column>
                </el-table-column>
                <el-table-column prop="url" label="URL" width="200">
                </el-table-column>
                <el-table-column prop="publishTime" label="发送时间" width="150">
                    <template slot-scope="scope">{{ parseTime(scope.row.publishTime) }}</template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status">已发送</span>
                        <span v-else>未发送</span>
                    </template>
                </el-table-column>
                <el-table-column label="发送成功统计" width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.successNum}} / {{scope.row.totalNum}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button type="text" class="btn-info" size="mini" round @click="change(scope.row)">修改</el-button>
                        <el-button v-if="scope.row.status == 0" type="text" class="btn-success" size="mini" round @click="send(scope.row)" :loading="btnLoading">发送</el-button>
                        <el-button v-if="scope.row.status == 2" type="text" class="btn-danger" size="mini" round @click="back(scope.row)">撤回</el-button>

                    </template>
                </el-table-column>
            </el-table>
            <div class="block" style="text-align: right; margin-top:20px;">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="page"
                    :page-sizes="[10, 20, 30, 50]" :page-size="search.size" layout="total,sizes, prev, pager, next" :total="totalElements">
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
        putData
    } from '@/api/data'
    import {
        parseTime
    } from '@/utils/index'

    export default {
        name: "news",
        data() {
            return {
                dialogFormVisible: false,
                loading: true,
                btnLoading:false,
                search: {
                    title: "",
                    typeList: [{
                            name: "系统",
                            ids: 0,
                        },
                        {
                            name: "个人",
                            ids: 1
                        }
                    ],
                    type: "",
                    date: "",
                    createTimeStart: "",
                    createTimeEnd: "",
                    sort: "updateTime,desc",
                    size: 10,
                    page: 0
                },
                page: 0,
                forms: {
                    title: "",
                    url: "",
                    content: "",
                    userId: "",
                    type: 0
                },
                rules: {
                    title: [{
                            required: true,
                            message: '请输入标题',
                            trigger: 'blur'
                        },
                        {
                            min: 2,
                            max: 30,
                            message: '长度在 2 到 30 个字符',
                            trigger: 'blur'
                        }
                    ],
                    url: [{
                        required: true,
                        message: '请输入链接',
                        trigger: 'blur'
                    }],
                    content: [{
                        required: true,
                        message: '请输入内容',
                        trigger: 'blur'
                    }, ],
                    userId: [{
                        required: true,
                        message: '请输入用户ID',
                        trigger: 'blur'
                    }, ]
                },
                messageList: [],
                totalElements: null,
                isNo: false,
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
                return 'font-size:12px;text-align:center;padding:5px 0;background:#f7f7f7;'
            },
            //获取消息列表
            getList() {
                initData("/api/message", this.search).then(res => {

                    this.messageList = res.content
                    this.totalElements = res.totalElements
                    this.loading = false
                })
            },
            //新增消息
            addMessage() {
                postData("/api/message", this.forms).then(res => {
                    this.btnLoading = false
                    this.toast('新增成功')
                    this.getList()
                    this.dialogFormVisible = false
                    this.$refs['ruleForm'].resetFields();
                })
            },
            //修改消息
            changeMessage() {
                putData("/api/message", this.forms).then(res => {

                    this.toast('修改成功')
                    this.getList()
                    this.dialogFormVisible = false
                    this.$refs['ruleForm'].resetFields();
                })
            },
            //发送消息
            sendMessage(obj) {
                postData("/api/message/send", obj).then(res => {
                    this.btnLoading = false
                    this.toast('发送成功')
                    this.getList()
                })
            },
            //提示框
            toast(msg) {
                this.$message({
                    type: 'success',
                    offset: '200',
                    duration: 1000,
                    message: msg
                });
            },
            //查询
            onSearch() {
                this.search.createTimeStart = this.search.date != null ? this.search.date[0] : null
                this.search.createTimeEnd = this.search.date != null ? this.search.date[1] : null
                this.getList()
            },
            //发送弹窗
            dialogSend(a) {
                this.forms = {
                    title: "",
                    url: "",
                    content: "",
                    userId: "",
                    type: a
                }
                this.dialogFormVisible = true
                this.isNo = false

            },
        //保存
        toCtrl(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.isNo) {
                        this.changeMessage()
                    } else {
                        this.btnLoading = true
                        this.addMessage()
                    }

                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //取消
        cancel(formName) {
            this.dialogFormVisible = false
            this.$refs[formName].resetFields();
        },
        //修改
        change(row) {
            this.dialogFormVisible = true
            this.forms = row
            this.isNo = true
        },
        //发送
        send(row) {
            this.btnLoading = true
            var obj = {
                id: row.id,
                type: row.type,
                userId: row.userId
            }
            this.sendMessage(obj)
        },
        //撤回
        back(row) {
            initData('/api/message/recall/' + row.id).then(res => {
                this.toast('撤回成功')
                this.getList()
            })
        },
        //条数
        handleSizeChange(val) {
            this.loading = true
            this.search.size = val
            this.search.page = this.page - 1
            this.getList()
        },
        //分页
        handleCurrentChange(val) {
            this.loading = true
            this.page = val
            this.search.page = val - 1
            this.getList()
        }
    },
    created() {
        this.getList()
    }

    }
</script>

<style lang="scss" scoped>
    .news {

        .el-row {

            &:nth-of-type(2){
                padding: 0 40px 20px;
                border-bottom: 1px solid #ccc;
            }
            .el-form {
                .el-form-item {
                    display: inline-block;
                }
            }
        }

        .el-dialog {
            .el-form {
                .el-form-item {
                    display: inline-block;

                    .el-textarea {
                        width: 300px;
                    }

                }
            }
        }

        .tables{
           
            padding: 20px;
        }
    }
</style>
