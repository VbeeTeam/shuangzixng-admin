<!--
 * @Component Name: PictureLibrary
 * @Author: cs
 * @LastEditTime : 2019-12-30 10:59:20
 * @Description: 图片库
 * @emit: sureClick 选中后确定 传输选中图片selImage
 * @emit: closeD 父组件关闭弹窗 选中图片 index置空
 * @FilePath: /star-pool-insures-service-ui/src/views/components/PictureLibrary.vue
 -->
<template>
    <div class="list_warp">
        <div class="head-container">
            <el-input class="filter-item" style="width: 200px;" @keyup.enter.native="handleFilter" placeholder="标签" v-model="tag"></el-input>
            <el-button size="mini" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </div>
        <div class="list">
            <div :class="[index === selIndex ? 'bod' : '', 'item']" v-for="(item, index) in list">
                <!-- {{ index }}-{{ selIndex }}{{ index == selIndex }} -->
                <img :src="item.url" alt="" @click="getItem(item.url, index)" />
            </div>
        </div>
        <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page + 1" :page-sizes="[20]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="text" @click="closeDia">取消</el-button>
            <el-button :loading="loading" type="primary" @click="getImage">确认</el-button>
        </div>
    </div>
</template>

<script>
import { imageList } from '@/api/wechat'

export default {
    name: 'PictureLibrary',
    data() {
        return {
            tag: '',
            listQuery: {
                page: 0,
                size: 20
            },
            loading: false,
            total: 0,
            list: '', //图片库数据列表
            // 选中的图片 url index
            selImage: '',
            selIndex: ''
        }
    },
    props: {
        //此处一定要用value
        value: {
            type: String
        }
    },
    watch: {
        value(val) {
            // console.log(val)
            this.editorContent = val
            this.editor.txt.html(this.editorContent)
        }
    },
    computed: {},
    mounted() {
        this.getList()
    },
    methods: {
        // 获取图片库列表
        getList() {
            // let menuString = JSON.stringify(this.menu)
            imageList(this.listQuery.page, this.listQuery.size)
                .then(res => {
                    console.log('TCL: res', res)
                    this.list = res.content
                    this.total = res.totalElements
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
        // 获取选中图片
        getItem(url, index) {
            this.selImage = url
            this.selIndex = index
        },
        // emit
        getImage() {
            this.$emit('sureClick', this.selImage)
            this.selImage = ''
            this.selIndex = ''
        },
        closeDia() {
            this.$emit('closeD')
            this.selImage = ''
            this.selIndex = ''
        }
    }
}
</script>

<style scoped="scoped">
.list {
    display: flex;
    justify-content: space-around;
    width: 100%;
    flex-wrap: wrap;
}
.list .item {
    width: 90px;
    height: 90px;
    overflow: hidden;
    margin: 0 10px 20px;
    border: 2px solid #fff;
}
.list .item.bod {
    border: 2px solid #00ccff;
}
.list img {
    width: 90px;
    max-height: 90px;
}
.dialog-footer {
    padding: 20px;
    padding-top: 10px;
    text-align: right;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
</style>
