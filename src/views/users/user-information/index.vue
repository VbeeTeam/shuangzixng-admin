<template>
    <div class="app-container user-information">
        <el-row>
            <el-form>
                <el-form-item label="昵称" label-width="60px" style="margin-left:0px">
                    <el-input v-model="search.name"></el-input>
                </el-form-item>
                <el-form-item label="性别" label-width="60px" style="margin-left:0px">
                    <el-select v-model="search.sex">
                        <el-option v-for="(item,i) in search.sexList" :key="i" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="年收入" label-width="60px">
                    <el-select v-model="search.yearIncome">
                        <el-option v-for="(item,i) in search.yearIncomeList" :key="i" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="电话" label-width="60px" style="margin-left:0px">
                    <el-input v-model="search.phone"></el-input>
                </el-form-item>
                <br />
                <el-form-item style="margin-left: 60px;">
                    <router-link to="/users/user-add">
                        <el-button size="small" type="primary" icon="el-icon-edit-outline">新建</el-button>
                    </router-link>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
                </el-form-item>
            </el-form>

            <el-dialog :visible.sync="dialogFormVisible" :modal-append-to-body='false' top="30vh">
                <el-form>

                    <p>客户信息</p>
                    <div class="from-content">
                        <div class="from-left">
                            <p>基本信息</p>
                            <el-form-item label="昵称" :label-width="formLabelWidth">
                                <span>{{fromList.nickName}}</span>
                            </el-form-item>
                            <el-form-item label="性别" :label-width="formLabelWidth">
                                <span v-if="fromList.sex">男</span>
                                <span v-else>女</span>
                            </el-form-item>
                            <el-form-item label="年龄" :label-width="formLabelWidth">
                                <span>{{fromList.age}}</span>
                            </el-form-item>
                            <el-form-item label="生日" :label-width="formLabelWidth">
                                <span>{{fromList.birthDate}}</span>
                            </el-form-item>
                            <el-form-item label="地区" :label-width="formLabelWidth">
                                <span>{{fromList.location}}</span>
                            </el-form-item>
                            <el-form-item label="家庭成员" :label-width="formLabelWidth">
                                <span v-for="item in fromList.familyMembers" :key="item">{{item}}&nbsp;&nbsp;</span>
                            </el-form-item>
                            <el-form-item label="被保险人" :label-width="formLabelWidth">
                                <span v-for="item in fromList.insuredPerson" :key="item">{{item}}&nbsp;&nbsp;</span>
                            </el-form-item>
                            <el-form-item label="家庭收入" :label-width="formLabelWidth">
                                <span>{{fromList.yearIncome}}</span>
                            </el-form-item>
                            <el-form-item label="家庭贷款" :label-width="formLabelWidth">
                                <span>{{fromList.totalLending}}</span>
                            </el-form-item>
                        </div>
                        <div class="from-right">
                            <el-table class="tableStyle" :data="fromList.familyMemberList" :header-cell-style="tableHeaderColor"
                                :cell-style="tableCellStyle" style="width: 100%" v-loading="loading">

                                <el-table-column prop="relation" label="被保险人" width="100">
                                </el-table-column>
                                <el-table-column prop="age" label="年龄" width="50">
                                </el-table-column>
                                <el-table-column prop="birthDate" label="生日" width="100">
                                </el-table-column>
                                </el-table-column>
                                <el-table-column prop="medicalHistory" label="病史" width="100">
                                </el-table-column>
                                <el-table-column prop="occupation" label="职业" width="100">
                                </el-table-column>
                                <el-table-column prop="isSocialSecurity" label="有无社保" width="100">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.isSocialSecurity">有</span>
                                        <span v-else>无</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="isWorkOut" label="经常出差" width="100">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.isWorkOut">是</span>
                                        <span v-else>否</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="isWorkOvertime" label="经常加班" width="100">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.isWorkOvertime">是</span>
                                        <span v-else>否</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="isDrive" label="经常驾车" width="100">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.isDrive">是</span>
                                        <span v-else>否</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="isInsure" label="已配置保险" width="100">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.isInsure">是</span>
                                        <span v-else>否</span>
                                    </template>
                                </el-table-column>

                            </el-table>
                        </div>
                    </div>

                </el-form>
            </el-dialog>

        </el-row>
        <div class="tables">
            <el-table class="tableStyle" border :data="userList" :header-cell-style="tableHeaderColor" :cell-style="tableCellStyle"
                style="width: 1000px" v-loading="loading">
                <el-table-column type="index" label="序号" width="78">
                </el-table-column>
                <el-table-column prop="nickName" label="昵称" width="120">
                </el-table-column>
                <el-table-column prop="name" label="姓名" width="100">
                    <template slot-scope="scope">
                        <span @click="dialog(scope.$index)">{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="sex" label="性别" width="80">
                    <template slot-scope="scope">
                        <span v-if="scope.row.sex">男</span>
                        <span v-else>女</span>
                    </template>
                </el-table-column>
                </el-table-column>
                <el-table-column prop="phone" label="电话" width="100">
                </el-table-column>
                <el-table-column prop="location" label="投保意向" width="120">
                </el-table-column>
                <el-table-column prop="yearIncome" label="家庭年收入" width="100">
                </el-table-column>
                <el-table-column prop="totalLending" label="家庭贷款" width="100">
                </el-table-column>
                <el-table-column label="操作" width="200px">
                    <template slot-scope="scope">
                        <el-button type="text" class="btn-info" size="mini" round @click="changeUser(scope.row)">修改</el-button>

                        <el-button type="text" class="btn-danger" size="mini" round @click="deleteConsultant(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block" style="width: 1000px;text-align: right; margin-top:20px;">
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

    import { getAge } from '@/utils/age'

    export default {
        name: "",
        data() {
            return {
                // 搜索
                search: {
                    sexList: [{
                            id: 1,
                            name: "男"
                        },
                        {
                            id: 0,
                            name: "女"
                        }
                    ],
                    yearIncomeList: ['无', '5万以下', '5~10万', '10~20万', '20~30万', '30~50万', '50~100万', '100万以上'],
                    yearIncome: "",
                    name: "",
                    sex: "",
                    phone: ""
                },
                userList: [],
                userIndex: 0,
                fromList: [],
                loading: true,
                totalNum: 0,
                currentPage: 0,
                size: 10,
                dialogFormVisible: false,
                ruleForm: {
                    name: '',
                    region: '',
                    region2: '',
                    problem: "",
                    radio: "1"
                },
                rules: {
                    name: [{
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
                    region: [{
                        required: true,
                        message: '请选择分类',
                        trigger: 'change'
                    }],
                    region2: [{
                        required: true,
                        message: '请选择类型',
                        trigger: 'change'
                    }],
                    problem: [{
                        required: true,
                        message: '请输入相关类型内容',
                        trigger: 'blur'
                    }]
                },
                formLabelWidth: '100px',
                changeId: "",
                dialogImageUrl: "",
                actionUrl: "",
                tableData: [{
                        date: "2016-05-02",
                        isOK: true,
                        name: "张三",
                        address: "上海市普陀区金沙江路 1518 弄"
                    },
                    {
                        date: "2016-05-02",
                        isOK: false,
                        name: "李四",
                        address: "上海市普陀区金沙江路 1518 弄"
                    }
                ]
            }
        },
        methods: {

            dialog(index) {

                this.fromList = this.userList[index]

                setTimeout(() => {
                    this.dialogFormVisible = true
                })

            },

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
            //获取客户列表
            getList(obj) {
                initData("/api/customer", obj).then(res => {

                    this.userList = res.content
                    this.userList.forEach((item1)=>{
                        item1.age = getAge(item1.birthDate)
                        item1.familyMemberList.forEach((item2)=>{
                            item2.age = getAge(item2.birthDate)
                        })
                    })
                    this.totalNum = res.totalElements
                    this.loading = false
                })
            },
            //新建板块接口
            addConsultant(obj) {

                postData("", obj).then(res => {
                    this.getList()
                    this.toast("新建成功")
                })
            },
            //删除板块接口
            deleteConsultant(row) {

                var obj = {
                    nickName: this.search.name,
                    sex: this.search.sex,
                    yearIncome: this.search.yearIncome,
                    phone: this.search.phone,
                    page: this.currentPage - 1,
                    size: this.size,
                    sort: "updateTime,desc"
                }
                deleteData("/api/customer/" + row.id).then(res => {
                    this.getList(obj)
                    this.toast("删除成功")
                })
            },

            // 搜索
            onSearch() {
                var obj = {
                    nickName: this.search.name,
                    sex: this.search.sex,
                    yearIncome: this.search.yearIncome,
                    phone: this.search.phone,
                    page: this.currentPage - 1,
                    size: this.size,
                    sort: "updateTime,desc"
                }

                this.getList(obj);
            },


            //修改
            changeUser(row) {
                this.$router.push({
                    path: '/users/user-add',
                    query: {
                        id: row.id
                    }
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
            //分页
            handleSizeChange(val) {

                this.loading = true
                this.size = val
                var obj = {
                    nickName: this.search.name,
                    sex: this.search.sex,
                    yearIncome: this.search.yearIncome,
                    phone: this.search.phone,
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
                    nickName: this.search.name,
                    sex: this.search.sex,
                    yearIncome: this.search.yearIncome,
                    phone: this.search.phone,
                    page: this.currentPage - 1,
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
            this.getList(obj); //初始化知识库列表

        }

    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .user-information {

        .el-row {
            .el-form {
                border-bottom: 1px solid #ccc;
                margin-bottom: 20px;
                .el-form-item {
                    display: inline-block;
                }
            }

            /deep/.el-dialog {
                width: 70%;

                .el-dialog__body {
                    padding: 0px 20px 20px;
                }

                .el-form {
                    border: 0;

                    .from-content {
                        display: -webkit-flex;

                        .from-left {
                            width: 300px;
                            margin-bottom: 20px;
                            background-color: #f7f7f7;
                            margin-right: 20px;

                            p {
                                text-align: center;
                                color: #FF4949;
                            }

                            .el-form-item {
                                display: block;
                                margin: 0;

                                .el-form-item__label {
                                    font-size: 12px;
                                }
                                .el-form-item__content{
                                    padding-right: 15px;
                                }
                            }
                        }

                        .from-right {
                            width: 950px;
                        }

                    }


                }

            }
        }

        /deep/.tableStyle {
            .el-table__row {
                td:nth-of-type(3) {

                    cursor: pointer;

                    span {
                        border-bottom: 1px solid blue !important;
                        color: blue;
                    }
                }
            }
        }

        .tables{
            
            padding: 0 20px 20px;
        }
    }
</style>
