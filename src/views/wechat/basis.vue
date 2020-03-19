<template>
    <div class="app-container">
        <div class="head-container topInfo">
            <el-form :inline="true">
                <el-form-item label="当前公众号：">
                    <span class="info">{{ topInfo.name }}</span>
                </el-form-item>
                <el-form-item label="类型：">
                    <span class="info">{{ topInfo.type }}</span>
                </el-form-item>
                <el-form-item label="当月已群发次数：">
                    <span class="info">
                        {{ topInfo.publishedCountInMonth }}
                    </span>
                </el-form-item>
                <el-form-item label="剩余群发次数：">
                    <span class="info">{{ topInfo.publishCountRemain }}</span>
                </el-form-item>
                <el-form-item label="粉丝数：">
                    <span class="info">{{ topInfo.userTotalCount }}</span>
                </el-form-item>
                <el-form-item label="7日新增粉丝：">
                    <span class="info">{{ topInfo.userCount7Days }}</span>
                </el-form-item>
            </el-form>
        </div>
        <div class="tableList">
            <!-- 微信主体列表 -->
            <div class="tableWrap">
                <el-form :inline="true">
                    <el-form-item label="">
                        <el-button size="small" type="primary" icon="el-icon-plus" @click="addWX">新增主体</el-button>
                    </el-form-item>
                </el-form>
                <el-table :data="list" v-loading.body="listLoading" :header-cell-style="tableHeaderColor" element-loading-text="Loading" border fit highlight-current-row>
                    <el-table-column align="center" label="序号" width="95">
                        <template slot-scope="scope">
                            {{ scope.row.id }}
                        </template>
                    </el-table-column>
                    <el-table-column label="名称" width="180" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="类型" align="center" width="120">
                        <template slot-scope="scope">
                            <span>{{ scope.row.type }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="180" align="center">
                        <template slot-scope="scope">
                            <el-button class="btn-primary" type="text" size="mini" @click="editWX(scope.row.id)">修改</el-button>
                            <el-button class="btn-warning" type="text" size="mini" @click="switchWX(scope.row.id)" :disabled="scope.row.activated">切换</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 二维码列表 -->
            <div class="tableWrap">
                <el-form :inline="true">
                    <el-form-item label="主体">
                        <el-select v-model="mainbodyAppid" placeholder="请选择">
                            <el-option v-for="item in list" :key="item.appId" :label="item.name" :value="item.appId"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="渠道">
                        <el-select v-model="channelId" placeholder="请选择">
                            <el-option v-for="item in channelList" :key="item.id" :label="item.channelName" :value="item.id"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button size="small" type="primary" icon="el-icon-plus" @click="addQrFun">新增</el-button>
                    </el-form-item>
                </el-form>
                <el-table :data="channelQrList" v-loading.body="listLoading" :header-cell-style="tableHeaderColor" element-loading-text="Loading" border fit highlight-current-row>
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
                    <el-table-column label="渠道" align="center" width="120">
                        <template slot-scope="scope">
                            <span>{{ scope.row.channelName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="180" align="center">
                        <template slot-scope="scope">
                            <el-button class="btn-primary" type="text" size="mini" @click="showQrcode(scope.row.qrCodeUrl)">下载二维码</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 渠道列表 -->
            <div class="tableWrap">
                <el-form :inline="true">
                    <el-form-item label="">
                        <el-button size="small" type="primary" icon="el-icon-plus" @click="addChannel">新增渠道</el-button>
                    </el-form-item>
                </el-form>
                <el-table :data="channelList" v-loading.body="listLoading" :header-cell-style="tableHeaderColor" element-loading-text="Loading" border fit highlight-current-row>
                    <el-table-column align="center" label="序号" width="95">
                        <template slot-scope="scope">
                            {{ scope.row.id }}
                        </template>
                    </el-table-column>
                    <el-table-column label="渠道编码" width="180" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.channelCode }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="渠道名称" align="center" width="120">
                        <template slot-scope="scope">
                            <span>{{ scope.row.channelName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="180" align="center">
                        <template slot-scope="scope">
                            <el-button class="btn-danger" type="text" size="mini" @click="deleleChannelFun(scope.row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!-- dialog -->
        <!-- 新增左侧列表 微信 -->
        <el-dialog :visible.sync="dialogWX" :close-on-click-modal="false" :before-close="cancel" title="新建" append-to-body width="500px">
            <el-form :inline="true" ref="formWX" :model="formWX" :rules="rulesWX" size="small" label-position="right" label-width="140px">
                <el-form-item label="公众号名称" prop="name">
                    <el-input v-model="formWX.name" style="width: 260px;" />
                </el-form-item>
                <el-form-item label="公众号类型" prop="type">
                    <!-- <el-input v-model="formWX.type" style="width: 260px;" /> -->
                    <el-select v-model="formWX.type" placeholder="请选择">
                        <el-option v-for="item in optionsType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="appId" prop="appId">
                    <el-input v-model="formWX.appId" style="width: 260px;" />
                </el-form-item>
                <el-form-item label="appSecret" prop="appSecret">
                    <el-input v-model="formWX.appSecret" style="width: 260px;" />
                </el-form-item>
                <el-form-item label="token" prop="token">
                    <el-input v-model="formWX.token" style="width: 260px;" />
                </el-form-item>
                <el-form-item label="encodingAESKey" prop="encodingAESKey">
                    <el-input v-model="formWX.encodingAESKey" style="width: 260px;" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="text" @click="cancel">取消</el-button>
                <el-button :loading="loading" type="primary" @click="submitWX">确认</el-button>
            </div>
        </el-dialog>
        <!-- 新增右侧列表 渠道 -->
        <el-dialog :visible.sync="dialogChannel" :close-on-click-modal="false" :before-close="cancel" title="新建渠道" append-to-body width="500px">
            <el-form :inline="true" ref="formChannel" :model="formChannel" :rules="rulesChannel" size="small" label-position="right" label-width="140px">
                <el-form-item label="渠道编码" prop="channelCode">
                    <el-input v-model="formChannel.channelCode" style="width: 260px;" />
                </el-form-item>
                <el-form-item label="渠道名称" prop="channelName">
                    <el-input v-model="formChannel.channelName" style="width: 260px;" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="text" @click="cancel">取消</el-button>
                <el-button :loading="loading" type="primary" @click="submitChannel">确认</el-button>
            </div>
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
import { getWXList, addWXConfig, getCurrentConfig, getWXSingle, editWXConfig, activateWX, getChannel, addChannelReq, createQr, getChannelQrList, deleteChannel } from '@/api/wechatChannel'
import QrcodeVue from 'qrcode.vue'

export default {
    data() {
        return {
            mainbodyAppid: '', //选中的主体 appid
            channelId: '', //选中的渠道 id
            listLoading: false,
            loading: false,
            topInfo: [],
            editWXSingle: [],
            list: [], //微信主体列表
            channelList: [], //渠道列表
            channelQrList: [], //二维码列表

            dialogWX: false,
            dialogChannel: false,
            dialogQr: false,
            qrUrl: '',
            formWX: {
                id: '',
                appId: '',
                appSecret: '',
                name: '',
                token: '',
                type: '',
                encodingAESKey: ''
            },
            rulesWX: {
                appId: [{ required: true, message: '请输入内容', trigger: 'blur' }],
                appSecret: [{ required: true, message: '请输入内容', trigger: 'blur' }],
                name: [{ required: true, message: '请输入内容', trigger: 'blur' }],
                token: [{ required: true, message: '请输入内容', trigger: 'blur' }],
                type: [{ required: true, message: '请输入内容', trigger: 'blur' }]
                // encodingAESKey: [{ required: true, message: '请输入内容', trigger: 'blur' }]
            },
            formChannel: {
                channelCode: '',
                channelName: ''
            },
            rulesChannel: {
                channelCode: [{ required: true, message: '请输入内容', trigger: 'blur' }],
                channelName: [{ required: true, message: '请输入内容', trigger: 'blur' }]
            },
            optionsType: [
                {
                    value: '服务号',
                    label: '服务号'
                },
                {
                    value: '订阅号',
                    label: '订阅号'
                }
            ]
        }
    },
    components: {
        QrcodeVue
    },
    mounted() {
        this.getWXList()
        this.getTopInfo()
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
                    this.list = res
                })
                .catch(err => {
                    // console.log(err.response.data.message)
                })
        },
        // 查询微信配置 单个
        getWX(id) {
            getWXSingle(id)
                .then(res => {
                    this.formWX = res
                })
                .catch(err => {
                    // console.log(err.response.data.message)
                })
        },
        // 顶部信息条查询
        getTopInfo() {
            getCurrentConfig()
                .then(res => {
                    this.topInfo = res
                })
                .catch(err => {
                    // console.log(err.response.data.message)
                })
        },
        // 新增左侧公众号列表
        addWX() {
            this.dialogWX = true
        },
        // 编辑单个微信配置
        editWX(id) {
            this.formWX.id = id
            this.getWX(id)
            this.dialogWX = true
        },
        // 获取二维码列表 中间的列表
        getChannelQrListFun() {
            getChannelQrList()
                .then(res => {
                    console.log('GOOGLE: getChannelQrListFun', res)
                    this.channelQrList = res.content
                })
                .catch(err => {
                    // console.log(err.response.data.message)
                })
        },
        // 根据appid获取微信主体名称
        getWXName(appid) {
            for (let i = 0; i < this.list.length; i++) {
                if (appid == this.list[i].appId) return this.list[i].name
            }
        },
        // 新增二维码 中间的列表
        addQrFun() {
            if (!this.channelId || !this.mainbodyAppid) {
                this.$notify({
                    title: '请选择主体和渠道',
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
            createQr(selectedChannel.channelCode, selectedChannel.channelName, this.mainbodyAppid, selectedChannel.id)
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
        // 切换
        switchWX(id) {
            console.log('GOOGLE: id', id)
            activateWX(id)
                .then(res => {
                    this.$notify({
                        title: '切换成功',
                        type: 'success',
                        duration: 2500
                    })
                    this.getWXList()
                    this.getChannelList()
                    this.getTopInfo()
                })
                .catch(err => {
                    // console.log(err.response.data.message)
                })
        },

        submitWX() {
            if (this.formWX.id) {
                this.$refs['formWX'].validate(valid => {
                    if (valid) {
                        editWXConfig(this.formWX.id, this.formWX.appId, this.formWX.appSecret, this.formWX.name, this.formWX.token, this.formWX.type, this.formWX.encodingAESKey)
                            .then(res => {
                                this.$notify({
                                    title: '修改成功',
                                    type: 'success',
                                    duration: 2500
                                })
                                this.cancel()
                                this.getWXList()
                            })
                            .catch(err => {
                                // console.log(err.response.data.message)
                            })
                    } else {
                        this.$notify({
                            title: '请填写内容后提交',
                            type: 'error',
                            duration: 2500
                        })
                    }
                })
            } else {
                this.$refs['formWX'].validate(valid => {
                    if (valid) {
                        addWXConfig(this.formWX.appId, this.formWX.appSecret, this.formWX.name, this.formWX.token, this.formWX.type, this.formWX.encodingAESKey)
                            .then(res => {
                                this.$notify({
                                    title: '添加成功',
                                    type: 'success',
                                    duration: 2500
                                })
                                this.cancel()
                                this.getWXList()
                            })
                            .catch(err => {
                                // console.log(err.response.data.message)
                            })
                    } else {
                        this.$notify({
                            title: '请填写内容后提交',
                            type: 'error',
                            duration: 2500
                        })
                    }
                })
            }
        },
        cancel() {
            this.dialogWX = false
            this.dialogChannel = false
            this.dialogQr = false
            this.formWX = {
                id: '',
                appId: '',
                appSecret: '',
                name: '',
                token: '',
                type: '',
                encodingAESKey: ''
            }
            this.formChannel = {
                channelCode: '',
                channelName: ''
            }
        },
        // 获取右侧渠道列表
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
        // 打开弹窗
        addChannel() {
            this.dialogChannel = true
        },
        // 删除渠道
        deleleChannelFun(id) {
            this.$confirm(`确认删除选中的?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    console.log('GOOGLE: deleleChannelFun -> deleteChannel')
                    deleteChannel(id)
                        .then(res => {
                            this.$notify({
                                title: '删除成功',
                                type: 'success',
                                duration: 2500
                            })
                            this.getChannelList()
                        })
                        .catch(err => {
                            // console.log(err.response.data.message)
                        })
                })
                .catch(() => {})
        },
        // 提交新增渠道
        submitChannel() {
            this.$refs['formChannel'].validate(valid => {
                if (valid) {
                    addChannelReq(this.formChannel.channelCode, this.formChannel.channelName)
                        .then(res => {
                            this.$notify({
                                title: '添加成功',
                                type: 'success',
                                duration: 2500
                            })
                            this.cancel()
                            this.getChannelList()
                        })
                        .catch(err => {
                            // console.log(err.response.data.message)
                        })
                } else {
                    this.$notify({
                        title: '请填写内容后提交',
                        type: 'error',
                        duration: 2500
                    })
                }
            })
        },

        // 显示二维码
        showQrcode(url) {
            this.dialogQr = true
            this.qrUrl = url
            // this.bindQRCode(url);
        }
    }
}
</script>
<style scoped="scoped">
.app-container .tableList {
    display: flex;
    flex-wrap: wrap;
    /* justify-content: space-around; */
}
.app-container .tableWrap {
    margin-right: 10px;
    margin-bottom: 20px;
}
.topInfo .el-form-item {
    margin-right: 28px;
}
.topInfo .info {
    color: #ff631d;
}
.qr {
    width: 100%;
    text-align: center;
}
.qrcode canvas {
    width: 150px !important;
    height: 150px !important;
    text-align: center;
}
</style>
