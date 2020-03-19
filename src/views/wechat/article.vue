<template>
    <div class="app-container">
        <div class="head-container">
            <!-- <el-button size="small" type="danger" icon="el-icon-search" @click="sendIM">测试im消息</el-button> -->
            <el-input style="width: 200px;" @keyup.enter.native="handleFilter" placeholder="标题" v-model="title"></el-input>
            <el-input style="width: 200px;" @keyup.enter.native="handleFilter" placeholder="作者" v-model="author"></el-input>
            <el-date-picker v-model="date" type="date" placeholder="创建时间" value-format="yyyy-MM-dd hh:mm:ss"> </el-date-picker>
            <el-button size="small" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
            <!-- <el-button style="margin-left: 10px;" @click="reset" type="primary" icon="el-icon-refresh">重置</el-button> -->
        </div>
        <div class="head-container">
            <el-button size="small" @click="newAt" type="primary" icon="el-icon-edit-outline">新建</el-button>
            <el-button size="small" @click="publishAt" type="primary" icon="el-icon-upload2">发布</el-button>
        </div>
        <div class="table-wrap" style="max-width:1031px">
            <el-table :data="list" v-loading.body="listLoading" :header-cell-style="tableHeaderColor" element-loading-text="Loading" @selection-change="handleSelectionChange" border fit highlight-current-row>
                <el-table-column type="selection" width="55" align="center"> </el-table-column>
                <el-table-column align="center" label="序号" width="95">
                    <template slot-scope="scope">
                        {{ scope.row.id }}
                    </template>
                </el-table-column>
                <el-table-column label="标题" width="500" align="left">
                    <template slot-scope="scope">
                        <div class="flex info-list">
                            <div>
                                <img :src="scope.row.thumbUrl" alt="" />
                            </div>
                            <div class="">
                                <p class="title">{{ scope.row.title }}</p>
                                <p>创建时间:{{ formatTime(scope.row.createTime) }}</p>
                                <p>发布时间:{{ formatTime(scope.row.publishTime) }}</p>
                                <p>作者:{{ scope.row.author }}</p>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="封面" align="center" width="150">
                <template slot-scope="scope">
                    <img class="timg" :src="scope.row.thumbUrl" alt="" />
                </template>
            </el-table-column> -->
                <el-table-column label="摘要" width="200" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.digest }}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="作者" align="center">
                <template slot-scope="scope">
                    {{ scope.row.author }}
                </template>
            </el-table-column>
            <el-table-column label="创建时间" width="110" align="center">
                <template slot-scope="scope">
                    {{ formatTime(scope.row.createTime) }}
                </template>
            </el-table-column>
            <el-table-column label="发布时间" width="110" align="center">
                <template slot-scope="scope">
                    {{ formatTime(scope.row.publishTime) }}
                </template>
            </el-table-column> -->
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button class="btn-primary" type="text" size="mini" @click="edit(scope.row.id)">修改</el-button>
                        <el-button class="btn-danger" type="text" size="mini" @click="del(scope.row.id, scope.$index)" :disabled="scope.row.isDelete">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page + 1" :page-sizes="[10, 20, 50, 100]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
        </div>
    </div>
</template>
<script>
import { listArticle, delArticle, viewArticlePush } from '@/api/wechat'
import moment from 'moment'

export default {
    data() {
        return {
            list: null,
            date: '',
            total: 0,
            listLoading: false,
            listQuery: {
                page: 0,
                size: 10
            },
            // page: 0,
            title: '',
            author: '',
            // categoryList: [], //类目列表
            // category_id: [], //选中的类目
            atlList: '' //选中的文章列表
        }
    },

    created() {
        this.getList()
    },
    methods: {
        sendIM() {
            viewArticlePush('12345测试<a href="http://www.baidu.com">链接测试1</a>静电纺丝金凤凰见风使舵<a href="http://www.baidu.com">链接测试2</a>', 'oHYaCxBrk-qGTaKReVp6J2nh2dv0')
                .then(res => {
                    console.log('GOOGLE: sendIM -> res', res)
                })
                .catch(err => {
                    // console.log(err.response.data.message)
                })
        },
        //设置表头行的样式
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            return 'font-size:12px;text-align:center;padding:2px 0;background:#f7f7f7;'
        },
        getList() {
            if (this.date) {
                listArticle(this.listQuery.page, this.listQuery.size, this.title, this.author, this.date)
                    .then(res => {
                        this.list = res.content
                        this.total = res.totalElements
                    })
                    .catch(err => {
                        // console.log(err.response.data.message)
                    })
            } else {
                listArticle(this.listQuery.page, this.listQuery.size, this.title, this.author)
                    .then(res => {
                        this.list = res.content
                        this.total = res.totalElements
                    })
                    .catch(err => {
                        // console.log(err.response.data.message)
                    })
            }
        },
        // 格式化时间
        formatTime(val) {
            if (val) {
                return moment.unix(val / 1000).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        // 摘要截取
        abstract(val) {
            if (val) {
                return val.substr(0, 20)
            }
        },
        del(id, index) {
            this.$confirm('此操作将删除文章, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delArticle(id)
                    .then(res => {
                        this.$notify({
                            title: '删除成功',
                            type: 'success',
                            duration: 2500
                        })
                        this.list.splice(index, 1)
                    })
                    .catch(err => {
                        // console.log(err.response.data.message)
                    })
            })
        },
        edit(id) {
            this.$router.push({
                // path: '/goods/goods_edit',
                name: 'articleCreart',
                query: {
                    id: id
                }
            })
        },
        newAt() {
            this.$router.push({
                name: 'articleCreart'
            })
        },
        // 发布文章 生成文章列表存储 跳转
        publishAt() {
            if (this.atlList.length <= 8 && this.atlList.length > 0) {
                localStorage.removeItem('atlList')
                let astring = JSON.stringify(this.atlList)
                localStorage.setItem('atlList', astring)
                this.$router.push({
                    name: 'articlePublish'
                })
            } else {
                this.$notify({
                    title: '请选择文章数量为1-8',
                    type: 'warning',
                    duration: 2500
                })
            }
        },
        // 搜索
        handleFilter() {
            this.listQuery.page = 0
            this.getList()
        },
        // 分页方法
        handleSizeChange(val) {
            this.listQuery.size = val
            this.getList()
        },
        handleCurrentChange(val) {
            this.listQuery.page = val - 1
            this.getList()
        },
        // 多选框数据处理
        handleSelectionChange(val) {
            this.atlList = val
        }
    }
}
</script>
<style scoped="scoped">
.timg {
    width: 100px;
    height: 100px;
}

.tags {
    margin-bottom: 5px;
}
.filter-container {
    margin-bottom: 20px;
}
.filter-container .el-input {
    margin-right: 20px;
    width: 200px;
}
.info-list img {
    width: 130px;
    height: 100px;
}

.info-list p {
    margin: 0;
    padding-left: 10px;
    line-height: 28px;
}
.info-list .title {
    margin-top: -6px;
    text-align: left;
    font-weight: 600;
}
</style>
