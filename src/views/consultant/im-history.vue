<template>
    <div class="app-container">
        <el-form ref="formRef" :inline="true" label-position="right" label-width="55px">
            <div class="filter-container">
                <el-form-item label="顾问" prop="title">
                    <el-select v-model="adId" placeholder="选择顾问" @change="getSesList">
                        <el-option v-for="(item, index) in adList" :key="index" :label="item.name" :value="item.id"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="时间" prop="title">
                    <el-date-picker v-model="date" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
                </el-form-item>
                <el-form-item label="" prop="title">
                    <el-button size="small" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
                </el-form-item>
            </div>
        </el-form>
        <div class="chat">
            <div class="list">
                <div class="cell" v-for="(item, index) in customerList" :key="index">
                    <div class="item" @click="sessionClick(item.customerId, item.customerHeadImgUrl, true)">
                        <div class="img imghis">
                            <img class="timg" :src="item.customerHeadImgUrl" alt="" />
                        </div>
                        <div class="info">
                            <p class="line1">
                                {{ item.customerNickname }}
                                <span class="stime">{{ item.lastMsgTime }}</span>
                            </p>
                            <p class="line2">{{ item.lastMsgContent }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="record">
                <el-input style="width: 100%; max-width:700px;" @keyup.enter.native="" placeholder="搜索" v-model="content"></el-input>
                <!--mescroll滚动区域的基本结构-->
                <div class="none" v-show="allData">已加载全部</div>
                <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
                    <!--内容...-->
                    <div id="message" class="message">
                        <ul>
                            <li v-for="(item, index) in msgList" :key="index">
                                <p class="time">
                                    <span>{{ item.createTime }}</span>
                                </p>
                                <div class="leftmsg" v-if="item.direction == 'RECEIVE'">
                                    <!-- <span class="ltime">{{ item.createTime }}</span> -->
                                    <div class="main">
                                        <div class="avatarplace"></div>
                                        <img class="avatar" width="40" height="40" :src="cTimg" />
                                        <div class="text" v-html="item.content"></div>
                                    </div>
                                </div>
                                <div class="rightmsg" v-if="item.direction == 'REPLY'">
                                    <!-- <span class="rtime">{{ item.createTime }}</span> -->
                                    <div class="main self">
                                        <div class="avatarplace"></div>
                                        <img class="avatar" width="40" height="40" :src="aTimg" />
                                        <div class="text" v-html="item.content"></div>
                                        <!-- <div class="text" v-html="item.content" v-if="item.type == ''"></div>
                                        <div class="textimg" v-html="item.content" v-if="item.type == 2" @click.capture="showPopImg(item.content)"></div>
                                        <div class="textlink" v-html="item.content" v-if="item.type == 3"></div> -->
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </mescroll-vue>
                <div class="tips">
                    tips:下拉刷新
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { getAllAdviser, getMessage, getSession } from '@/api/consult'

import MescrollVue from 'mescroll.js/mescroll.vue'
export default {
    data() {
        return {
            mescroll: null, // mescroll实例对象
            mescrollDown: {
                callback: this.getMsgList,
                noMoreSize: 3, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
                empty: {
                    //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
                    // warpId: "xxid", //父布局的id (1.3.5版本支持传入dom元素)
                    // icon: "./static/mescroll/mescroll-empty.png", //图标,默认null,支持网络图
                    tip: '暂无相关数据~' //提示
                },
                toTop: {
                    src: './static/mescroll/mescroll-totop.png' // 配置回到顶部按钮
                },
                page: {
                    num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
                    size: 20 // 每页数据的数量
                },
                htmlNodata: '<p class="upwarp-nodata">-- 我是有底线的 --</p>',
                auto: false
            },
            //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
            mescrollUp: {
                use: false
            },
            list: null,
            date: '', //搜索时间
            content: '', //搜索内容
            total: 0,
            // allPage: 0,
            sort: 'id,desc', //排序
            listLoading: false,
            listQuery: {
                page: 0,
                size: 5
            },
            allData: false,
            adId: '', //选中的顾问id
            adList: [], //顾问列表
            customerId: '', //选中的会话列表
            customerList: [], //会话列表
            msgList: [], //消息列表
            cTimg: '', //用户头像
            aTimg: '', //顾问头像
            search: ''
        }
    },
    components: {
        MescrollVue // 注册mescroll组件
    },
    created() {
        this.getAdList()
    },
    methods: {
        // getList() {
        //     getProductList(this.listQuery.page, this.listQuery.size, this.name, this.companyId, this.insureAge, this.selling)
        //         .then(res => {
        //             this.list = res.content
        //             this.total = res.totalElements
        //         })
        //         .catch(err => {
        //             // console.log(err.response.data.message)
        //         })
        // },
        // 选择顾问 生成会话列表 并获取顾问头像
        getSesList() {
            this.msgList = []
            for (let i = 0; i < this.adList.length; i++) {
                if (this.adList[i].id == this.adId) {
                    this.aTimg = this.adList[i].avatar
                }
            }
            getSession(this.adId)
                .then(res => {
                    this.customerList = res.content
                })
                .catch(err => {
                    // console.log(err.response.data.message)
                })
        },
        // 获取聊天列表 并获取用户头像 id
        getMsgList() {
            if (!this.customerId || !this.adId) {
                this.$notify({
                    title: '请选择用户和顾问',
                    type: 'error',
                    duration: 2500
                })
                this.mescroll.endByPage()

                return
            }
            getMessage(this.sort, this.adId, this.customerId, this.content, this.date[0], this.date[1], this.listQuery.page, this.listQuery.size)
                .then(res => {
                    console.log('GOOGLE: getMsgList -> res', res)
                    console.log('GOOGLE:', this.listQuery.page)
                    let allPage = Math.ceil(res.totalElements / this.listQuery.size) - 1
                    if (this.listQuery.page > allPage) {
                        this.allData = true
                    } else if (this.listQuery.page == allPage) {
                        this.listQuery.page++
                        this.allData = true
                        this.msgList.unshift(...res.content.reverse())
                    } else {
                        this.listQuery.page++
                        this.msgList.unshift(...res.content.reverse())
                    }
                    // 数据渲染成功后,隐藏下拉刷新的状态
                    this.$nextTick(() => {
                        this.mescroll.endByPage(res.content, res.totalElements)
                    })
                })
                .catch(err => {
                    this.mescroll.endErr()

                    // console.log(err.response.data.message)
                })
        },
        // 获取所有顾问
        getAdList() {
            getAllAdviser()
                .then(res => {
                    this.adList = res.content
                })
                .catch(err => {
                    // console.log(err.response.data.message)
                })
        },
        // 选择会话列表
        sessionClick(customerId, img, setDate) {
            this.customerId = customerId
            this.cTimg = img
            //重试字段 消息列表 分页 全部加载显示
            this.msgList = []
            this.listQuery.page = 0
            this.allData = false
            // 选择用户重置搜索条件
            if (setDate) {
                this.date = ''
                this.content = ''
            }
            this.mescroll.resetUpScroll(false)
            this.mescroll.triggerDownScroll()
        },
        // 搜索
        handleFilter() {
            // if (!this.customerId || !this.adId) {
            //     this.$notify({
            //         title: '请选择用户和顾问',
            //         type: 'error',
            //         duration: 2500
            //     })
            //     return
            // }
            // if (!this.date) {
            //     this.$notify({
            //         title: '请选择时间',
            //         type: 'error',
            //         duration: 2500
            //     })
            //     return
            // }
            this.sessionClick(this.customerId, this.cTimg, false)
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
        mescrollInit(mescroll) {
            this.mescroll = mescroll // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
        }
    }
}
</script>
<style scoped="scoped">
.chat {
    display: flex;
    justify-content: space-between;
}
.chat .record {
    position: relative;
    padding-left: 40px;
    width: 100%;
}
.chat .list {
    flex-shrink: 0;
    width: 300px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}
.item {
    position: relative;
    display: flex;
    overflow: hidden;
    justify-content: flex-start;
    box-sizing: border-box;
    width: 100%;
    width: 100%;
    height: 80px;
    border-bottom: 1px solid #e6e6e6;
    background-color: #fff;
    font-size: 14px;
}
.item p {
    margin: 0;
}
.img {
    overflow: hidden;
    flex-grow: 0;
    /* flex-basis: 44px; */
    flex-shrink: 0;
    margin: 18px 0 0 12px;
    width: 44px;
    height: 44px;
    border-radius: 100px;
}
.imghis {
    border-radius: 0;
}
.info {
    flex-grow: 1;
    padding-left: 14px;
}
.item .time {
    flex-grow: 1;
    margin-top: 6px;
    margin-top: 18px;
    text-align: right;
    font-size: 12px;
}
.item .stime {
    float: right;
    padding-top: 4px;
    padding-right: 12px;
    color: #a8a8a8;
    font-size: 12px;
}
.item .line1 {
    margin-top: 18px;
    color: #000;
    /* max-width: 100px; */
    font-size: 17px;
}
.item .line2 {
    overflow: hidden;
    margin-top: 8px;
    max-width: 250px;
    max-height: 16px;
    color: #717171;
    font-size: 14px;
    line-height: 16px;
}
.item .timg {
    width: 100%;
    height: 100%;
}
.list {
    width: 100%;
}

.message {
    overflow-y: scroll;
    padding: 20px 15px 20px;
    height: 500px;
    background-color: #f7f7f7;
}
.message li {
    margin-bottom: 15px;
}
.message ul {
    margin: 0;
    padding: 0;
    list-style: none;
}
.message .main {
    position: relative;
    margin-bottom: 10px;
}
.message .time {
    margin: 7px 0;
    text-align: center;
}
.message .time > span {
    display: inline-block;
    padding: 3px 18px;
    border-radius: 2px;
    color: #fff;
    color: #c1c1c1;
    font-size: 12px;
    /* background-color: #dadada; */
}

.message .text >>> a {
    color: #fea03a;
}
.message .text {
    position: relative;
    /* position: absolute; */
    top: 0;
    display: inline-block;
    padding: 10px 14px;
    min-height: 30px;
    /* min-width: 30px; */
    max-width: calc(100% - 100px);
    border-radius: 16px 16px 0 16px;
    background-color: #fff;
    color: #666;
    text-align: left;
    word-break: break-all;
    font-size: 12px;
    line-height: 16px;
}
.message .leftmsg .text {
    border-radius: 16px 16px 16px 0;
}

.message .textimg img {
    border-radius: 16px 16px 0 16px;
}

/* .message .text:before {
    content: ' ';
    position: absolute;
    top: 9px;
    right: 100%;
    border: 6px solid transparent;
    border-right-color: #fafafa;
} */
.message .system {
    text-align: center;
}
.message .system .text {
    background-color: #dadada;
}
.message .self {
    text-align: right;
}
.message .avatar {
    position: absolute;
    bottom: -20px;
    float: left;
    margin: 0 10px 0 0;
    border-radius: 20px;
}
.message .leftmsg .avatar {
    left: 0;
}
.message .rightmsg .avatar {
    right: 0;
}
.message .avatarplace {
    float: left;
    margin: 0 10px 0 0;
    width: 40px;
    height: 40px;
    border-radius: 20px;
}
.message .self .avatar {
    float: right;
    margin: 0 0 0 10px;
}
.message .self .avatarplace {
    float: right;
    margin: 0 0 0 10px;
}

.message .self .text {
    background-color: #1da5fe;
    color: #fff;
}
.message .self .text:before {
    right: inherit;
    left: 100%;
    border-right-color: transparent;
    border-left-color: #1da5fe;
}
.mescroll {
    position: relative;
    /* margin-top: 10px; */
    max-width: 700px;
    width: 100%;
    height: auto;
}
.none {
    margin: 15px 0 10px;
    max-width: 700px;
    text-align: center;
    font-size: 12px;
}
</style>
