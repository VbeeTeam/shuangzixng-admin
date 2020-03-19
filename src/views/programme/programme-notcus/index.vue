<template>
    <div class="app-container notcus">
        <el-form>
            <el-form-item label="昵称" label-width="80px">
                <el-input v-model="search.nickName"></el-input>
            </el-form-item>
            <el-form-item label="姓名" label-width="80px">
                <el-input v-model="search.name"></el-input>
            </el-form-item>
            <el-form-item label="电话" label-width="80px">
                <el-input v-model="search.phone"></el-input>
            </el-form-item>
            <el-form-item label="顾问" label-width="80px">
                <el-input v-model="search.adviser"></el-input>
            </el-form-item>
            <el-form-item label="地区" label-width="80px">
                <div class="block">
                    <el-cascader ref="refSubCat" :options="search.locationList" @change="changeLoation"></el-cascader>
                </div>
            </el-form-item>
            <br />
            <el-form-item label="收入" label-width="80px">
                <el-select v-model="search.yearIncome">
                    <el-option v-for="(item,i) in search.yearIncomeList" :key="i" :label="item" :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="支付状态" label-width="80px">
                <el-select v-model="search.status">
                    <el-option v-for="(item,i) in search.statusList" :key="i" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="定制人" label-width="80px">
                <el-input v-model="search.cusPerson"></el-input>
            </el-form-item>
            <el-form-item label="渠道" label-width="80px">
                <el-select v-model="search.channel">
                    <el-option v-for="(item,i) in search.channelList" :key="i" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="主体" label-width="80px">
                <el-select v-model="search.content">
                    <el-option v-for="(item,i) in search.contentList" :key="i" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <br />
            <el-form-item label="生日时间" label-width="80px">
                <div class="block">
                    <el-date-picker v-model="search.birthDate" type="datetimerange" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                        range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                </div>
            </el-form-item>
            <el-form-item label="创建时间" label-width="110px">
                <div class="block">
                    <el-date-picker v-model="search.createTime" type="datetimerange" format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                </div>
            </el-form-item>

            <el-form-item style="margin-left: 30px;">
                <el-button size="small" type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
            </el-form-item>

        </el-form>

        <el-table class="tableStyle" border ref="multipleTable" :data="notcusList" :header-cell-style="tableHeaderColor"
            :cell-style="tableCellStyle" style="width: 100%" v-loading="loading" @selection-change="selectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" label="序号" width="120">
            </el-table-column>
            <el-table-column prop="planType" label="方案类型" width="120">
            </el-table-column>
            <el-table-column prop="channel" label="渠道" width="120">
            </el-table-column>
            <el-table-column prop="nickName" label="昵称" width="120">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="120">
                <template slot-scope="scope">
                    <span @click="dialogUser(scope.$index)">{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column label="年龄" width="120">
                <template slot-scope="scope">
                    <div v-for="(item,index2) in scope.row.customer.familyMemberList" :key="index2">
                        {{item.relation}}&nbsp;:&nbsp;{{item.age}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="被保人" width="120">
                <template slot-scope="scope">
                    <div v-for="(item,index10) in scope.row.insuredPerson" :key="index10">
                        {{item}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="phone" label="手机号" width="200">
            </el-table-column>
            <el-table-column prop="madePersonName" label="顾问" width="120">
            </el-table-column>
            <el-table-column prop="madePersonName" label="定制人" width="120">
            </el-table-column>
            <el-table-column prop="status" label="支付状态" width="120">
                <template slot-scope="scope">
                    <span v-if="scope.row.status == 0">免费</span>
                    <span v-else-if="scope.row.status == 1">未支付</span>
                    <span v-else-if="scope.row.status == 2">已支付</span>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间">
                <template slot-scope="scope">{{ parseTime(scope.row.createTime) }}</template>
            </el-table-column>

        </el-table>
        <div class="btn">
            <el-button size='small' type="info" @click="toCus(1)">定制方案</el-button>
            <el-button size='small' type="info" @click="toCus(0)">备选方案</el-button>
            <el-button size='small' type="info">申请退款</el-button>
            <el-button size='small' type="info" @click="excel()">导出</el-button>
            <el-button size='small' type="info" @click="deletes()">删除</el-button>
        </div>
        <div class="block" style="margin-top:20px;">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage"
                :page-sizes="[10, 20, 30, 50]" :page-size="size" layout="total,sizes, prev, pager, next" :total="totalNum">
            </el-pagination>
        </div>

        <div class="dialogUser">
            <el-dialog :visible.sync="dialogFormUser" :modal-append-to-body='false' top="30vh">
                <el-form>

                    <p>客户信息</p>
                    <div class="from-content">
                        <div class="from-left">
                            <p>基本信息</p>
                            <el-form-item label="昵称">
                                <span>{{fromList.nickName}}</span>
                            </el-form-item>
                            <el-form-item label="性别">
                                <span v-if="fromList.sex">男</span>
                                <span v-else>女</span>
                            </el-form-item>
                            <el-form-item label="年龄">
                                <span>{{fromList.age}}</span>
                            </el-form-item>
                            <el-form-item label="生日">
                                <span>{{fromList.birthDate}}</span>
                            </el-form-item>
                            <el-form-item label="地区">
                                <span>{{fromList.location}}</span>
                            </el-form-item>
                            <el-form-item label="家庭成员">
                                <span v-for="item in fromList.familyMembers" :key="item">{{item}}&nbsp;&nbsp;</span>
                            </el-form-item>
                            <el-form-item label="被保险人">
                                <span v-for="item in fromList.insuredPerson" :key="item">{{item}}&nbsp;&nbsp;</span>
                            </el-form-item>
                            <el-form-item label="家庭收入">
                                <span>{{fromList.yearIncome}}</span>
                            </el-form-item>
                            <el-form-item label="家庭贷款">
                                <span>{{fromList.totalLending}}</span>
                            </el-form-item>
                        </div>
                        <div class="from-right">
                            <el-table :data="fromList.familyMemberList" :header-cell-style="tableHeaderColor"
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
        </div>

    </div>
</template>

<script>
import { parseTime } from '@/utils/index'
import { provinceAndCityData } from 'element-china-area-data'

import { initData } from '@/api/data'
import { deleteData } from '@/api/data'
import { getAge } from '@/utils/age'
import request from '@/utils/request'

export default {
    name: 'programmeNotcus',
    data() {
        return {
            // 搜索
            search: {
                location: '',
                yearIncome: '',
                status: null,
                birthDate: '',
                createTime: '',
                channel: '',
                content: '',
                locationList: provinceAndCityData,
                yearIncomeList: ['无', '5万以下', '5~10万', '10~20万', '20~30万', '30~50万', '50~100万', '100万以上'],
                statusList: [
                    {
                        value: 0,
                        label: '免费'
                    },
                    {
                        value: 1,
                        label: '未支付'
                    },
                    {
                        value: 2,
                        label: '已支付'
                    }
                ],
                channelList: [
                    {
                        value: 0,
                        label: '百度'
                    },
                    {
                        value: 1,
                        label: '360'
                    },
                    {
                        value: 2,
                        label: 'UC信息流'
                    }
                ],
                contentList: [
                    {
                        value: 0,
                        label: '公众号'
                    },
                    {
                        value: 1,
                        label: '服务号'
                    },
                    {
                        value: 2,
                        label: '小程序'
                    },
                    {
                        value: 3,
                        label: 'Web'
                    },
                    {
                        value: 4,
                        label: '抖音'
                    }
                ]
            },
            notcusList: [],
            loading: true,
            totalNum: 0,
            currentPage: 0,
            size: 10,
            cus: [],
            deleteArr: [],
            fromList: {},
            dialogFormUser: false
        }
    },
    methods: {
        parseTime,
        //设置表格单元格的样式
        tableCellStyle({ row, columnrowIndex, columnIndex }) {
            return 'font-size:12px;text-align:center;padding:7px 0;'
        },
        //设置表头行的样式
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            return 'font-size:12px;text-align:center;padding:5px 0;background:#f7f7f7;'
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
        //客户信息弹窗
        dialogUser(index) {
            this.fromList = this.notcusList[index].customer
            this.fromList.age = getAge(this.fromList.birthDate)
            this.fromList.familyMemberList.forEach((item)=>{
                item.age = getAge(item.birthDate)
            })
            setTimeout(() => {
                this.dialogFormUser = true
            })
        },
        //分页
        handleSizeChange(val) {
            this.loading = true
            this.size = val
            var obj = {
                planStatus: 0,
                name: this.search.name,
                nickName: this.search.nickName,
                phone: this.search.phone,
                status: this.search.status,
                yearIncome: this.search.yearIncome,
                location: this.search.location,
                birthDateStart: this.search.birthDate[0],
                birthDateEnd: this.search.birthDate[1],
                createTimeStart: this.search.createTime[0],
                createTimeEnd: this.search.createTime[1],
                page: this.currentPage - 1,
                size: this.size,
                sort: 'createTime,desc'
            }
            this.getList(obj)
        },
        handleCurrentChange(val) {
            this.loading = true
            this.currentPage = val
            var obj = {
                planStatus: 0,
                name: this.search.name,
                nickName: this.search.nickName,
                phone: this.search.phone,
                status: this.search.status,
                yearIncome: this.search.yearIncome,
                location: this.search.location,
                birthDateStart: this.search.birthDate[0],
                birthDateEnd: this.search.birthDate[1],
                createTimeStart: this.search.createTime[0],
                createTimeEnd: this.search.createTime[1],
                page: this.currentPage - 1,
                size: this.size,
                sort: 'createTime,desc'
            }
            this.getList(obj)
        },

        //获取方案列表
        getList(obj) {
            initData('/api/customerOrder', obj).then(res => {
                this.notcusList = res.content

                this.notcusList.forEach((item1)=>{
                    item1.customer.familyMemberList.forEach((item2)=>{
                        item2.age = getAge(item2.birthDate)
                    })
                })

                this.totalNum = res.totalElements
                this.loading = false
            })
        },

        //地区
        changeLoation(value) {
            var str = this.$refs['refSubCat'].getCheckedNodes()[0]
            var str2 = str.parent.label + str.label
            this.search.location = str2
        },
        //复选框
        selectionChange(val) {
            this.cus = val
            this.deleteArr = []
            val.forEach(item => {
                this.deleteArr.push(item.id)
            })
        },
        //查询
        onSearch() {
            var obj = {
                planStatus: 0,
                name: this.search.name,
                nickName: this.search.nickName,
                phone: this.search.phone,
                status: this.search.status,
                yearIncome: this.search.yearIncome,
                location: this.search.location,
                birthDateStart: this.search.birthDate[0],
                birthDateEnd: this.search.birthDate[1],
                createTimeStart: this.search.createTime[0],
                createTimeEnd: this.search.createTime[1],
                page: 0,
                size: this.size,
                sort: 'createTime,desc'
            }
            this.getList(obj)
        },
        //定制方案
        toCus(a) {
            if (this.cus.length == 1) {
                if (a == 1) {
                    this.$router.push({
                        path: '/programme/programme-cus',
                        query: {
                            cus: this.cus[0].customer.id,
                            requestId: this.cus[0].id,
                            type: 1,
                            status: 0
                        }
                    })
                } else {
                    this.$router.push({
                        path: '/programme/programme-cus',
                        query: {
                            cus: this.cus[0].customer.id,
                            requestId: this.cus[0].id,
                            type: 0,
                            status: 0
                        }
                    })
                }
            } else {
                this.toast('只能选择一条信息定制方案')
            }
        },
        //删除
        deletes() {
            var obj = {
                planStatus: 0,
                name: this.search.name,
                nickName: this.search.nickName,
                phone: this.search.phone,
                status: this.search.status,
                yearIncome: this.search.yearIncome,
                location: this.search.location,
                birthDateStart: this.search.birthDate[0],
                birthDateEnd: this.search.birthDate[1],
                createTimeStart: this.search.createTime[0],
                createTimeEnd: this.search.createTime[1],
                page: this.currentPage - 1,
                size: this.size,
                sort: 'createTime,desc'
            }
            if (this.deleteArr.length > 0) {
                deleteData('/api/customerOrder', this.deleteArr).then(res => {
                    this.getList(obj)
                    this.toast('删除成功')
                })
            } else {
                this.toast('请选择要删除的方案')
            }
        },
        //导出excel
        excel() {
            var obj = {
                planStatus: 0
            }

            request({
                url: process.env.BASE_API + '/api/customerOrder/download',
                method: 'get',
                params: obj,
                responseType: 'blob'
            }).then(res => {
                const link = document.createElement('a')
                let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
                link.style.display = 'none'
                link.href = URL.createObjectURL(blob)

                // link.download = res.headers['content-disposition'] //下载后文件名
                link.download = '未定制方案.xls' //下载的文件名
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            })
        }
    },
    created() {
        var obj = {
            planStatus: 0,
            page: this.currentPage,
            size: this.size,
            sort: 'updateTime,desc'
        }
        this.getList(obj)
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.notcus {

    .el-form {
        border-bottom: 1px solid #ccc;
        margin-bottom: 20px;
        /deep/ .el-form-item {
            display: inline-block;

            .block {
                .el-date-editor {
                    padding: 0 5px;
                    height: 30px;
                    line-height: 30px;
                    font-size: 12px;
                    border-radius: 0;
                    i{
                        line-height: 30px;
                    }
                    span{
                        line-height: 30px;
                    }
                }
            }
        }
    }

    /deep/ .tableStyle {
        .el-table__row {
            td:nth-of-type(6) {
                cursor: pointer;

                span {
                    border-bottom: 1px solid blue !important;
                    color: blue;
                }
            }
        }
    }

    .btn{
        text-align: right;
        margin-top: 20px;
    }

    .block{
        text-align: right;
    }

    .dialogUser {
        /deep/ .el-dialog {
            width: 70%;

            .el-dialog__body {
                padding: 0 20px 20px;
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
                            color: #ff4949;
                        }

                        .el-form-item {
                            display: block;
                            margin: 0;
                            padding-left: 20px;
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
}
</style>
