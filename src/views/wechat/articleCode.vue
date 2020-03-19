<template>
    <div class="app-container">
        <div class="head-container flex">
            <img class="himg" src="../../assets/img/login.png" alt="" style="width:80px;height:80px" />
            <p style="line-height:80px; margin:0 0 0 20px;">文章码用于在推广时，加入到文章内容中，当用户扫码时关注时，可以标记用户注册的渠道及阅读的文章。</p>
        </div>
        <div class="head-container" style="margin-top:40px;">
            <el-form :inline="true">
                <el-form-item label="主体">
                    <el-select v-model="mainbodyAppid" placeholder="请选择">
                        <el-option v-for="item in WXList" :key="item.appId" :label="item.name" :value="item.appId"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="渠道">
                    <el-select v-model="channelId" placeholder="请选择">
                        <el-option v-for="item in channelList" :key="item.id" :label="item.channelName" :value="item.id"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文章">
                    <el-button size="small" type="primary" @click="dialogArticle = true">文章库</el-button>
                    <span>{{ selectedArt.title }}</span>
                </el-form-item>
            </el-form>
            <el-form :inline="true">
                <el-form-item label="">
                    <el-button size="small" type="primary" icon="el-icon-plus" @click="add">新增</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div class="table-wrap" style="max-width:886px">
            <el-table :data="list" v-loading.body="listLoading" :header-cell-style="tableHeaderColor" element-loading-text="Loading" border fit highlight-current-row>
                <el-table-column align="center" label="序号" width="95">
                    <template slot-scope="scope">
                        {{ scope.row.id }}
                    </template>
                </el-table-column>
                <el-table-column label="主体" width="180" align="center">
                    <template slot-scope="scope">
                        <span>{{ getWXName(scope.row.weChatAppId) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="渠道" align="center" width="180">
                    <template slot-scope="scope">
                        <span>{{ scope.row.channelName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="文章" width="250" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.articleTitle }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button class="btn-primary" type="text" size="mini" @click="showQrcode(scope.row.qrCodeUrl)">下载二维码</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page + 1" :page-sizes="[10, 20, 50, 100]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
        </div>
        <!-- dialog -->
        <!-- 公众号文章库 -->
        <el-dialog :visible.sync="dialogArticle" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" :before-close="cancel" title="公众号文章库" append-to-body width="700px">
            <article-library @sureClick="getInfo" @closeD="cancel"></article-library>
        </el-dialog>
        <!-- 二维码 -->
        <el-dialog :visible.sync="dialogQr" :close-on-click-modal="true" :before-close="cancel" title="二维码" append-to-body width="300px">
            <div class="qr">
                <qrcode-vue :value="qrUrl"></qrcode-vue>
            </div>
            <div id="qrCode" ref="qrCodeDiv"></div>
            <div slot="footer" class="dialog-footer">
                <el-button type="text" @click="cancel">取消</el-button>
                <!-- <el-button :loading="loading" type="primary" @click="submitChannel">确认</el-button> -->
            </div>
        </el-dialog>
        <!-- dialog -->
    </div>
</template>
<script>
import { listArticle, delArticle } from '@/api/wechat'
import { getWXList, getChannel, createQrArt, getChannelQrListArt } from '@/api/wechatChannel'
import ArticleLibrary from '@/views/components/ArticleLibrarySingle'

import QrcodeVue from 'qrcode.vue'
import moment from 'moment'

export default {
    data() {
        return {
            dialogArticle: false,
            dialogQr: false,
            qrUrl: '',

            WXList: [], //微信主体列表
            channelList: [], //渠道列表
            mainbodyAppid: '', //选中的微信主体
            channelId: '', //选中的渠道
            list: [], //文章码列表
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
            selectedArt: '' //选中的文章 单个
        }
    },
    components: { ArticleLibrary, QrcodeVue },

    created() {
        this.getWXList()
        this.getChannelList()
        this.getChannelQrListFun()
    },
    methods: {
        //设置表头行的样式
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            return 'font-size:12px;text-align:center;padding:2px 0;background:#f7f7f7;'
        },
        // 查询微信配置列表
        getWXList() {
            getWXList()
                .then(res => {
                    console.log('GOOGLE: res', res)
                    this.WXList = res
                })
                .catch(err => {
                    // console.log(err.response.data.message)
                })
        },
        // 获取渠道列表
        getChannelList() {
            getChannel()
                .then(res => {
                    console.log('GOOGLE: getChannelList -> res', res)

                    this.channelList = res.content
                })
                .catch(err => {
                    // console.log(err.response.data.message)
                })
        },
        // 弹窗相关
        getInfo(info) {
            console.log('GOOGLE: getInfo -> info', info)
            // this.zt.articleList.push(...info)
            this.selectedArt = info
            this.cancel()
        },
        cancel() {
            this.dialogArticle = false
        },
        add() {
            if (!this.channelId || !this.mainbodyAppid || !this.selectedArt) {
                this.$notify({
                    title: '请选择主体,渠道和文章',
                    type: 'error',
                    duration: 2500
                })
                return
            }
            // 根据id查找对应的channel code name
            let selectedChannel = {}
            for (let i = 0; i < this.channelList.length; i++) {
                if (this.channelId == this.channelList[i].id) {
                    selectedChannel = this.channelList[i]
                }
            }
            createQrArt(selectedChannel.channelCode, selectedChannel.channelName, this.mainbodyAppid, selectedChannel.id, this.selectedArt.id)
                .then(res => {
                    this.$notify({
                        title: '添加成功',
                        type: 'success',
                        duration: 2500
                    })
                    this.getChannelQrListFun()
                })
                .catch(err => {
                    // console.log(err.response.data.message)
                })
        },
        // 获取二维码列表 中间的列表
        getChannelQrListFun() {
            getChannelQrListArt(this.listQuery.page, this.listQuery.size)
                .then(res => {
                    console.log('GOOGLE: getChannelQrListFun', res)
                    this.list = res.content
                    this.total = res.totalElements
                })
                .catch(err => {
                    // console.log(err.response.data.message)
                })
        },
        // 根据appid获取微信主体名称
        getWXName(appid) {
            for (let i = 0; i < this.WXList.length; i++) {
                if (appid == this.WXList[i].appId) return this.WXList[i].name
            }
        },
        // 显示二维码
        showQrcode(url) {
            this.dialogQr = true
            this.qrUrl = url
            // this.bindQRCode(url);
        },
        cancel() {
            this.dialogArticle = false
            this.dialogQr = false
        },

        // 搜索
        // handleFilter() {
        //     this.listQuery.page = 0
        //     this.getChannelQrListFun()
        // },
        // 分页方法
        handleSizeChange(val) {
            this.listQuery.size = val
            this.getChannelQrListFun()
        },
        handleCurrentChange(val) {
            this.listQuery.page = val - 1
            this.getChannelQrListFun()
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
.qr {
    text-align: center;
}
</style>
