
<template>
    <div class="app-container">
        <div class="head-container topInfo">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="产品">
                    <el-select v-model="productId" @change="handelProductChange" filterable default-first-option placeholder="请选择">
                        <el-option v-for="(item, index) in productList" :key="index" :label="item.name" :value="item.id"> </el-option>
                    </el-select>
                </el-form-item>
                <template v-if="pList.type">
                    <el-form-item label="">
                        <span class="info">{{ pList.type }}</span>
                    </el-form-item>
                    <el-form-item label="渠道:">
                        <span class="info">{{ pList.channel.name }}</span>
                    </el-form-item>
                    <el-form-item label="保险公司:">
                        <span class="info">{{ pList.company.name }}</span>
                    </el-form-item>
                    <el-form-item label="服务费率:">
                        <span class="info">{{ pList.feeRate }}</span>
                    </el-form-item>
                </template>
            </el-form>
        </div>

        <div class="rule">
            <div class="left">
                <el-form :inline="true" size="small" label-position="left" label-width="100px">
                    <el-form-item label="投保规则" prop="title">
                        <el-button type="primary" size="small" @click="specAdd">新增规则</el-button>
                        <el-button type="primary" size="small" @click="specBatch">批量添加规则</el-button>
                    </el-form-item>
                </el-form>
                <el-form :model="listFixed" :rules="rules" ref="formRef" class="ruleadmin" :inline="true" size="small" label-position="left" label-width="100px">
                    <el-form-item label="" v-for="(item, index) in listFixed" :key="index">
                        <el-form-item class="rules" label="" :prop="index + '.itemName'" :rules="rulesName">
                            <el-input placeholder="规则名称" v-model="item.itemName"></el-input>
                        </el-form-item>
                        <el-form-item class="rules" label="" :prop="index + '.itemValues'" :rules="rulesName">
                            <el-select v-model="item.itemValues" multiple filterable allow-create default-first-option placeholder="规则选项">
                                <el-option v-for="item in noRuleList" :key="item" :label="item" :value="item"> </el-option>
                            </el-select>
                        </el-form-item>
                        <!-- <el-input style="width: 200px;" placeholder="规则选项" v-model="item.content"></el-input> -->
                        <el-button class="btn-warning" type="text" size="small" @click="delSpecFun(index)">删除</el-button>
                    </el-form-item>
                </el-form>
                <p class="tips">tips：所有产品必须配置“保障额度”，大部分产品须配置“保障期限”、“交费期限.”</p>
                <el-button type="primary" size="small" @click.native="save">保存</el-button>
            </div>
            <div class="right">
                <el-form :inline="true" size="small" label-position="left" label-width="100px" style="width:120px;">
                    <el-form-item label="产品规格" prop="title">
                        <el-button type="primary" size="small" @click="dialogNew = true">添加产品规格</el-button>
                    </el-form-item>
                </el-form>
                <el-table :data="table" fit highlight-current-row>
                    <el-table-column label="" align="center" width="500">
                        <template slot-scope="scope">
                            <div class="list">
                                <div class="item" v-for="(item, index) in scope.row.list" :key="index">
                                    <span class="title">{{ item.name }}:</span>
                                    <span>{{ item.value }}</span>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="保费" align="center" width="90">
                        <template slot-scope="scope">
                            <el-input style="width: 70px;" placeholder="保费" v-model="scope.row.amount"></el-input>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column label="保费" align="center" width="90">
                        <template slot-scope="scope">
                            <el-input style="width: 70px;" placeholder="保费" v-model="scope.row.key"></el-input>
                        </template>
                    </el-table-column> -->
                    <el-table-column label="操作" align="center" width="180">
                        <template slot-scope="scope">
                            <el-button type="primary" size="small" @click.native="editSkuFun(scope.row)">保存保费</el-button>
                            <el-button type="danger" size="small" @click.native="delSkuFun(scope.row.key, scope.$index)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination-container">
                    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page + 1" :page-sizes="[10, 20, 50, 100]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
                </div>
            </div>
        </div>
        <!-- dialog -->
        <el-dialog :visible.sync="dialogNew" :close-on-click-modal="false" :before-close="cancel" title="添加产品规格" append-to-body width="500px">
            <div v-if="addProductList.length == 0">请先保存编辑投保规则</div>
            <el-form ref="formVideo" size="small" label-position="right" label-width="80px">
                <el-form-item :label="item.itemName" prop="title" v-for="(item, index) in addProductList" :key="index">
                    <el-select v-model="skuItem[index]" style="width: 150px;" default-first-option placeholder="请选择">
                        <el-option v-for="val in item.itemValues" :key="val" :label="val" :value="val"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="保费" v-if="addProductList.length > 0">
                    <el-input style="width: 150px;" placeholder="保费" v-model="amount"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" type="text" @click="cancel">取消</el-button>
                <el-button size="small" :loading="loading" type="primary" @click="submitSku">保存为新规格</el-button>
            </div>
        </el-dialog>
        <!-- dialog -->
    </div>
