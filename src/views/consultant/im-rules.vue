<template>
    <div class="app-container">
        <div class="flex">
            <div class="head-container topInfo">
                <el-form class="demo-form-inline" label-position="right" style="width:450px" label-width="130px">
                    <el-form-item label="对所有顾问生效">
                        <span class="info">单位时间接待上限，即1小时内最多接待客户上限。</span>
                    </el-form-item>
                    <el-form-item label="单位时间接待上限">
                        <el-input size="small" placeholder="输入内容" v-model.number="configSet"></el-input>
                        <el-button type="primary" @click="setConfigFun" :loading="loading">确定</el-button>
                        <span>当前: {{ config }}</span>
                    </el-form-item>
                    <el-form-item label="对单个顾问生效">
                        <span class="info">每日接待上限，权重设置（A顾问被分配概率=A顾问权重/所有顾问权重）</span>
                    </el-form-item>
                    <!-- <el-form-item label="顾问">
                        <el-select v-model="adId" placeholder="选择顾问" @change="pushAd">
                            <el-option v-for="(item, index) in adList" :key="index" :label="item.name" :value="item.id"> </el-option>
                        </el-select>
                    </el-form-item> -->

                    <el-form-item label="顾问">
                        <el-input size="small" placeholder="右侧表格选择顾问" v-model="currentAdviser.name" disabled=""></el-input>
                    </el-form-item>
                    <el-form-item label="每日接待上限">
                        <el-input size="small" placeholder="输入内容" v-model.number="consultAllotTimesToDay"></el-input>
                        <el-button type="primary" @click="setLimit" :loading="loading">确定</el-button>
                        <span>当前: {{ currentAdviser.consultAllotTimesToDay }}</span>
                    </el-form-item>
                    <el-form-item label="权重">
                        <el-input size="small" placeholder="输入内容" v-model.number="consultWeight"></el-input>
                        <el-button type="primary" @click="setWeight" :loading="loading">确定</el-button>
                        <span>当前: {{ currentAdviser.consultWeight }}</span>
                    </el-form-item>
                </el-form>
            </div>
            <div class="right">
                <el-table :data="adList" v-loading.body="listLoading" :header-cell-style="tableHeaderColor" highlight-current-row @current-change="pushAd" element-loading-text="Loading" border fit>
                    <el-table-column label="顾问昵称" width="" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="每日接待上线" align="center" width="">
                        <template slot-scope="scope">
                            <span>{{ scope.row.consultAllotTimesToDay }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="权重" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.consultWeight }}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination-container">
                    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page + 1" :page-sizes="[10, 20, 50, 100]" :page-size="listQuery.size" layout="total, prev, pager, next" :total="total"> </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { getConfigAdviser, getConfig, setAdConfig, setConfig } from '@/api/consult'

export default {
    data() {
        return {
            list: null,
            date: '',
            loading: false,
            listLoading: false,
            total: 0,
            listQuery: {
                page: 0,
                size: 10
            },
            config: 0, //当前配置时间
            configSet: '', //设置配置时间
            currentAdviser: {}, //当前选中的顾问
            consultAllotTimesToDay: '', //每日接待上限
            consultWeight: '', //权重
            adId: '',
            adList: []
        }
    },

    created() {
        this.getAdList()
        this.getConfigFun()
    },
    methods: {
        //设置表头行的样式
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            return 'font-size:12px;text-align:center;padding:2px 0;background:#f7f7f7;'
        },
        // 获取所有顾问
        getAdList() {
            getConfigAdviser(this.listQuery.page, this.listQuery.size)
                .then(res => {
                    this.adList = res.content
                    this.total = res.totalElements
                })
                .catch(err => {
                    // console.log(err.response.data.message)
                })
        },
        // 查询当前配置 - 单位时间接待上限
        getConfigFun() {
            getConfig()
                .then(res => {
                    this.config = res.allotTimesInTimeUtil
                })
                .catch(err => {
                    // console.log(err.response.data.message)
                })
        },
        // 修改当前配置 - 单位时间接待上限
        setConfigFun() {
            let submitData = {
                allotTimesInTimeUtil: this.configSet
            }
            setConfig(submitData)
                .then(res => {
                    this.$notify({
                        title: '修改成功',
                        type: 'success',
                        duration: 2500
                    })
                    this.config = this.configSet
                })
                .catch(err => {
                    // console.log(err.response.data.message)
                })
        },
        // 修改某顾问配置 每日上限
        setLimit() {
            if (!this.currentAdviser.id) {
                this.$notify({
                    title: '请选择顾问',
                    type: 'error',
                    duration: 2500
                })
                return
            }
            let submitData = {
                id: this.currentAdviser.id,
                consultAllotTimesToDay: this.consultAllotTimesToDay
            }
            setAdConfig(submitData)
                .then(res => {
                    this.$notify({
                        title: '修改成功',
                        type: 'success',
                        duration: 2500
                    })
                    this.currentAdviser.consultAllotTimesToDay = this.consultAllotTimesToDay
                    // this.getAdList()
                    // submitData = {}
                })
                .catch(err => {
                    // console.log(err.response.data.message)
                })
        },
        // 修改某顾问配置 权重
        setWeight() {
            if (!this.currentAdviser.id) {
                this.$notify({
                    title: '请选择顾问',
                    type: 'error',
                    duration: 2500
                })
                return
            }
            let submitData = {
                id: this.currentAdviser.id,
                consultWeight: this.consultWeight
            }
            setAdConfig(submitData)
                .then(res => {
                    this.$notify({
                        title: '修改成功',
                        type: 'success',
                        duration: 2500
                    })
                    this.currentAdviser.consultWeight = this.consultWeight
                    // this.getAdList()
                })
                .catch(err => {
                    // console.log(err.response.data.message)
                })
        },
        // 选择顾问
        pushAd(row) {
            if (!row) {
                return
            }
            console.log('GOOGLE: handleCurrentChange -> row', row)
            this.currentAdviser = row
        },
        // 分页方法
        handleSizeChange(val) {
            this.listQuery.size = val
            this.getAdList()
        },
        handleCurrentChange(val) {
            this.listQuery.page = val - 1
            this.getAdList()
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
.topInfo .el-form-item {
    margin-right: 28px;
}
</style>
