<template>
    <div class="app-container flex">
        <div class="center">
            <div class="list">
                <div class="itemFitst" v-for="(item, index) in list" @click="showPop(index)" :key="index" v-if="index == 0">
                    <img :src="item.thumbUrl" alt="" class="ftimg" />
                    <p class="text">{{ item.title }}</p>
                    <div class="pop popfirst" v-show="show[index]">
                        <el-tooltip effect="dark" content="上移" :open-delay="600" placement="right">
                            <i class=" iconfont icon-icon-up" @click.stop="sortUp(index)"></i>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="下移" :open-delay="600" placement="right">
                            <i class=" iconfont icon-icon-up1" @click.stop="sortDown(index)"></i>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="删除" :open-delay="600" placement="right">
                            <i class=" iconfont icon-icon-delate" @click.stop="del(index)"></i>
                        </el-tooltip>
                    </div>
                </div>

                <!-- <transition-group name="flip-list" tag="div"> -->
                <div :class="[index == selIndex ? 'bod' : '', 'content']" v-for="(item, index) in list" v-if="index != 0" :key="index" name="flip-list">
                    <el-divider></el-divider>
                    <div class="item" @click="showPop(index)">
                        <p class="text">{{ item.title }}</p>
                        <img :src="item.thumbUrl" alt="" class="timg" />
                    </div>
                    <div class="pop" v-show="show[index]">
                        <el-tooltip effect="dark" content="上移" :open-delay="600" placement="right">
                            <i class=" iconfont icon-icon-up" @click.stop="sortUp(index)"></i>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="下移" :open-delay="600" placement="right">
                            <i class=" iconfont icon-icon-up1" @click.stop="sortDown(index)"></i>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="删除" :open-delay="600" placement="right">
                            <i class=" iconfont icon-icon-delate" @click.stop="del(index)"></i>
                        </el-tooltip>
                        <!-- <i class="el-icon-top" @click="sortUp(index)"></i> -->
                        <!-- <i class="el-icon-bottom" @click="sortDown(index)"></i>
                        <i class="el-icon-delete" @click="del(index)"></i> -->
                    </div>
                </div>
                <!-- add -->
                <el-divider></el-divider>

                <div class="add-item" @click="dialogArticle = true"><span style="font-size: 38px;vertical-align: sub;">+ </span>添加文章</div>
                <!-- </transition-group> -->
            </div>
        </div>
        <div class="left">
            <el-form :model="popArt" :rules="rules" ref="formRef" label-width="100px" label-position="right">
                <el-form-item label="标题" prop="title">
                    <el-input class="long-input" placeholder="标题" v-model="popArt.title"></el-input>
                </el-form-item>
                <el-form-item label="摘要">
                    <el-input class="long-input" type="textarea" :rows="1" placeholder="请输入内容" v-model="popArt.digest"> </el-input>
                    <p class="tips">注：多图文时无摘要显示</p>
                </el-form-item>
            </el-form>
        </div>
        <div class="right">
            <el-form :model="popArt" :rules="rules" ref="formRef" label-width="100px" label-position="right">
                <div class="title-wrap" style="margin-top:0px;">
                    <span class="form-title">标题设置</span>
                </div>

                <div class="title-wrap">
                    <span class="form-title">封面设置</span>
                </div>
                <el-form-item label="显示封面">
                    <el-switch v-model="popArt.showCoverPic" inactive-text="否" active-text="是"> </el-switch>
                </el-form-item>
                <el-form-item label="封面上传" class="upload-form">
                    <img class="thimg" :src="popArt.thumbUrl" alt="" v-show="popArt.thumbUrl" />
                    <div class="two-box">
                        <el-button class="lib-btn" size="small" type="info" @click="openIamge">图片库</el-button>
                        <el-upload class="flt" :before-remove="handleBeforeRemove" :before-upload="beforePicUpload" :on-success="handleSuccess" :action="uploadImg" :headers="headers" :show-file-list="false">
                            <el-button class="up-btn" size="small" type="info">点击上传</el-button>
                        </el-upload>
                        <div class="clearfix"></div>
                        <div slot="" class="el-upload__tip">tips:提示：文章封面图片尺寸为270×210，不超过2M <br />一次只能上传一个文件，后上传的文件将覆盖之前的文件</div>
                    </div>
                </el-form-item>
                <!-- <el-form-item label="封面">
                    <el-button size="mini" style="float:left;margin: 5px 10px 0 0;" type="primary" @click="openIamge">图片库</el-button>
                    <el-upload :before-remove="handleBeforeRemove" :before-upload="beforePicUpload" :on-success="handleSuccess" :action="uploadImg" :headers="headers" :show-file-list="false" class="upload-demo">
                        <div class="fileList">

                        </div>
                        <el-button size="mini" type="primary" style="float:left;margin-top:-13px;">点击上传</el-button>
                        <img :src="popArt.thumbUrl" alt="" class="thimg" />
                        <div slot="tip" style="display: block;" class="el-upload__tip">tips:请上传图片，且文件不超过2M <br />一次只能上传一个文件，后上传的文件将覆盖之前的文件</div>
                    </el-upload>
                </el-form-item> -->
                <div class="title-wrap">
                    <span class="form-title">评论设置</span>
                </div>
                <el-form-item label="打开评论">
                    <el-switch v-model="popArt.needOpenComment" inactive-text="否" active-text="是"> </el-switch>
                </el-form-item>
                <!-- <el-form-item label="评论范围" v-show="popArt.needOpenComment">
                    <el-switch v-model="popArt.onlyFansCanComment" inactive-text="所有人" active-text="粉丝"> </el-switch>
                </el-form-item> -->
                <el-form-item label="评论范围" v-show="popArt.needOpenComment">
                    <el-select v-model="popArt.onlyFansCanComment" placeholder="请选择">
                        <el-option v-for="item in onlyFansCanCommentList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
                <div class="title-wrap">
                    <span class="form-title">摘要设置</span>
                </div>

                <div class="title-wrap">
                    <span class="form-title">群发设置</span>
                </div>

                <el-form-item label="是否加入历史消息列表" label-width="160px" style="margin-left:-58px;">
                    <el-switch v-model="isToAll" inactive-text="否" active-text="是"> </el-switch>
                </el-form-item>
                <el-form-item label="判定转载时是否发送" label-width="160px" style="margin-left:-58px;">
                    <el-switch v-model="sendIgnoreReprint" inactive-text="否" active-text="是"> </el-switch>
                </el-form-item>
                <el-form-item label="" label-position="left">
                    <el-button type="info" size="mini" @click="previewDia" :loading="loading">预览</el-button>
                    <el-button type="primary" style="margin-left:30px" size="mini" @click="publishList" :loading="loading">发布</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- dialog 图片库-->
        <el-dialog :visible.sync="dialogImage" :close-on-click-modal="false" :before-close="cancel" title="图片库" append-to-body width="700px">
            <picture-library @sureClick="getInfo" @closeD="cancel"></picture-library>
        </el-dialog>
        <!-- dialog 图片库-->
        <!-- dialog 微信号-->
        <el-dialog :visible.sync="dialogWX" :close-on-click-modal="true" title="请输入已关注该公众号的微信号" append-to-body width="350px">
            <el-form>
                <el-form-item label="微信号">
                    <el-input v-model="wxAccount" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogWX = false">取 消</el-button>
                <el-button type="primary" @click="previewhList">确 定</el-button>
            </div>
        </el-dialog>
        <!-- dialog 微信号-->
        <!-- dialog 文章库-->
        <el-dialog :visible.sync="dialogArticle" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" :before-close="cancel" title="公众号文章库" append-to-body width="700px">
            <article-library @sureClick="getArtList" @closeD="cancel"></article-library>
        </el-dialog>
        <!-- dialog 文章库-->
    </div>
