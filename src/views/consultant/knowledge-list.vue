<template>
    <div class="app-container">
        <div class="head-container">
            <el-input class="filter-item" style="width: 200px;" @keyup.enter.native="handleFilter" placeholder="名称" v-model="name"></el-input>
            <el-select class="filter-item" v-model="companyId" placeholder="保险公司">
                <el-option v-for="(item, index) in companyLists" :key="index" :label="item.name" :value="item.id"> </el-option>
            </el-select>
            <el-input class="filter-item" style="width: 200px;" @keyup.enter.native="handleFilter" placeholder="年龄" v-model="insureAge"></el-input>
            <el-select class="filter-item" v-model="selling" placeholder="状态">
                <el-option v-for="item in sellingLists" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
            <el-button size="mini" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </div>
        <div class="head-container">
            <el-button size="mini" @click="newAt" type="primary" icon="el-icon-edit-outline">新建</el-button>
            <el-button size="mini" @click="" type="primary" icon="el-icon-upload2">导入</el-button>
        </div>
        <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column align="center" label="序号" width="95">
                <template slot-scope="scope">
                    {{ scope.row.id }}
                </template>
            </el-table-column>
            <el-table-column label="名称" width="" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="保险公司" align="center" width="">
                <template slot-scope="scope">
                    <span>{{ scope.row.company.name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="基础保费" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.baseFee }}</span>
                </template>
            </el-table-column>
            <el-table-column label="推广链接" align="center">
                <template slot-scope="scope">
                    <a href="http://www.baidu.com" target="_blank">{{ scope.row.salesUrl }}</a>
                </template>
            </el-table-column>
            <el-table-column label="服务费" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.feeRate }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作(点击切换上下架)" width="" align="center" width="250">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click.native="edit(scope.row.id)">修改</el-button>
                    <!-- <el-button v-if="scope.row.selling" type="success" size="mini" @click.native="setSelling(scope.row, scope.$index)">已上架</el-button> -->
                    <!-- <el-button v-if="!scope.row.selling" type="warning" size="mini" @click.native="setSelling(scope.row, scope.$index)">已下架</el-button> -->
                    <el-button :type="scope.row.selling ? 'success' : 'warning'" size="mini" @click.native="setSelling(scope.row, scope.$index)">{{ scope.row.selling ? '已上架' : '已下架' }}</el-button>
                    <el-button type="danger" size="mini" @click.native="del(scope.row.id, scope.$index)" :disabled="scope.row.isDelete">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-container">
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="listQuery.page + 1"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="listQuery.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </div>
    </div>
</template>
<script>
import { getProductList, delProduct, sellingProduct } from '@/api/product'

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
            name: '',
            companyId: '',
            selling: '',
            insureAge: '',
            companyLists: [],
            sellingLists: [
                {
                    value: true,
                    label: '在售'
                },
                {
                    value: false,
                    label: '下架'
                }
            ],
            atlList: '' //选中的文章列表
        }
    },

    created() {
        this.getList()
    },
    methods: {
        handelCompanyChange(val) {
            console.log('GOOGLE: val', val)
        },
        getList() {
            getProductList(this.listQuery.page, this.listQuery.size, this.name, this.companyId, this.insureAge, this.selling)
                .then(res => {
                    console.log('GOOGLE: res', res)
                    this.list = res.content
                    this.total = res.totalElements
                })
                .catch(err => {
                    // console.log(err.response.data.message)
                })
        },

        del(id, index) {
            this.$confirm('此操作将删除产品, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delProduct(id)
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
                name: 'ProductCreat',
                query: {
                    id: id
                }
            })
        },
        // 设置上下架
        setSelling(row, index) {
            sellingProduct(row.id, !row.selling)
                .then(res => {
                    this.$set(this.list[index], 'selling', !row.selling)
                    this.$notify({
                        title: !row.selling ? '下架成功' : '上架成功',
                        type: 'success',
                        duration: 2500
                    })
                    // this.list.splice(index, 1)
                })
                .catch(err => {
                    // console.log(err.response.data.message)
                })
        },
        newAt() {
            this.$router.push({
                name: 'ProductCreat'
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
    width: 200px;
    margin-right: 20px;
}
.topInfo .el-form-item {
    margin-right: 28px;
}
</style>
