<template>
    <div class="app-container">
        <div class="all">
            <div class="left">
                <el-form :model="info" :rules="rules" ref="formRef" label-width="80px" label-position="right">
                    <el-form-item label="专题名称" prop="title">
                        <el-input class="long-input" placeholder="专题名称" v-model="info.title"></el-input>
                    </el-form-item>
                    <el-form-item label="副标题">
                        <el-input class="long-input" placeholder="副标题" v-model="info.subtitle"></el-input>
                    </el-form-item>
                    <el-form-item label="专题排序">
                        <el-input-number v-model="info.topPriority" :min="0" :max="9999" label="专题排序"></el-input-number>
                    </el-form-item>
                    <el-form-item label="模块" prop="module.id">
                        <el-select v-model="info.module.id" style="width:250px">
                            <el-option v-for="item in mdList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="upload-form" label="封面">
                        <el-upload :before-remove="handleBeforeRemove" :before-upload="beforePicUpload" :on-success="handleSuccessPic" :action="uploadImg" :headers="headers" :show-file-list="false" class="upload-demo">
                            <div class="upbox">
                                <img :src="filePic" alt="" class="upimg" />
                                <div class="stripes">点击上传</div>
                            </div>
                            <div slot="tip" style="display: block;" class="el-upload__tip">tips:仅首页专题需上传专题封面，图片尺寸为510×300，文件不得超过2M<br />一次只能上传一个文件，后上传的文件将覆盖之前的文件</div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item class="upload-form" label="专题底图">
                        <el-upload :before-remove="handleBeforeRemove" :before-upload="beforePicUpload" :on-success="handleSuccessUdp" :action="uploadImg" :headers="headers" :show-file-list="false" class="upload-demo">
                            <div class="upbox">
                                <img :src="fileUdp" alt="" class="upimg" />
                                <div class="stripes">点击上传</div>
                            </div>
                            <div slot="tip" style="display: block;" class="el-upload__tip">tips:专题底图尺寸为1053×1164，文件不得超过2M<br />一次只能上传一个文件，后上传的文件将覆盖之前的文件</div>
                        </el-upload>
                    </el-form-item>
                    <!-- 
                    <el-form-item label="测评文章" prop="articleList">
                        <el-button size="mini" type="primary" @click="openArticle">公众号文章库</el-button>
                        <el-button size="mini" type="primary" @click="openApp">应用文章库</el-button>
                        <el-table class="el-table__body-wrapper" row-key="id" :data="info.articleList" fit highlight-current-row style="width: 400px;">
                            <el-table-column label="标题" align="center" width="250">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.title }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" align="center" width="150">
                                <template slot-scope="scope">
                                    <el-button type="text" size="mini" @click.native="articleDel(scope.$index)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="tips">tips:拖动排序</div>
                    </el-form-item> -->
                    <el-form-item label="测评文章" prop="articleList">
                        <div class="list">
                            <div :class="[index == selIndex ? 'bod' : '', 'content']" v-for="(item, index) in info.articleList" :key="index">
                                <div class="item" @click="showPop(index)">
                                    <p class="text">{{ item.title }}</p>
                                    <img :src="item.coverUrl" alt="" class="timg" />
                                </div>
                                <div class="pop" v-show="show[index]">
                                    <el-tooltip effect="dark" content="上移" :open-delay="600" placement="right">
                                        <i class=" iconfont icon-icon-up" @click="sortUp(index)"></i>
                                    </el-tooltip>
                                    <el-tooltip effect="dark" content="下移" :open-delay="600" placement="right">
                                        <i class=" iconfont icon-icon-up1" @click="sortDown(index)"></i>
                                    </el-tooltip>
                                    <el-tooltip effect="dark" content="删除" :open-delay="600" placement="right">
                                        <i class=" iconfont icon-icon-delate" @click="del(index)"></i>
                                    </el-tooltip>
                                </div>
                                <el-divider></el-divider>
                            </div>
                            <!-- add -->
                            <div class="add-item" @click="openApp"><span style="font-size: 38px;vertical-align: sub;">+ </span>添加文章</div>
                        </div>
                        <div class="tips">tips：专题文章首页只显示3篇，余下在查看更多后展开</div>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button class="long-button" type="primary" style="float:right;margin-left:30px" size="" @click="save" :loading="loading">保存</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <div class="right">
                <!-- 预览 -->
                <div class="special">
                    <div class="section-productImg">
                        <div class="instructions">
                            封面预览
                            <div class="corner"></div>
                        </div>
                        <!-- <div class="topic">
                            专业测评
                            <span class="more">更多 ></span>
                        </div> -->
                        <div class="productImg-left" :style="{ background: 'url(' + filePic + ') center top / cover' }">
                            <h3>{{ info.title }}</h3>
                            <h5>{{ info.subtitle }}</h5>
                            <div class="see">
                                <img src="../../assets/img/icon_eye@3x(1).png" alt="" />
                                <span>888</span>
                            </div>
                        </div>
                    </div>
                    <div class="instructions">
                        专题预览
                        <div class="corner"></div>
                    </div>
                    <!-- <div class="topic">六大攻略</div> -->
                    <div class="section-list" :style="{ background: 'url(' + fileUdp + ') no-repeat center top / cover' }">
                        <div class="list-top">
                            <h2>{{ info.title }}</h2>
                            <h5>{{ info.subtitle }}</h5>
                        </div>
                        <div class="list-content" v-if="info.articleList">
                            <ul>
                                <li v-for="(item2, index) in info.articleList" :key="item2.id" v-if="index < 3">
                                    <div class="content-left">
                                        <p>{{ item2.title }}</p>
                                        <div class="left-number">
                                            <div>
                                                <img src="../../assets/img/icon_comments@3x.png" alt="" />
                                                <span>0</span>
                                            </div>
                                            <div>
                                                <img src="../../assets/img/icon_eye@3x.png" alt="" />
                                                <span>{{ item2.visits }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <img class="content-right" :src="item2.coverUrl" alt="" />
                                </li>
                            </ul>
                            <div class="list-all" @click="nextAll(item)">
                                <span>查看更多</span>
                                <img src="../../assets/img/icon_arrowright-white@3x.png" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 预览 -->
            </div>
        </div>
        <!-- dialog -->
        <el-dialog :visible.sync="dialogArticle" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" :before-close="cancel" title="公众号文章库" append-to-body width="700px">
            <article-library @sureClick="getInfo" @closeD="cancel"></article-library>
        </el-dialog>
        <el-dialog :visible.sync="dialogApp" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" :before-close="cancel" title="应用文章库" append-to-body width="700px">
            <application-library @sureClick="getInfo" @closeD="cancel"></application-library>
        </el-dialog>
        <!-- dialog -->
    </div>
</template>

<script>
import { sourceUploadImages } from '@/api/wechat'
import { projectCreat, projectEdit, getProjectSingle, getModuleList } from '@/api/project'
import { getToken } from '@/utils/auth'
import ArticleLibrary from '@/views/components/ArticleLibrary'
import ApplicationLibrary from '@/views/components/ApplicationLibrary'
import Sortable from 'sortablejs'

export default {
    data() {
        return {
            dialogArticle: false,
            dialogApp: false,
            headers: { Authorization: ' ' + getToken() },
            uploadImg: sourceUploadImages,
            loading: false,
            filename: '',
            info: {
                id: '',
                title: '',
                subtitle: '',
                topPriority: '',
                picture: '',
                underPicture: '',
                module: {
                    id: ''
                },
                articleList: []
            },
            filePic: '',
            filenamePic: '',
            fileUdp: '',
            filenameUdp: '',
            sendIgnoreReprint: false, //判定转载时是否发送

            mdList: [], // 模块列表
            // mdSel: '', //选中的模块id
            rules: {
                title: [{ required: true, message: '请输入内容', trigger: 'blur' }],
                'module.id': [{ required: true, message: '请选择模块', trigger: 'blur' }]
                // articleList: [{ required: true, message: '请选择测评文章', trigger: 'blur' }]
            },
            selIndex: '', //选中的index
            show: [],
            list: []
        }
    },
    components: { ArticleLibrary, ApplicationLibrary },

    created() {
        if (this.$route.query.id) {
            this.getInfoById(this.$route.query.id) //查询数据 用作显示编辑
            this.info.id = this.$route.query.id
        }
        this.getModule()
    },
    mounted() {
        this.rowDrop()
    },

    methods: {
        //行拖拽
        rowDrop() {
            const tbody = document.querySelector('.el-table__body-wrapper tbody')
            const that = this
            // Sortable.create(tbody, {
            //     onEnd({ newIndex, oldIndex }) {
            //         const currRow = that.info.articleList.splice(oldIndex, 1)[0]
            //         that.info.articleList.splice(newIndex, 0, currRow)
            //     }
            // })
        },
        // 文章列表排序 向上移动
        sortUp(index) {
            if (index > 0) {
                let cloneObj = this.info.articleList[index]
                this.$set(this.info.articleList, index, this.info.articleList[index - 1])
                this.$set(this.info.articleList, index - 1, cloneObj)
                this.showPop(index - 1)
            }
        },
        // 文章列表排序 向下移动
        sortDown(index) {
            let len = this.info.articleList.length
            if (index < len - 1) {
                console.log(index)
                let cloneObj = this.info.articleList[index]
                this.$set(this.info.articleList, index, this.info.articleList[index + 1])
                this.$set(this.info.articleList, index + 1, cloneObj)
                this.showPop(index + 1)
            }
        },
        del(index) {
            this.info.articleList.splice(index, 1)
            if (index == 0) {
                this.popArt = this.info.articleList[index]
            } else {
                this.popArt = this.info.articleList[index - 1]
            }
        },
        showPop(index) {
            this.selIndex = index
            this.popArt = this.info.articleList[index]
            for (let i = 0; i < this.info.articleList.length; i++) {
                this.$set(this.show, i, false)
            }
            this.$set(this.show, index, true)
        },
        // 查询单个数据
        getInfoById(id) {
            getProjectSingle(id)
                .then(res => {
                    console.log('GOOGLE: 查询单个数据', res)
                    this.info = res
                    this.filePic = res.picture
                    this.fileUdp = res.underPicture
                    if (res.articleList == null) {
                        this.info.articleList = []
                    }
                    if (res.module == null) {
                        this.info.module = { id: '' }
                    }
                })
                .catch(err => {
                    // console.log(err.response.data.message)
                })
        },
        // 获取模块列表
        getModule() {
            getModuleList()
                .then(res => {
                    console.log('GOOGLE: 获取模块列表', res)
                    this.mdList = res
                })
                .catch(err => {
                    // console.log(err.response.data.message)
                })
        },
        // 图片上传 封面
        handleSuccessPic(response, file, fileList) {
            this.filenamePic = file.name
            this.filePic = response.data
            this.$notify({
                title: '文件上传成功',
                type: 'success',
                duration: 2500
            })
        },
        // 图片上传 底图
        handleSuccessUdp(response, file, fileList) {
            this.filenameUdp = file.name
            this.fileUdp = response.data

            this.$notify({
                title: '文件上传成功',
                type: 'success',
                duration: 2500
            })
        },
        handleBeforeRemove(file, fileList) {},
        handlePictureCardPreview(file) {},
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
        cancel() {
            this.dialogArticle = false
            this.dialogApp = false
        },
        // 获取选中文章列表
        getInfo(info) {
            //  对原有文章列表去重
            var result = []
            var obj = {}
            for (var i = 0; i < this.info.articleList.length; i++) {
                if (!obj[this.info.articleList[i].id]) {
                    result.push(this.info.articleList[i])
                    obj[this.info.articleList[i].id] = true
                }
            }
            this.info.articleList = result
            // 比较两组列表去重 保留新的一条
            console.log('GOOGLE: info', info)
            // console.log('GOOGLE: info', this.info.articleList)
            let delNum = 0

            for (let i = 0; i < info.length; i++) {
                for (let j = this.info.articleList.length - 1; j >= 0; j--) {
                    if (info[i].id == this.info.articleList[j].id) {
                        this.info.articleList.splice(j, 1)
                        delNum++
                    }
                }
            }
            if (delNum) {
                this.$notify({
                    title: `有${delNum}篇文章重复,已保留最新的`,
                    type: 'success',
                    duration: 2500
                })
            }
            this.info.articleList.push(...info)
            this.cancel()
        },
        openArticle() {
            this.dialogArticle = true
        },
        openApp() {
            this.dialogApp = true
        },
        articleDel(index) {
            this.info.articleList.splice(index, 1)
        },
        save(index) {
            // 验证数据
            this.$refs['formRef'].validate(valid => {
                // 验证表单内容
                if (valid) {
                    this.submit()
                } else {
                    this.$notify({
                        title: '请填写信息后再提交',
                        type: 'warning',
                        duration: 2500
                    })
                }
            })
        },
        // 提交数据
        submit() {
            this.info.picture = this.filePic
            this.info.underPicture = this.fileUdp
            // this.info.module.id = this.mdSel

            if (this.info.id) {
                // 有id为编辑
                projectEdit(this.info.id, this.info.title, this.info.subtitle, this.info.topPriority, this.info.picture, this.info.underPicture, this.info.articleList, this.info.module)
                    .then(res => {
                        console.log('GOOGLE: res id', res)
                        this.$notify({
                            title: '编辑成功',
                            type: 'success',
                            duration: 2500
                        })
                        // this.info.id = res.id
                    })
                    .catch(err => {
                        // console.log(err.response.data.message)
                    })
            } else {
                // 无id为添加
                projectCreat(this.info.title, this.info.subtitle, this.info.topPriority, this.info.picture, this.info.underPicture, this.info.articleList, this.info.module)
                    .then(res => {
                        this.$notify({
                            title: '添加成功',
                            type: 'success',
                            duration: 2500
                        })
                        this.info.id = res.id
                    })
                    .catch(err => {
                        // console.log(err.response.data.message)
                    })
            }
        }
    }
}
</script>
<style scoped="scoped">
.all {
    display: flex;
}
.left {
    flex-grow: 0;
}
.right {
    flex-grow: 0;
    margin-left: 80px;
}

.itemFitst .pop {
    top: 90px;
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
    color: #666;
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
.thimg {
    width: 150px;
}
</style>

<style lang="scss" scoped>
.special {
    position: relative;
    float: right;
    box-sizing: border-box;
    margin-right: 30px;
    padding: 30px 25px 69px;
    width: 30px;
    // display: inline-block;
    width: 350px;
    height: 715px;
    background: url('../../assets/ipx.png') no-repeat;
    background-size: 100% auto;
    .topic {
        margin-bottom: 20px;
        background: url('../../assets/img/pic_topic.png') no-repeat left / auto 14px;
        text-indent: 18px;
        font-weight: 600;
        font-size: 12px;
        .more {
            float: right;
            color: #999;
        }
    }
    .section-list::-webkit-scrollbar {
        display: none;
    }
    .section-list {
        overflow-y: scroll;
        box-sizing: border-box;
        margin: 0 auto 1rem;
        // width: 94%;
        height: 450px;
        border-radius: 5px;
        // background: url("../assets/img/artcile-bg@3x.png") center top;
        background-size: cover;
        .list-content {
            box-sizing: border-box;
            padding: 0.63rem 0.75rem;

            ul {
                box-sizing: border-box;
                padding: 0.6rem;
                border-radius: 5px;
                background-color: #fff;

                li {
                    display: -webkit-flex;
                    justify-content: space-between;
                    padding: 0.6rem 0;
                    border-bottom: 1px solid #f6f6f6;

                    &:last-of-type {
                        border: 0;
                    }

                    .content-left {
                        display: -webkit-flex;
                        flex: 1;
                        flex-direction: column;

                        p {
                            flex: 1;
                            color: rgba(51, 51, 51, 1);
                            // font-family: PingFang-SC-Bold, PingFang-SC;
                            font-weight: bold;
                            font-size: 0.75rem;
                            line-height: 1.06rem;
                        }

                        .left-number {
                            display: -webkit-flex;
                            align-items: center;
                            justify-content: flex-end;

                            div {
                                display: -webkit-flex;
                                align-items: center;
                                margin-right: 1rem;

                                img {
                                    margin-right: 0.3rem;
                                    width: 1.2rem;
                                    height: 1.2rem;
                                }

                                span {
                                    color: #999;
                                    // font-family: DIN-Medium, DIN;
                                    font-weight: 500;
                                    font-size: 0.75rem;
                                    line-height: 0.94rem;
                                }
                            }
                        }
                    }

                    .content-right {
                        width: 5.63rem;
                        height: 4.38rem;
                    }
                }
            }

            .list-all {
                display: -webkit-flex;
                justify-content: center;
                margin-top: 0.7rem;

                span {
                    color: rgba(255, 255, 255, 1);
                    // font-family: PingFang-SC-Medium, PingFang-SC;
                    font-weight: 500;
                    font-size: 0.88rem;
                    line-height: 1.25rem;
                }

                img {
                    width: 1.25rem;
                    height: 1.25rem;
                    vertical-align: middle;
                }
            }
        }
    }

    .list-top {
        box-sizing: border-box;
        padding: 0.63rem 0.75rem;
        height: 5.5rem;

        h2 {
            color: rgba(255, 255, 255, 1);
            // font-family: PingFang-SC-Bold, PingFang-SC;
            font-weight: bold;
            font-size: 1.25rem;
            line-height: 1.75rem;
        }

        h5 {
            margin-top: 0.3rem;
            color: rgba(255, 255, 255, 1);
            // font-family: PingFang-SC-Medium, PingFang-SC;
            font-weight: 500;
            font-size: 0.8rem;
            line-height: 1.06rem;
        }
    }
}
.section-productImg {
    display: block;
    justify-content: space-around;
    margin-bottom: 20px;
    font-family: 'Microsoft YaHei';
}
.productImg-left {
    position: relative;
    display: block;
    padding: 10px 2px 5px 2px;
    width: 200px;
    height: 117px;
    color: #fff;
}
.productImg-left h3 {
    margin: 16px 0 16px 5px;
    text-shadow: 0.1em 0.1em 0.1em #999;
    font-size: 16px;
}
.productImg-left h5 {
    margin: 0 0 0 5px;
    padding: 0;
    font-size: 12px;
}
.see {
    position: absolute;
    right: 10px;
    bottom: 5px;
    display: flex;
}
.see img {
    width: 20px;
}
.see span {
    padding-top: 1px;
    text-indent: 4px;
    font-size: 12px;
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
    max-height: 150px;
    width: 100%;
    border-radius: 8px 8px 0 0;
}
.list .timg {
    width: 60px;
    height: 60px;
}
.list .item {
    display: flex;
    justify-content: space-between;
    padding: 10px;
}
.list .item:first-child {
    border-radius: 8px 8px 0 0;
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
    height: 80px;
    text-align: center;
    line-height: 80px;
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
.instructions {
    color: #999;
    text-align: center;
    font-size: 14px;
}

.corner {
    margin: 2px auto 8px;
    width: 0px; /*  宽高设置为0，很重要，否则达不到效果 */
    height: 0px;
    border: 5px solid #999;
    border-right-color: transparent;
    border-bottom-color: transparent; /* 设置透明背景色 */
    border-left-color: transparent;
}
</style>