</template>

<script>
import { uploadImg, publish, preview } from '@/api/wechat'
import { getToken } from '@/utils/auth'
import PictureLibrary from '@/views/components/PictureLibrary'
import ArticleLibrary from '@/views/components/ArticleLibrary'

export default {
    data() {
        return {
            headers: { Authorization: ' ' + getToken() },
            uploadImg: uploadImg,
            loading: false,
            filename: '',

            isToAll: false, //是否加入历史消息列表
            sendIgnoreReprint: false, //判定转载时是否发送
            // fm: null,
            list: [],
            show: [],
            selIndex: '', //选中的index
            atlList: '', //storage 获取的文章列表
            //左侧文章 显示左侧
            popArt: {
                title: '',
                showCoverPic: false, //封面显示
                needOpenComment: true, //评论打开
                onlyFansCanComment: false, //评论范围 true 只有粉丝
                digest: '', //摘要
                thumbUrl: '' //封面
            },
            // 弹框显示控制
            dialogImage: false,
            dialogWX: false,
            dialogArticle: false,
            wxAccount: '',
            onlyFansCanCommentList: [
                {
                    value: false,
                    label: '所有人'
                },
                {
                    value: true,
                    label: '粉丝'
                }
            ],
            rules: {
                title: [{ required: true, message: '请输入标题', trigger: 'blur' }]
            }
        }
    },
    components: { PictureLibrary, ArticleLibrary },

    mounted() {
        for (let i = 0; i < this.list.length; i++) {
            this.show.push(false)
        }
        this.atlList = localStorage.getItem('atlList')
        this.list = JSON.parse(this.atlList)
        console.log('GOOGLE: this.atlList', this.list)
    },

    methods: {
        // 中间文章列表排序 向上移动
        sortUp(index) {
            if (index > 0) {
                let cloneObj = this.list[index]
                this.$set(this.list, index, this.list[index - 1])
                this.$set(this.list, index - 1, cloneObj)
                this.showPop(index - 1)
            }
        },
        // 中间文章列表排序 向下移动
        sortDown(index) {
            let len = this.list.length
            if (index < len - 1) {
                let cloneObj = this.list[index]
                this.$set(this.list, index, this.list[index + 1])
                this.$set(this.list, index + 1, cloneObj)
                this.showPop(index + 1)
            }
        },
        del(index) {
            this.list.splice(index, 1)
            if (this.list.length == 0) {
                this.popArt = {
                    title: '',
                    showCoverPic: false, //封面显示
                    needOpenComment: true, //评论打开
                    onlyFansCanComment: false, //评论范围 true 只有粉丝
                    digest: '', //摘要
                    thumbUrl: '' //封面
                }
                return
            }
            if (index == 0) {
                this.popArt = this.list[index]
            } else {
                this.popArt = this.list[index - 1]
            }
        },
        showPop(index) {
            // console.log('GOOGLE: showPop -> index', index)
            this.selIndex = index
            this.popArt = this.list[index]
            console.log('GOOGLE: showPop -> this.list[index]', this.list[index])
            for (let i = 0; i < this.list.length; i++) {
                this.$set(this.show, i, false)
            }
            this.$set(this.show, index, true)
        },
        // 图片上传
        handleSuccess(response, file, fileList) {
            this.filename = file.name
            this.popArt.thumbUrl = response.data
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
            const isLt2M = file.size / 1024 / 1024 < 2

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 图片 格式!')
            }
            if (!isLt2M) {
                this.$message.error('上传文件大小不能超过 2MB!')
            }
            return isJPG && isLt2M
        },
        // 图片库
        getInfo(info) {
            // console.log('GOOGLE: data', info)
            this.popArt.thumbUrl = info
            this.cancel()
        },
        // 文章库
        getArtList(info) {
            // 比较两组列表去重 保留新的一条
            let delNum = 0
            for (let i = 0; i < info.length; i++) {
                for (let j = this.list.length - 1; j >= 0; j--) {
                    if (info[i].id == this.list[j].id) {
                        this.list.splice(j, 1)
                        delNum++
                    }
                }
            }
            if (delNum) {
                this.$notify({
                    title: `有${delNum}篇文章重复,已更新为新选择的`,
                    type: 'success',
                    duration: 2500
                })
            }
            this.list.push(...info)
            this.cancel()
        },
        cancel() {
            this.dialogImage = false
            this.dialogArticle = false
        },
        openIamge() {
            this.dialogImage = true
            // this.getList()
        },
        // 发布文章
        publishList() {
            // 验证数据
            // 验证数据
            for (let i = 0; i < this.list.length; i++) {
                console.log('GOOGLE: this.list', this.list.i)

                if (this.list[i].title == '') {
                    this.$notify({
                        title: `请填写第${i + 1}篇文章的标题`,
                        type: 'warning',
                        duration: 2500
                    })
                    return false
                }
                if (this.list[i].showCoverPic == true && this.list[i].thumbUrl == '') {
                    this.$notify({
                        title: `请上传第${i + 1}篇文章的封面`,
                        type: 'warning',
                        duration: 2500
                    })
                    return false
                }

                if (this.list[i].content == '') {
                    this.$notify({
                        title: `请编辑第${i + 1}篇文章的内容后再发布`,
                        type: 'warning',
                        duration: 2500
                    })
                    return false
                }
            }
            this.submitPublishList()
        },
        submitPublishList() {
            this.loading = true
            let previewWxName = this.wxAccount
            publish(this.isToAll, this.sendIgnoreReprint, this.list, previewWxName)
                .then(res => {
                    this.$notify({
                        title: '发布成功',
                        message: '',
                        type: 'success',
                        duration: 2500
                    })
                    this.loading = false
                })
                .catch(err => {
                    this.loading = false
                    // console.log(err.response.data.message)
                })
        },
        // 填写预览微信号
        previewDia() {
            // 验证数据
            for (let i = 0; i < this.list.length; i++) {
                console.log('GOOGLE: this.list', this.list.i)

                if (this.list[i].title == '') {
                    this.$notify({
                        title: `请填写第${i + 1}篇文章的标题`,
                        type: 'warning',
                        duration: 2500
                    })
                    return false
                }
                if (this.list[i].showCoverPic == true && this.list[i].thumbUrl == '') {
                    this.$notify({
                        title: `请上传第${i + 1}篇文章的封面`,
                        type: 'warning',
                        duration: 2500
                    })
                    return false
                }

                if (this.list[i].content == '') {
                    this.$notify({
                        title: `请编辑第${i + 1}篇文章的内容后再发布预览`,
                        type: 'warning',
                        duration: 2500
                    })
                    return false
                }
            }
            this.dialogWX = true

            // this.$refs['formRef'].validate(valid => {
            //     // 验证表单内容
            //     if (valid) {
            //         this.dialogWX = true
            //     } else {
            //         this.$notify({
            //             title: '请填写完整信息',
            //             type: 'warning',
            //             duration: 2500
            //         })
            //     }
            // })
        },
        // 发布文章 预览
        previewhList() {
            if (this.wxAccount) {
                this.loading = true
                let previewWxName = this.wxAccount
                preview(this.isToAll, this.sendIgnoreReprint, this.list, previewWxName)
                    .then(res => {
                        this.$notify({
                            title: '预览发布成功',
                            message: '',
                            type: 'success',
                            duration: 2500
                        })
                        this.dialogWX = false
                        this.loading = false
                    })
                    .catch(err => {
                        this.loading = false
                        // console.log(err.response.data.message)
                    })
            } else {
                this.$notify({
                    title: '请填写微信号',
                    message: '',
                    type: 'warning',
                    duration: 2500
                })
            }
        }
    }
}
</script>
<style scoped="scoped">
.app-container {
    justify-content: flex-start;
    /* background-color: #cdcdcd; */
    /* display: flex; */
    /* justify-content: space-between; */
}
.left {
    /* min-width: 300px; */
    padding-left: 36px;
}
.left >>> .el-upload {
    width: 100px;
}

