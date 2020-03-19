<template>
    <div class="app-container">
        <div class="head-container topInfo">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="当前公众号：">
                    <span class="info">{{ topInfo.name }}</span>
                </el-form-item>
                <el-form-item label="" style="float:right">
                    <router-link to="/wechat/basis">去设置 >></router-link>
                </el-form-item>
            </el-form>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="关注回复" name="first"></el-tab-pane>
            <el-tab-pane label="关键词回复" name="second"></el-tab-pane>
        </el-tabs>
        <div class="tableWrap">
            <el-button size="small" type="primary" icon="el-icon-plus" @click="addWX" style="margin-bottom:12px;">新增</el-button>
            <el-table :data="list" v-loading.body="listLoading" :header-cell-style="tableHeaderColor" element-loading-text="Loading" border fit highlight-current-row>
                <el-table-column align="center" :label="keywordMsg ? '关键词' : '时间(s)'" width="95">
                    <template slot-scope="scope">
                        {{ keywordMsg ? scope.row.keyword : scope.row.timeout }}
                    </template>
                </el-table-column>
                <el-table-column label="类型" align="center" width="180">
                    <template slot-scope="scope">
                        <span>{{ retuenText(scope.row.type) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="回复消息" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.type == 'text'">{{ scope.row.content }}</span>
                        <span v-if="scope.row.type == 'image'">[图片消息]</span>
                        <span v-if="scope.row.type == 'mpnews'">[图文消息]</span>
                        <span v-if="scope.row.type == 'miniprogrampage'">[小程序]</span>
                    </template>
                </el-table-column>
                <el-table-column label="图片" align="center" width="200">
                    <template slot-scope="scope">
                        <img class="simg" :src="scope.row.imgUrl" alt="" v-if="scope.row.type == 'image'" />
                        <img class="simg" :src="scope.row.picUrl" alt="" v-if="scope.row.type == 'mpnews'" />
                        <img class="simg" :src="scope.row.thumbUrl" alt="" v-if="scope.row.type == 'miniprogrampage'" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button class="btn-primary" type="text" size="mini" @click.native="editWX(scope.$index)">修改</el-button>
                        <el-button class="btn-danger" type="text" size="mini" @click.native="delWX(scope.row.id, scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page + 1" :page-sizes="[10, 20, 50, 100]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
        </div>
        <!-- dialog -->
        <el-dialog :visible.sync="dialogWX" :close-on-click-modal="false" :before-close="cancel" :title="formWX.id ? '修改' : '新增'" append-to-body width="500px">
            <el-form :model="formWX" :rules="rules" ref="formRef" :inline="true" size="small" label-position="right" label-width="140px">
                <el-form-item label="关键词" prop="keyword" v-if="keywordMsg">
                    <el-input v-model="formWX.keyword" style="width: 260px;" />
                </el-form-item>
                <el-form-item label="关注后间隔(s)" prop="timeout" v-if="!keywordMsg">
                    <el-input-number v-model="formWX.timeout" :min="0" :max="1000" label="秒" style="width: 200px;"></el-input-number>
                </el-form-item>
                <el-form-item label="回复消息类型" prop="type">
                    <el-select v-model="formWX.type" placeholder="请选择" style="width: 200px;">
                        <el-option v-for="item in optionsType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="图文消息地址"  v-if="formWX.type == 'image'">
                    <el-input v-model="formWX.imgUrl" style="width: 260px;" />
                </el-form-item> -->
                <el-form-item label="消息内容" prop="content" v-if="formWX.type == 'text'">
                    <el-input v-model="formWX.content" style="width: 260px;" />
                </el-form-item>
                <el-form-item label="appId" prop="appId" v-if="formWX.type == 'miniprogrampage'">
                    <el-input v-model="formWX.appId" style="width: 260px;" />
                </el-form-item>
                <el-form-item label="卡片标题" prop="title" v-if="formWX.type == 'miniprogrampage' || formWX.type == 'mpnews'">
                    <el-input v-model="formWX.title" style="width: 260px;" />
                </el-form-item>
                <el-form-item label="小程序路径" prop="pagePath" v-if="formWX.type == 'miniprogrampage'">
                    <el-input v-model="formWX.pagePath" style="width: 260px;" />
                </el-form-item>
                <!-- <el-form-item label="卡片封面"  v-if="formWX.type == 'mini'">
                    <el-input v-model="formWX.thumbUrl" style="width: 260px;" />
                </el-form-item> -->
                <el-form-item label="卡片封面" prop="thumbMediaId" v-if="formWX.type == 'miniprogrampage'">
                    <el-input v-model="formWX.thumbMediaId" style="width: 260px;" />
                </el-form-item>
                <el-form-item label="描述" prop="description" v-if="formWX.type == 'mpnews'">
                    <el-input v-model="formWX.description" style="width: 260px;" />
                </el-form-item>
                <!-- <el-form-item label="图片"  v-if="formWX.type == 'mini'">
                    <el-input v-model="formWX.picUrl" style="width: 260px;" />
                </el-form-item> -->
                <el-form-item label="链接" prop="url" v-if="formWX.type == 'mpnews'">
                    <el-input v-model="formWX.url" style="width: 260px;" />
                </el-form-item>
                <el-form-item label="图片上传" prop="file" v-if="formWX.type == 'miniprogrampage' || formWX.type == 'mpnews' || formWX.type == 'image'">
                    <el-upload :before-upload="beforePicUpload" :on-success="handleSuccess" :headers="headers" :action="uploadImg" :show-file-list="false" class="upload-demo">
                        <el-button size="small" type="primary" style="float:left">点击上传</el-button>
                        <div class="fileList">
                            <el-form-item class="piclabel" label="">
                                <div class="filename" v-if="filename"><i class="el-icon-document"></i>{{ filename }}</div>
                                <img class="showimg" :src="file" alt="" />
                            </el-form-item>
                        </div>
                        <div slot="tip" style="display: block;" class="el-upload__tip">tips:请上传图片，且文件不超过2M <br />一次只能上传一个文件，后上传的文件将覆盖之前的文件</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="text" @click="cancel">取消</el-button>
                <el-button :loading="loading" type="primary" @click="submitWX">确认</el-button>
            </div>
        </el-dialog>
        <!-- dialog -->
    </div>
</template>

<script>
import { getCurrentConfig, getReplyList, addReply, editReply, deleteReply, sourceUploadImages } from '@/api/wechat'
import { getToken } from '@/utils/auth'

export default {
    data() {
        return {
            uploadImg: sourceUploadImages,
            headers: { Authorization: ' ' + getToken() },

            activeName: 'first',
            listLoading: false,
            loading: false,
            list: [],
            topInfo: [],
            listQuery: {
                page: 0,
                size: 10
            },
            total: 0,
            dialogWX: false,

            formWX: {
                id: '',
                content: '',
                imgUrl: '',
                keyword: '',
                type: '',
                weChatAppId: '',
                timeout: 0,
                title: '',
                appId: '',
                pagePath: '',
                thumbUrl: '',
                thumbMediaId: '',
                description: '',
                picUrl: '',
                url: ''
            },
            keywordMsg: false,
            file: '',
            filename: '',

            rules: {
                keyword: [{ required: true, message: '请输入内容', trigger: 'blur' }],
                timeout: [{ required: true, message: '请输入内容', trigger: 'blur' }],
                type: [{ required: true, message: '请选择内容', trigger: 'blur' }],
                content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
                appId: [{ required: true, message: '请输入appId', trigger: 'blur' }],
                title: [{ required: true, message: '请输入卡片标题', trigger: 'blur' }],
                pagePath: [{ required: true, message: '请输入小程序路径', trigger: 'blur' }],
                thumbMediaId: [{ required: true, message: '请输入卡片封面', trigger: 'blur' }],
                description: [{ required: true, message: '请输入秒数', trigger: 'blur' }],
                url: [{ required: true, message: '请输入链接', trigger: 'blur' }],
                file: [{ required: true, message: '请上传图片', trigger: 'blur' }]
            },

            optionsType: [
                {
                    value: 'image',
                    label: '图片'
                },
                {
                    value: 'text',
                    label: '文字消息'
                },
                {
                    value: 'mpnews',
                    label: '图文'
                },
                {
                    value: 'miniprogrampage',
                    label: '小程序'
                }
            ]
        }
    },

    mounted() {
        this.getTopInfo()
        this.getList()

        // this.getChannelList()
    },

    methods: {
        //设置表头行的样式
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            return 'font-size:12px;text-align:center;padding:2px 0;background:#f7f7f7;'
        },
        // 然后type中文
        retuenText(data) {
            let text = ''
            switch (data) {
                case 'image':
                    text = '图片'
                    break
                case 'text':
                    text = '文字'
                    break
                case 'mpnews':
                    text = '图文'
                    break
                case 'miniprogrampage':
                    text = '小程序'
                    break
                default:
                    break
            }
            return text
        },
        // 查询列表
        getList() {
            getReplyList(this.listQuery.page, this.listQuery.size, this.keywordMsg)
                .then(res => {
                    console.log('GOOGLE: 查询列表', res)
                    this.total = res.totalElements
                    this.list = res.content
                    // 将content解析并赋值给各字段 用作编辑的显示和处理
                    for (let i = 0; i < this.list.length; i++) {
                        switch (this.list[i].type) {
                            case 'image':
                                break
                            case 'text':
                                break
                            case 'mpnews':
                                var str = this.list[i].content
                                str = JSON.parse(str)
                                this.$set(this.list[i], 'title', str.title)
                                this.$set(this.list[i], 'description', str.description)
                                this.$set(this.list[i], 'picUrl', str.picUrl)
                                this.$set(this.list[i], 'url', str.url)
                                break
                            case 'miniprogrampage':
                                var str = this.list[i].content
                                str = JSON.parse(str)
                                this.$set(this.list[i], 'title', str.title)
                                this.$set(this.list[i], 'appId', str.appId)
                                this.$set(this.list[i], 'thumbUrl', str.thumbUrl)
                                this.$set(this.list[i], 'thumbMediaId', str.thumbMediaId)
                                this.$set(this.list[i], 'pagePath', str.pagePath)
                                break
                            default:
                                break
                        }
                    }
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
        // 新增
        addWX() {
            this.dialogWX = true
            this.file = ''
            this.filename = ''
            this.formWX = {
                id: '',
                content: '',
                imgUrl: '',
                keyword: '',
                type: '',
                weChatAppId: '',
                timeout: 0,
                title: '',
                appId: '',
                pagePath: '',
                thumbUrl: '',
                thumbMediaId: '',
                description: '',
                picUrl: '',
                url: ''
            }
        },
        // 编辑
        editWX(index) {
            this.dialogWX = true
            this.formWX = this.list[index]
            // 取到上传的图片链接 用作显示和处理
            var obj = {}
            switch (this.list[index].type) {
                case 'image':
                    this.filename = this.formWX.imgUrl
                    this.file = this.formWX.imgUrl
                    break
                case 'text':
                    break
                case 'mpnews':
                    this.filename = this.formWX.picUrl
                    this.file = this.formWX.picUrl
                    break
                case 'miniprogrampage':
                    this.filename = this.formWX.thumbUrl
                    this.file = this.formWX.thumbUrl
                    break
                default:
                    break
            }
        },
        // 删除
        delWX(id, index) {
            this.$confirm('此操作将删除这条信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteReply(id)
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

        submitWX() {
            // 验证数据
            this.$refs['formRef'].validate(valid => {
                // 验证表单内容
                if (valid) {
                    this.submitWXFun()
                } else {
                    this.$notify({
                        title: '请填写信息后再提交',
                        type: 'warning',
                        duration: 2500
                    })
                }
            })
        },
        submitWXFun() {
            // 将上传的图片链接 赋给选择的类型的字段
            // 同时处理 图文 小程序的字段 拼接到content
            var obj = {}
            switch (this.formWX.type) {
                case 'image':
                    this.formWX.imgUrl = this.file
                    break
                case 'text':
                    break
                case 'mpnews':
                    this.formWX.picUrl = this.file
                    obj = {
                        title: this.formWX.title,
                        description: this.formWX.description,
                        picUrl: this.formWX.picUrl,
                        url: this.formWX.url
                    }
                    this.formWX.content = JSON.stringify(obj)
                    break
                case 'miniprogrampage':
                    this.formWX.thumbUrl = this.file
                    obj = {
                        title: this.formWX.title,
                        appId: this.formWX.appId,
                        thumbUrl: this.formWX.thumbUrl,
                        thumbMediaId: this.formWX.thumbMediaId,
                        pagePath: this.formWX.pagePath
                    }
                    this.formWX.content = JSON.stringify(obj)
                    break
                default:
                    break
            }
            if (this.formWX.id) {
                // 修改
                editReply(this.formWX.id, this.formWX.content, this.formWX.imgUrl, this.formWX.keyword, this.formWX.type, this.topInfo.appId, this.keywordMsg, this.formWX.timeout)
                    .then(res => {
                        this.$notify({
                            title: '编辑成功',
                            type: 'success',
                            duration: 2500
                        })
                    })
                    .catch(err => {
                        // console.log(err.response.data.message)
                    })
            } else {
                // 新增
                addReply(
                    this.formWX.content,
                    this.formWX.imgUrl,
                    this.formWX.keyword,
                    this.formWX.type,
                    this.topInfo.appId,
                    this.keywordMsg,
                    this.formWX.timeout
                    // this.formWX.title,
                    // this.formWX.appId,
                    // this.formWX.pagePath,
                    // this.formWX.thumbUrl,
                    // this.formWX.thumbMediaId,
                    // this.formWX.description,
                    // this.formWX.picUrl,
                    // this.formWX.url
                )
                    .then(res => {
                        this.$notify({
                            title: '添加成功',
                            type: 'success',
                            duration: 2500
                        })
                        this.getList()
                    })
                    .catch(err => {
                        // console.log(err.response.data.message)
                    })
            }
        },
        cancel() {
            this.dialogWX = false

            this.formWX = {
                id: '',
                appId: '',
                appSecret: '',
                name: '',
                token: '',
                type: '',
                encodingAESKey: ''
            }
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
        handleSuccess(response, file, fileList) {
            console.log('GOOGLE: response, file, fileList', response, file, fileList)
            this.file = response.data
            this.filename = file.name
            this.$notify({
                title: '文件上传成功',
                type: 'success',
                duration: 2500
            })
        },
        // 图片上传前判断
        beforePicUpload(file) {
            let typeArr = ['image/jpeg', 'image/png']
            const isJPG = typeArr.includes(file.type)
            const isLt2M = file.size / 1024 / 1024 < 5

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 图片 格式!')
            }
            if (!isLt2M) {
                this.$message.error('上传文件大小不能超过 2MB!')
            }
            return isJPG && isLt2M
        },
        handleClick(tab) {
            if (tab.index == 0) {
                this.keywordMsg = false
            } else {
                this.keywordMsg = true
            }

            this.listQuery.page = 0
            this.getList()
        }
    }
}
</script>
<style scoped="scoped">
/* .app-container .tableList {
    display: flex;
    justify-content: space-around;
} */
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
.piclabel >>> .el-form-item__label {
    text-align: left;
}
.piclabel >>> .el-form-item__content {
    text-align: left;
}
.filename {
    text-align: left;
}
.showimg {
    width: 150px;
    text-align: left;
}
.simg {
    width: 160px;
}
</style>
