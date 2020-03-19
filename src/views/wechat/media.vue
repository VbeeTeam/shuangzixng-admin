<template>
    <div class="app-container">
        <div class="head-container">
            <el-input style="width: 200px;" @keyup.enter.native="handleFilter" placeholder="标题" v-model="title"></el-input>
            <el-input style="width: 200px;" @keyup.enter.native="handleFilter" placeholder="类型" v-model="author"></el-input>
            <el-date-picker style="width: 200px;" v-model="date" type="date" placeholder="创建时间" value-format="yyyy-MM-dd hh:mm:ss"> </el-date-picker>
        </div>
        <div class="head-container">
            <el-input style="width: 200px;" @keyup.enter.native="handleFilter" placeholder="分组" v-model="title"></el-input>
            <el-input style="width: 200px;" @keyup.enter.native="handleFilter" placeholder="标签" v-model="author"></el-input>
            <el-button size="small" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </div>
        <div class="filter-container">
            <el-button size="small" @click="dialogPic = true" type="primary" icon="el-icon-edit-outline">图片</el-button>
            <el-button size="small" @click="dialogMusic = true" type="primary" icon="el-icon-upload2">音频</el-button>
            <el-button size="small" @click="dialogVideo = true" type="primary" icon="el-icon-upload2">视频</el-button>
        </div>
        <div class="filter-container">
            <!-- <el-switch v-model="colPic"  inactive-text="" active-text="图片URL"> </el-switch> -->
        </div>
        <el-table :data="list" v-loading.body="listLoading" :header-cell-style="tableHeaderColor" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column align="center" label="序号" width="95">
                <template slot-scope="scope">
                    {{ scope.row.id }}
                </template>
            </el-table-column>
            <el-table-column label="标题" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.title }}</span>
                </template>
            </el-table-column>
            <el-table-column label="分组" align="center" width="120">
                <template slot-scope="scope">
                    <span>{{ scope.row.groupName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="类型" align="center" width="120">
                <template slot-scope="scope">
                    <span>{{ abstract(scope.row.fileType) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="URL" align="center" v-if="colPic">
                <template slot-scope="scope">
                    <template v-if="scope.row.fileType == 'image'">
                        <img class="timg" :src="scope.row.url" alt="" />
                    </template>
                    <template v-else>
                        <span>{{ abstract(scope.row.url) }}</span>
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" width="110" align="center">
                <template slot-scope="scope">
                    {{ formatTime(scope.row.createTime) }}
                </template>
            </el-table-column>

            <el-table-column label="操作" width="180" align="center">
                <template slot-scope="scope">
                    <el-button class="btn-warning" type="text" size="mini" @click.native="del(scope.row.id, scope.$index)" :disabled="scope.row.isDelete">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page + 1" :page-sizes="[10, 20, 50, 100]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
        </div>
        <!-- dialog -->
        <el-dialog :visible.sync="dialogPic" :close-on-click-modal="false" :before-close="cancel" title="图片上传" append-to-body width="500px">
            <el-form ref="formPic" :model="formPic" :rules="rulesPic" size="small" label-position="right" label-width="80px">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="formPic.title" style="width: 360px;" />
                </el-form-item>
                <el-form-item label="标签" prop="tag">
                    <el-input v-model="formPic.tag" style="width: 360px;" />
                </el-form-item>
                <el-form-item label="文件">
                    <el-upload :before-remove="handleBeforeRemove" :before-upload="beforePicUpload" :on-success="handleSuccess" :on-error="handleError" :headers="headers" :action="uploadImg" :show-file-list="false" class="upload-demo">
                        <div class="fileList">
                            <!-- <el-form-item label="文件"> -->
                            <div class="filename" v-if="filename"><i class="el-icon-document"></i>{{ filename }}</div>
                            <!-- </el-form-item> -->
                        </div>
                        <el-button size="small" type="primary" style="float:left">点击上传</el-button>
                        <div slot="tip" style="display: block;" class="el-upload__tip">tips:请上传图片，且文件不超过2M <br />一次只能上传一个文件，后上传的文件将覆盖之前的文件</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="text" @click="cancel">取消</el-button>
                <el-button :loading="loading" type="primary" @click="submitPic">确认</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="dialogMusic" :close-on-click-modal="false" :before-close="cancel" title="音频上传" append-to-body width="500px">
            <el-form ref="formMusic" :model="formMusic" :rules="rulesMusic" label-position="right" label-width="80px">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="formMusic.title" style="width: 360px;" />
                </el-form-item>
                <el-form-item label="标签" prop="tag">
                    <el-input v-model="formMusic.tag" style="width: 360px;" />
                </el-form-item>
                <el-form-item label="分组">
                    <el-input v-model="formMusic.groupName" style="width: 360px;" />
                </el-form-item>
                <el-form-item label="文件">
                    <el-upload :before-remove="handleBeforeRemove" :before-upload="beforeMusicUpload" :on-success="handleSuccess" :on-error="handleError" :headers="headers" :action="uploadImg" class="upload-demo" :show-file-list="false">
                        <div class="fileList">
                            <!-- <el-form-item label="文件"> -->
                            <div class="filename" v-if="filename"><i class="el-icon-document"></i>{{ filename }}</div>
                            <!-- </el-form-item> -->
                        </div>
                        <el-button size="small" type="primary" style="float:left">点击上传</el-button>
                        <div slot="tip" style="display: block;" class="el-upload__tip">tips:请上传音频，且文件不超过2M <br />一次只能上传一个文件，后上传的文件将覆盖之前的文件</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="text" @click="cancel">取消</el-button>
                <el-button :loading="loading" type="primary" @click="submitMusic">确认</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="dialogVideo" :close-on-click-modal="false" :before-close="cancel" title="视频上传" append-to-body width="500px">
            <el-form ref="formVideo" :model="formVideo" :rules="rulesVideo" size="small" label-position="right" label-width="80px">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="formVideo.title" style="width: 360px;" />
                </el-form-item>
                <el-form-item label="标签" prop="tag">
                    <el-input v-model="formVideo.tag" style="width: 360px;" />
                </el-form-item>
                <el-form-item label="分组">
                    <el-input v-model="formVideo.groupName" style="width: 360px;" />
                </el-form-item>
                <el-form-item label="介绍">
                    <el-input type="textarea" v-model="formVideo.description" style="width: 360px;"></el-input>
                </el-form-item>
                <el-form-item label="文件">
                    <el-upload :before-remove="handleBeforeRemove" :before-upload="beforeVideoUpload" :on-success="handleSuccess" :on-error="handleError" :headers="headers" :action="uploadImg" class="upload-demo" :show-file-list="false">
                        <div class="fileList">
                            <!-- <el-form-item label="文件"> -->
                            <div class="filename" v-if="filename"><i class="el-icon-document"></i>{{ filename }}</div>
                            <!-- </el-form-item> -->
                        </div>
                        <el-button size="small" type="primary" style="float:left">点击上传</el-button>
                        <div slot="tip" style="display: block;" class="el-upload__tip">tips:请上传视频，且文件不超过2M <br />一次只能上传一个文件，后上传的文件将覆盖之前的文件</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="text" @click="cancel">取消</el-button>
                <el-button :loading="loading" type="primary" @click="submitVideo">确认</el-button>
            </div>
        </el-dialog>
        <!-- dialog -->
    </div>
</template>
<script>
import { listMedia, delMedia, uploadImg, mediaUpload } from '@/api/wechat'
import { getToken } from '@/utils/auth'

import moment from 'moment'

export default {
    data() {
        return {
            list: null,
            date: '',
            total: 0,
            listLoading: false,
            loading: false,

            listQuery: {
                page: 0,
                size: 10
            },
            // requset param
            title: '',
            author: '',
            categoryList: [], //类目列表
            category_id: [], //选中的类目
            group: '',
            tag: '',
            // 上传
            dialogVisible: false,
            dialogImageUrl: '',
            uploadImg: uploadImg,
            file: '',
            filename: '',
            headers: { Authorization: ' ' + getToken() },
            //dialog
            dialogPic: false,
            dialogMusic: false,
            dialogVideo: false,
            // dialog form
            formPic: {
                title: '',
                tag: '',
                groupName: '',
                description: ''
            },
            formMusic: {
                title: '',
                tag: '',
                groupName: '',
                description: ''
            },
            formVideo: {
                title: '',
                tag: '',
                groupName: '',
                description: ''
            },
            // dialog 验证规则
            rulesPic: {
                title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
                tag: [{ required: true, message: '请输入标签', trigger: 'blur' }]
            },
            rulesMusic: {
                title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
                tag: [{ required: true, message: '请输入标签', trigger: 'blur' }]
            },
            rulesVideo: {
                title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
                tag: [{ required: true, message: '请输入标签', trigger: 'blur' }]
            },
            // 表列显示控制
            colPic: true
        }
    },

    created() {
        this.getList()
    },
    mounted: function() {},
    methods: {
        //设置表头行的样式
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            return 'font-size:12px;text-align:center;padding:2px 0;background:#f7f7f7;'
        },
        getList() {
            // let menuString = JSON.stringify(this.menu)
            listMedia(this.listQuery.page, this.listQuery.size, this.title, this.author, this.group, this.tag, this.date)
                .then(res => {
                    console.log('TCL: res', res)
                    this.list = res.content
                    this.total = res.totalElements
                })
                .catch(err => {
                    // console.log(err.response.data.message)
                })
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
            this.$confirm('此操作将删除素材, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delMedia(id)
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
                name: 'newarticle',
                query: {
                    id: id
                }
            })
        },
        // 图片数量超出
        handleExceed(files, fileList) {
            // this.$notify({
            //     title: '单次只能上传一个文件',
            //     message: '点击文件名右侧x键取消后,再上传新文件',
            //     type: 'warning',
            //     duration: 4500
            // })
            // this.$message.warning('只能上传一个文件')
        },
        handleSuccess(response, file, fileList) {
            console.log('GOOGLE: file', file)
            console.log('GOOGLE: response', response)
            this.file = response.data
            this.filename = file.name
            this.$notify({
                title: '文件上传成功',
                type: 'success',
                duration: 2500
            })
        },
        handleBeforeRemove(file, fileList) {
            // for (let i = 0; i < this.files.length; i++) {
            //     if (this.files[i].uid === file.uid) {
            //         del(this.files[i].id).then(res => {})
            //         return true
            //     }
            // }
        },
        handlePictureCardPreview(file) {
            // this.dialogImageUrl = file.url
            // this.dialogVisible = true
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
        // music上传前判断
        beforeMusicUpload(file) {
            console.log('GOOGLE: file', file)
            let typeArr = ['audio/mpeg', 'audio/mp3', 'audio/3gpp']
            const isJPG = typeArr.includes(file.type)
            const isLt2M = file.size / 1024 / 1024 < 10

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 音频 格式!')
            }
            if (!isLt2M) {
                this.$message.error('上传文件大小不能超过 2MB!')
            }
            return isJPG && isLt2M
        },
        // video上传前判断
        beforeVideoUpload(file) {
            console.log('GOOGLE: file', file)
            let typeArr = ['audio/mp4', 'video/mp4', 'video/mpeg', 'audio/mpeg']
            const isJPG = typeArr.includes(file.type)
            const isLt2M = file.size / 1024 / 1024 < 10

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 视频 格式!')
            }
            if (!isLt2M) {
                this.$message.error('上传文件大小不能超过 2MB!')
            }
            return isJPG && isLt2M
        },

        // 监听上传失败
        handleError(e, file, fileList) {
            const msg = JSON.parse(e.message)
            this.$notify({
                title: msg.message,
                type: 'error',
                duration: 2500
            })
        },
        // dialog
        submitPic() {
            this.$refs['formPic'].validate(valid => {
                if (valid) {
                    if (this.file) {
                        mediaUpload(this.formPic.title, this.formPic.tag, this.formPic.groupName, this.formPic.description, this.file)
                            .then(res => {
                                this.$notify({
                                    title: '保存成功',
                                    type: 'success',
                                    duration: 2500
                                })
                                this.cancel()
                            })
                            .catch(err => {
                                console.log(err.response.data.message)
                            })
                    } else {
                        // 提示上传文件
                        this.$notify({
                            title: '请上传文件',
                            type: 'error',
                            duration: 2500
                        })
                    }
                } else {
                    // this.loading = false
                    this.$notify({
                        title: '请填写标题和标签',
                        type: 'error',
                        duration: 2500
                    })
                    return false
                }
            })
        },
        submitMusic() {
            this.$refs['formMusic'].validate(valid => {
                if (valid) {
                    if (this.file) {
                        mediaUpload(this.formMusic.title, this.formMusic.tag, this.formMusic.groupName, this.formMusic.description, this.file)
                            .then(res => {
                                this.$notify({
                                    title: '保存成功',
                                    type: 'success',
                                    duration: 2500
                                })
                                this.cancel()
                            })
                            .catch(err => {
                                console.log(err.response.data.message)
                            })
                    } else {
                        // 提示上传文件
                        this.$notify({
                            title: '请上传文件',
                            type: 'error',
                            duration: 2500
                        })
                    }
                } else {
                    // this.loading = false
                    this.$notify({
                        title: '请填写标题和标签',
                        type: 'error',
                        duration: 2500
                    })
                    return false
                }
            })
        },
        submitVideo() {
            this.$refs['formVideo'].validate(valid => {
                if (valid) {
                    if (this.file) {
                        mediaUpload(this.formVideo.title, this.formVideo.tag, this.formVideo.groupName, this.formVideo.description, this.file)
                            .then(res => {
                                this.$notify({
                                    title: '保存成功',
                                    type: 'success',
                                    duration: 2500
                                })
                                this.cancel()
                            })
                            .catch(err => {
                                console.log(err.response.data.message)
                            })
                    } else {
                        // 提示上传文件
                        this.$notify({
                            title: '请上传文件',
                            type: 'error',
                            duration: 2500
                        })
                    }
                } else {
                    // this.loading = false
                    this.$notify({
                        title: '请填写标题和标签',
                        type: 'error',
                        duration: 2500
                    })
                    return false
                }
            })
        },
        cancel() {
            this.dialogPic = false
            this.dialogMusic = false
            this.dialogVideo = false
            this.file = ''
            this.filename = ''
            this.formPic = {
                title: '',
                tag: '',
                groupName: '',
                description: ''
            }
            this.formMusic = {
                title: '',
                tag: '',
                groupName: '',
                description: ''
            }
            this.formVideo = {
                title: '',
                tag: '',
                groupName: '',
                description: ''
            }
        },

        goodsAdd() {
            this.$router.push({
                name: 'goods_add'
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
    margin-right: 20px;
    width: 200px;
}
.head-container .el-form-item {
    display: flex;
    /* flex-direction: column; */
}
.filename {
    display: block;
    overflow: hidden;
    margin-right: 40px;
    margin-bottom: 7px;
    padding-left: 4px;
    color: #666;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
    transition: color 0.3s;
}

.filename .el-icon-document {
    margin-right: 7px;
    height: 100%;
    color: #666;
    line-height: inherit;
}
</style>