.center {
    /* margin-left: 80px; */
}
.right {
    margin-left: 120px;
}
.el-divider {
    margin: 0;
    height: 1px;
}
.list {
    width: 270px;
    /* border: 1px solid #cdcdcd; */
    border-radius: 8px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
    /* overflow: hidden; */
}
.list .ftimg {
    width: 100%;
    height: 100%;
    border-radius: 8px 8px 0 0;
}
.list .timg {
    width: 60px;
    height: 60px;
}
.list .itemFitst {
    position: relative;
    height: 115px;
}
.list .itemFitst .text {
    overflow: hidden;
    margin-top: -30px;
    margin-bottom: 8px;
    padding: 0 20px;
    height: 18px;
    color: #fff;
}
.list .item {
    display: flex;
    justify-content: space-between;
    padding: 10px;
}
.list .bod {
    border: 2px solid #016df8;
}
.list .item img {
    display: block;
}
.list .item .text {
    overflow: hidden;
    margin: 0;
    padding: 15px 30px 0 10px;
    max-width: 240px;
    max-height: 50px;
    word-wrap: break-word;
    font-size: 14px;
    line-height: 18px;
}

.list .content {
    position: relative;
    border: 1px solid #fff;
    transition: all 0.3s;
}
/* .content:last-child {
    border-radius: 0 0 8px 8px;
} */
.list .add-item {
    height: 90px;
    text-align: center;
    line-height: 90px;
}
.list .pop {
    position: absolute;
    top: -40px;
    right: -80px;
    z-index: 8;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-around;
    width: 60px;
    height: 180px;
    border-radius: 45px;
    background-color: #fff;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.list .pop i {
    padding: 5px;
    font-size: 26px;
    cursor: pointer;
}
.list .pop i:hover {
    border-radius: 20px;
    background-color: #f1f1f3;
}
.list .itemFitst .pop {
    top: -10px;
}
.flip-list-move {
    transition: transform 0.3s;
}
.fileList {
    width: 300px;
}
.filename {
    display: block;
    overflow: hidden;
    margin-right: 40px;
    margin-bottom: 7px;
    padding-left: 4px;
    color: #606266;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
    transition: color 0.3s;
}

.filename .el-icon-document {
    margin-right: 7px;
    height: 100%;
    color: #909399;
    line-height: inherit;
}

.form-title {
    margin-left: -12px;
    padding: 2px 18px;
    background-color: rgba(233, 245, 254, 1);
    color: #016df8;
    font-weight: 900;
    font-size: 16px;
}
.title-wrap {
    display: none;
    margin-top: 35px;
    margin-bottom: 35px;
}
</style>
