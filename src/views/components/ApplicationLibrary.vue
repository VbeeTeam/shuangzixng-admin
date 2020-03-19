<!--
 * @Component Name: ApplicationLibrary
 * @Author: cs
 * @LastEditTime : 2020-01-10 13:10:13
 * @Description: 应用文章库
 * @emit: sureClick 选中后确定 传输文章列表list
 * @emit: closeD 父组件关闭弹窗 选中列表置空
 * @FilePath: /star-pool-insures-service-ui/src/views/components/ApplicationLibrary.vue
 -->
<template>
    <div class="art-container">
        <div class="head-container">
            <el-input @keyup.enter.native="handleFilter" placeholder="标题" v-model="title"></el-input>
            <el-select v-model="category" default-first-option placeholder="请选择文章标签">
                <el-option v-for="(item, index) in cLists" :key="index" :label="item.name" :value="item.id"> </el-option>
            </el-select>
            <el-button size="small" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </div>
        <p style="font-size:12px;">tips:请勿跨页面选取</p>
        <el-table :data="list" @selection-change="handleSelectionChange" :header-cell-style="tableHeaderColor" ref="multipleTable" border fit highlight-current-row>
            <el-table-column type="selection" width="55" align="center"> </el-table-column>
            <el-table-column label="ID" align="center" width="60">
                <template slot-scope="scope">
                    <span>{{ scope.row.id }}</span>
                </template>
            </el-table-column>
            <el-table-column label="文章" align="left">
                <template slot-scope="scope">
                    <div class="flex info-list">
                        <div>
                            <img :src="scope.row.coverUrl" alt="" />
                        </div>
                        <div class="">
                            <p class="title">{{ scope.row.title }}</p>
                            <p>创建时间:{{ formatTime(scope.row.createTime) }}</p>
                            <p>作者:{{ scope.row.author }}</p>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="分类" align="center" width="90">
                <template slot-scope="scope">
                    {{ scope.row.category.name }}
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page + 1" :page-sizes="[10, 20, 50, 100]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="text" @click="closeDia">取消</el-button>
            <el-button :loading="loading" type="primary" @click="pushList">确认</el-button>
        </div>
    </div>
</template>
<script>
import { applicationList, categoryList } from '@/api/product'
import moment from 'moment'

export default {
    data() {
        return {
            list: null, //显示的文章列表数据
            date: '',
            total: 0,
            listLoading: false,
            loading: false,
            listQuery: {
                page: 0,
                size: 4
            },
            status: 1, //查询已发布文章
            title: '',
            category: '',
            atlList: [], //选中的文章列表
            cLists: []
        }
    },

    created() {
        this.getList()
    },

    methods: {
        //设置表头行的样式
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            return 'font-size:12px;text-align:center;padding:2px 0;background:#f7f7f7;'
        },
        // 格式化时间
        formatTime(val) {
            if (val) {
                return moment.unix(val / 1000).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        getList() {
            applicationList(this.listQuery.page, this.listQuery.size, this.title, this.category, this.status)
                .then(res => {
                    console.log('GOOGLE: 应用文章库列表', res)
                    this.list = res.content
                    this.total = res.totalElements
                })
                .catch(err => {
                    // console.log(err.response.data.message)
                })
            categoryList(1)
                .then(res => {
                    console.log('GOOGLE: categoryList', res)
                    this.cLists = res.content
                })
                .catch(err => {
                    // console.log(err.response.data.message)
                })
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
        },
        closeDia() {
            this.$emit('closeD')
            this.atlList = []
            this.toggleSelection()
        },
        // 取消选择
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row)
                })
            } else {
                this.$refs.multipleTable.clearSelection()
            }
        },
        // emit
        pushList() {
            let list = []
            this.atlList.map(item => {
                list.push({
                    id: item.id,
                    title: item.title,
                    coverUrl: item.coverUrl,
                    // visits: item.visits,
                    // url: item.url,
                    type: 'app'
                })
            })
            this.$emit('sureClick', list)
            console.log('GOOGLE: pushList -> list', list)
            this.atlList = []
            this.toggleSelection()
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
.dialog-footer {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 20px;
    padding-top: 10px;
    text-align: right;
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