</template>

<script>
import { getProductList, saveAttrs, getAttrs, addSku, getSkuList, delSku, editSku, generateBatch } from '@/api/product'
import { deepClone } from '@/utils/deepClone'

export default {
    data() {
        return {
            total: 0,
            listQuery: {
                page: 0,
                size: 10
            },
            loading: false,
            dialogNew: false,
            productId: '',
            productList: [],
            ruleList: ['基本保额', '保障期限', '缴费期限', '投保人性别', '投保年龄'],
            // 选中的product 数据列表
            pList: [],
            // 投保规则 编辑列表
            listFixed: [
                {
                    itemName: '',
                    itemValues: ''
                }
            ],
            // 产品规格新增时选项
            skuItem: [],
            // 保费
            amount: 0,
            // 产品规格 编辑列表
            addProductList: [],
            // sku列表
            table: [],
            // sku列表 当前选中
            tableSel: [],
            // 添加临时列表
            skuItems: [
                {
                    content: '0',
                    itemName: '基本保额'
                },
                {
                    content: '0',
                    itemName: '保障期限'
                },
                {
                    content: '0',
                    itemName: '缴费期限'
                },
                {
                    content: '0',
                    itemName: '投保人性别'
                }
            ],
            rules: {},
            rulesName: [{ required: true, message: '请输入内容', trigger: 'blur' }],

            // 空列表
            noRuleList: []
        }
    },
    mounted() {
        this.getProduct()
    },

    methods: {
        // 获取产品列表 下拉框
        getProduct() {
            getProductList(0, 500)
                .then(res => {
                    console.log('GOOGLE: getProductList', res)
                    this.productList = res.content
                })
                .catch(err => {
                    // console.log(err.response.data.message)
                })
        },
        // 查询某个产品的投保规则
        getAttrsFun() {
            getAttrs(this.productId)
                .then(res => {
                    if (res.skuattributeItems) {
                        this.listFixed = res.skuattributeItems
                        this.addProductList = deepClone(res.skuattributeItems)
                        this.skuItem = []
                        for (let i = 0; i < this.addProductList.length; i++) {
                            this.skuItem.push('')
                        }
                    } else {
                        this.listFixed = [
                            {
                                itemName: '',
                                itemValues: ''
                            }
                        ]
                        this.addProductList = []
                        this.skuItem = []
                    }
                })
                .catch(err => {
                    // console.log(err.response.data.message)
                })
        },
        // 获取sku列表
        getSkuFun() {
            getSkuList(this.listQuery.page, this.listQuery.size, this.productId)
                .then(res => {
                    console.log('GOOGLE: getSkuList', res)
                    this.table = res.totalElements
                    this.total = res.content
                    for (let i = 0; i < this.table.length; i++) {
                        let thisTable = this.table[i]
                        this.table[i].list = []
                        for (let item in thisTable) {
                            if (item != 'amount' && item != 'key' && item != 'list') {
                                this.table[i].list.push({
                                    name: item,
                                    value: this.table[i][item]
                                })
                            }
                        }
                    }
                })
                .catch(err => {
                    // console.log(err.response.data.message)
                })
        },
        // // 添加sku
        // addSkuFun() {
        //     addSku(0, this.productId, this.skuItems)
        //         .then(res => {
        //             console.log('GOOGLE: res', res)
        //             this.productList = res.content
        //             this.getSku()
        //             this.$notify({
        //                 title: '添加成功',
        //                 message: '',
        //                 type: 'success',
        //                 duration: 4500
        //             })
        //         })
        //         .catch(err => {
        //             // console.log(err.response.data.message)
        //         })
        // },
        delSkuFun(itemKey, index) {
            this.$confirm('此操作将删除产品, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delSku(this.productId, itemKey)
                    .then(res => {
                        this.$notify({
                            title: '删除成功',
                            type: 'success',
                            duration: 2500
                        })
                        this.table.splice(index, 1)
                    })
                    .catch(err => {
                        // console.log(err.response.data.message)
                    })
            })
        },
        // // 选择产品id 下拉框
        handelProductChange(val) {
            this.getAttrsFun()
            this.getSkuFun()
            for (let i = 0; i < this.productList.length; i++) {
                if (this.productList[i].id == val) {
                    this.pList = this.productList[i]
                }
            }
        },
        // 添加规则
        specAdd() {
            this.listFixed.push({
                itemName: '',
                itemValues: ''
            })
        },
        // 删除规则
        delSpecFun(index) {
            this.listFixed.splice(index, 1)
        },
        // // 处理表格单行选中
        // handleCurrentChange(val) {
        //     console.log('GOOGLE: val', val)
        //     this.list = val
        // },
        // // 编辑规格保费
        editSkuFun(row) {
            editSku(row.amount, row.key, this.productId)
                .then(res => {
                    this.$notify({
                        title: '保费编辑成功',
                        type: 'success',
                        duration: 2500
                    })
                })
                .catch(err => {
                    // console.log(err.response.data.message)
                })
        },
        save() {
            // 判断是否选择了产品
            if (!this.productId) {
                this.$notify({
                    title: '请选择产品',
                    type: 'warning',
                    duration: 2500
                })
                return false
            }
            // 验证数据
            this.$refs['formRef'].validate(valid => {
                // 验证表单内容
                if (valid) {
                    // 转化为字符串
                    let arrString = deepClone(this.listFixed)
                    for (let i = 0; i < arrString.length; i++) {
                        arrString[i].itemValues = arrString[i].itemValues.join(',')
                    }
                    // arrString = JSON.stringify(arrString)
                    saveAttrs(this.productId, arrString)
                        .then(res => {
                            this.$notify({
                                title: '保存成功',
                                type: 'success',
                                duration: 2500
                            })
                            this.getAttrsFun()
                        })
                        .catch(err => {
                            // console.log(err.response.data.message)
                        })
                } else {
                    this.$notify({
                        title: '请填写信息后再提交',
                        type: 'warning',
                        duration: 2500
                    })
                }
            })
        },
        cancel() {
            this.dialogNew = false
        },
        // 保存为新规格
        submitSku() {
            let sitem = {}
            for (let i = 0; i < this.skuItem.length; i++) {
                let num = i + 1
                sitem[this.listFixed[i].itemName] = this.skuItem[i]
            }
            addSku(this.amount, this.productId, sitem)
                .then(res => {
                    this.$notify({
                        title: '添加成功',
                        type: 'success',
                        duration: 2500
                    })
                    this.amount = 0
                    this.getSkuFun()
                    // this.table.splice(index, 1)
                })
                .catch(err => {
                    // console.log(err.response.data.message)
                })
        },
        // 批量处理
        specBatch() {
            this.$confirm('此操作会删除原有规格, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                generateBatch(this.productId)
                    .then(res => {
                        this.$notify({
                            title: '批量添加成功',
                            type: 'success',
                            duration: 2500
                        })
                        this.getSkuFun()
                        // this.amount = 0
                        // this.table.splice(index, 1)
                    })
                    .catch(err => {
                        // console.log(err.response.data.message)
                    })
            })
        },
        // 分页方法
        handleSizeChange(val) {
            this.listQuery.size = val
            this.getSkuFun()
        },
        handleCurrentChange(val) {
            this.listQuery.page = val - 1
            this.getSkuFun()
        }
    }
}
</script>
<style scoped="scoped">
.left {
    margin-right: 30px;
}
.rule {
    display: flex;
    justify-content: flex-start;
}
.right .list {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    justify-content: flex-start;
}
.right .list .item {
    display: block;
    margin-right: 16px;
}
.right .list .title {
    margin-right: 2px;
    font-weight: 900;
}
body >>> .el-select-dropdown {
    display: none;
}
.left .ruleadmin >>> .el-input__suffix {
    display: none;
}
.nopoper {
    display: none;
}
</style>
<style></style>