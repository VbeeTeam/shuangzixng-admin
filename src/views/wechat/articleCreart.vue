<template>
    <div class="app-container">
        <el-form :model="validate" class="flex" :rules="rules" ref="formRef" label-position="right" label-width="85px">
            <div class="box">
                <el-form-item label="标题" prop="title">
                    <!-- <span>菜单名称：</span> -->
                    <el-input placeholder="标题" v-model="validate.title" style="width:600px"></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <Editor :content="editContent" v-model="validate.content"></Editor>
                    <!-- <u-Editor :content="editContent" v-model="validate.content"></u-Editor> -->
                </el-form-item>
                <el-form :inline="true" style="max-width:650px; margin-top:-200px" label-width="85px">
                    <el-form-item label="作者">
                        <el-input placeholder="作者" v-model="author"></el-input>
                    </el-form-item>
                    <el-form-item label="原文地址">
                        <el-input placeholder="输入内容" v-model="contentSourceUrl"></el-input>
                    </el-form-item>
                    <el-form-item label="显示封面">
                        <el-switch v-model="showCoverPic" inactive-text="否" active-text="是"> </el-switch>
                    </el-form-item>
                    <el-form-item label="封面上传" v-show="showCoverPic" class="upload-form">
                        <img class="thimg" :src="thumbUrl" alt="" v-show="thumbUrl" />
                        <div class="two-box">
                            <el-button class="lib-btn" size="small" type="info" @click="openIamge">图片库</el-button>
                            <el-upload class="flt" :before-remove="handleBeforeRemove" :before-upload="beforePicUpload" :on-success="handleSuccess" :action="uploadImg" :headers="headers" :show-file-list="false">
                                <el-button class="up-btn" size="small" type="info">点击上传</el-button>
                            </el-upload>
                            <div class="clearfix"></div>
                            <div slot="" class="el-upload__tip">tips:请上传图片，且文件不超过2M <br />一次只能上传一个文件，后上传的文件将覆盖之前的文件</div>
                        </div>
                    </el-form-item>
                </el-form>
                <el-form-item label="">
                    <el-button type="primary" size="medium" @click="save">保存</el-button>
                </el-form-item>
            </div>

            <!-- <div class="filter-container"></div> -->

            <!-- dialog -->
            <el-dialog :visible.sync="dialogImage" :close-on-click-modal="false" :before-close="cancel" title="图片库" append-to-body width="700px">
                <picture-library @sureClick="getInfo" @closeD="cancel"></picture-library>
            </el-dialog>
            <!-- dialog -->
        </el-form>
    </div>
</template>

<script>
import { newArticle, fetchArticle, editArticle, uploadImg, imageList } from '@/api/wechat'
import { getToken } from '@/utils/auth'
import Editor from '@/views/components/Editor'
import PictureLibrary from '@/views/components/PictureLibrary'

export default {
    data() {
        return {
            headers: { Authorization: ' ' + getToken() },
            editContent: '', //编辑状态 初始文章
            author: '',
            validate: {
                title: '',
                content: ''
            },

            id: null,
            file: '',
            filename: '',
            uploadImg: uploadImg,
            showCoverPic: true, //是否展示封面
            thumbUrl: '', //封面地址
            contentSourceUrl: '', //原文链接
            rules: {
                title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
                content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
            },
            // 弹框显示控制
            dialogImage: false
        }
    },
    components: { Editor, PictureLibrary },
    created() {
        this.id = this.$route.query.id
    },
    mounted() {
        if (this.id) {
            fetchArticle(this.id)
                .then(res => {
                    console.log('TCL: res', res)
                    this.validate.title = res.title
                    this.author = res.author
                    // this.validate.content = res.content
                    this.showCoverPic = res.showCoverPic
                    this.thumbUrl = res.thumbUrl
                    this.contentSourceUrl = res.contentSourceUrl
                    this.editContent = res.content
                    this.validate.content = res.content
                })
                .catch(err => {
                    // console.log(err.response.data.message)
                })
        }
    },

    methods: {
        save() {
            // 判断标题和内容
            if (this.validate.title && this.validate.content) {
                // 封面判断
                if (this.thumbUrl == '' && this.showCoverPic) {
                    this.$notify({
                        title: '请上传封面',
                        message: '选择显示封面后，需要上传封面',
                        type: 'error',
                        duration: 2500
                    })
                } else {
                    // 根据是否有id 判别新建\编辑
                    if (this.id) {
                        // this.thumbUrl = this.file
                        editArticle(this.id, this.validate.title, this.author, this.validate.content, this.showCoverPic, this.thumbUrl, this.contentSourceUrl)
                            .then(res => {
                                this.$notify({
                                    title: '编辑成功',
                                    message: '',
                                    type: 'success',
                                    duration: 2500
                                })
                            })
                            .catch(err => {
                                // console.log(err.response.data.message)
                            })
                    } else {
                        newArticle(this.validate.title, this.author, this.validate.content, this.showCoverPic, this.thumbUrl, this.contentSourceUrl)
                            .then(res => {
                                this.id = res.id
                                this.$notify({
                                    title: '保存成功',
                                    message: '跳转本文章编辑页面',
                                    type: 'success',
                                    duration: 2500
                                })
                            })
                            .catch(err => {
                                // console.log(err.response.data.message)
                            })
                    }
                }
            } else {
                this.$notify({
                    title: '请输入标题和内容',
                    message: '',
                    type: 'error',
                    duration: 2500
                })
            }
        },
        // 图片上传方法
        handleSuccess(response, file, fileList) {
            console.log('GOOGLE: file', file)
            console.log('GOOGLE: response', response)
            // this.file = response.data
            this.filename = file.name
            this.thumbUrl = response.data
            this.$notify({
                title: '文件上传成功',
                type: 'success',
                duration: 2500
            })
        },
        // 删除前处理 暂未用
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
            const isLt2M = file.size / 1024 / 1024 < 2

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 图片 格式!')
            }
            if (!isLt2M) {
                this.$message.error('上传文件大小不能超过 2MB!')
            }
            return isJPG && isLt2M
        },
        getInfo(info) {
            // console.log('GOOGLE: data', info)
            this.thumbUrl = info
            this.cancel()
        },
        cancel() {
            this.dialogImage = false
        },
        openIamge() {
            this.dialogImage = true
            // this.getList()
        }
    }
}
</script>
<style scoped="scoped">
.flex {
    display: flex;
}
.clearfix:after {
    display: block;
    visibility: hidden;
    clear: both;
    height: 0;
    content: ' ';
    font-size: 0;
}
.filter-container {
    margin-bottom: 20px;
}
.filter-container .el-input {
    /* width: 200px; */
    margin-right: 20px;
}
.btn_wrap {
    margin-bottom: 30px;
    text-align: center;
}
.fileList {
    /* width: 300px; */
}
/* .filename {
    transition: all .5s cubic-bezier(.55, 0, .1, 1);
    color: #606266;
    display: block;
    margin-right: 40px;
    margin-bottom: 7px;
    overflow: hidden;
    padding-left: 4px;
    text-overflow: ellipsis;
    background-origin: padding-box;
    transition: color .3s;
    white-space: nowrap;
    text-align: left;
}

.filename .el-icon-document {
    height: 100%;
    margin-right: 7px;
    color: #909399;
    line-height: inherit;
} */
.thimg {
    /* width: 150px;
    margin-left: 15px; */
}
.el-upload__tip {
    /* padding-left: 68px; */
}
.required >>> .el-form-item__label:before {
    margin-right: 4px;
    color: #ff4949;
    content: '*';
}
.box >>> .editor-content {
    margin-top: -50px;
}
</style>
