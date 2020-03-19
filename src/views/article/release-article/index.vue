<template>
    <div class="releaseArticle">
        <el-row class="forms">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="60px" style="max-width: 1126px">
                <el-form-item prop="title" label="标题">
                    <el-input v-model="ruleForm.title" placeholder="输入标题(最多6~35个字)" style="width: 200px;"></el-input>
                </el-form-item>
                <el-row class="cover">
                    <label>封面</label>
                    <el-upload :action="actionUrl" :headers="headerToken" list-type="picture-card" :limit="1" :on-success="handleSuccess">
                        <i v-if="dialogImageUrl == ''" class="el-icon-plus"></i>
                        <img v-else :src="dialogImageUrl" alt="" />
                    </el-upload>
                </el-row>
                <el-form-item v-show="!wechatBoolean" prop="content" label="内容" style="margin-top: 50px;">
                    <!-- 富文本 -->
                    <Editor v-model="formatContent2" :content="formatContent" />
                </el-form-item>

                <div class="forms-bottom" :style="{ marginTop: !wechatBoolean ? '-250px' : '50px' }">
                    <el-form-item prop="user" label="作者">
                        <el-input v-model="ruleForm.user"></el-input>
                    </el-form-item>
                    <el-form-item prop="plate" label="板块">
                        <el-select v-model="ruleForm.plate">
                            <el-option v-for="item in ruleForm.plateList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                        </el-select>
                    </el-form-item>
                    <br />
                    <el-form-item prop="cata" label="分类">
                        <el-select v-model="ruleForm.cata">
                            <el-option v-for="item in ruleForm.cataList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="标签">
                        <el-input v-model="label"></el-input>
                    </el-form-item>
                    <p style="color: red;font-size: 14px;width: 200px;margin-left: 230px;margin-top: 0;">*每个标签用英文;隔开(标签1;标签2)</p>
                    <el-form-item label="微信文章" label-width="70px">
                        <el-switch v-model="wechatBoolean" active-color="#016DF8" inactive-color="#FEA03A" @change="switchChange"> </el-switch>
                    </el-form-item>
                    <el-form-item label="URL">
                        <el-input v-model="wechatUrl" :disabled="!wechatBoolean"></el-input>
                    </el-form-item>
                    <p style="color: red;font-size: 14px;width: 200px;margin-left: 230px;margin-top: 0;">*打开微信文章URL将优先展示微信文章，若关闭请清空URL</p>

                <el-row class="elBtn">
                    <el-button size="small" type="primary" @click="release('ruleForm')">保存</el-button>
                    <el-button size="small" type="info">取消</el-button>
                </el-row>
                </div>
            </el-form>
        </el-row>
    </div>
</template>

<script>
import Editor from '@/views/components/Editor.vue'
import { getToken } from '@/utils/auth'
import { postData } from '@/api/data'
import { initData } from '@/api/data'
import { putData } from '@/api/data'

export default {
    name: 'ReleaseArticle',
    components: {
        Editor
    },
    data() {
        return {
            ruleForm: {
                plateList: [], //板块列表
                cataList: [], //分类列表
                title: '',
                user: '',
                plate: '',
                cata: ''
            },
            rules: {
                title: [
                    {
                        required: true,
                        message: '请输入标题',
                        trigger: 'blur'
                    },
                    {
                        min: 6,
                        max: 35,
                        message: '长度在 6 到 35 个字符',
                        trigger: 'blur'
                    }
                ],
                content: [
                    {
                        required: true,
                        message: '请输入内容',
                        trigger: 'blur'
                    }
                ],
                // user: [
                //     {
                //         required: true,
                //         message: '请输入名称',
                //         trigger: 'blur'
                //     },
                //     {
                //         min: 2,
                //         max: 20,
                //         message: '长度在 2 到 20 个字符',
                //         trigger: 'blur'
                //     }
                // ],
                plate: [
                    {
                        required: true,
                        message: '请选择板块',
                        trigger: 'change'
                    }
                ],
                cata: [
                    {
                        required: true,
                        message: '请选择分类',
                        trigger: 'change'
                    }
                ]
            },
            actionUrl: '',
            headerToken: {
                Authorization: ''
            },
            dialogImageUrl: '',
            dialogVisible: false,
            formatContent: '',
            formatContent2: '',
            originalContent: '',
            draftsId: null,
            wechatBoolean: false,
            wechatUrl: '',
            label: ''
        }
    },
    methods: {
        token() {
            this.actionUrl = process.env.VUE_APP_BASE_API + '/api/oss/resources?configId=3'
            this.headerToken.Authorization = ' ' + getToken()
        },
        //微信文章开关
        switchChange() {},

        //文章分类目录
        articleCatalog() {
            initData('/api/category', {
                sign: 1,
                status: 1
            }).then(res => {
                this.ruleForm.cataList = res.content
            })
        },
        //获取板块列表
        plateList() {
            initData('/api/tModule/web', {}).then(res => {
                this.ruleForm.plateList = res
            })
        },
        //查询文章草稿
        draftArticle(id) {
            initData('/api/article/' + id).then(res => {
                this.ruleForm.title = res.title
                this.ruleForm.user = res.author
                this.ruleForm.cata = res.category.id
                this.ruleForm.plate = res.module.id
                this.label = res.tag
                this.formatContent = res.formatContent
                this.formatContent2 = res.formatContent
                this.dialogImageUrl = res.coverUrl
                if (res.wechatArticleUrl) {
                    this.wechatBoolean = true
                    this.wechatUrl = res.wechatArticleUrl
                }
            })
        },
        //写文章存草稿
        release(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if (this.formatContent2 == '' && !this.wechatBoolean) {
                        this.toast('请输入文章内容')
                    } else if (this.dialogImageUrl == '') {
                        this.toast('请选择封面')
                    } else if (this.wechatBoolean && this.wechatUrl == '') {
                        this.toast('请输入微信URL')
                    } else {
                        if (this.draftsId != null) {
                            var obj = {
                                id: this.draftsId,
                                coverUrl: this.dialogImageUrl,
                                author: this.ruleForm.user,
                                title: this.ruleForm.title,
                                category: {
                                    id: this.$refs[formName].model.cata
                                },
                                module: {
                                    id: this.$refs[formName].model.plate
                                },
                                formatContent: this.formatContent2,
                                tag: this.label,
                                status: 0,
                                wechatArticleUrl: this.wechatUrl
                            }
                            putData('/api/article', obj).then(res => {
                                this.toast('修改成功')
                            })
                        } else {
                            var obj = {
                                author: this.ruleForm.user,
                                title: this.ruleForm.title,
                                coverUrl: this.dialogImageUrl,
                                category: {
                                    id: this.$refs[formName].model.cata
                                },
                                module: {
                                    id: this.$refs[formName].model.plate
                                },
                                formatContent: this.formatContent2,
                                tag: this.label,
                                status: 0,
                                wechatArticleUrl: this.wechatUrl
                            }
                            postData('/api/article', obj).then(res => {
                                this.toast('保存成功')
                            })
                        }
                    }
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },

        //提示
        toast(msg) {
            this.$message({
                type: 'success',
                offset: '200',
                duration: 800,
                message: msg
            })
        },
        //上传图片
        handleSuccess(file) {
            this.dialogImageUrl = file.data[0]
        }
    },
    created() {
        this.token() //获取token
        this.articleCatalog() //目录列表
        this.plateList() //板块列表
        if (this.$route.query.id) {
            this.draftArticle(this.$route.query.id) //查询文章草稿
            this.draftsId = this.$route.query.id
        }
    },
    mounted() {}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.releaseArticle {
    box-sizing: border-box;
    padding: 20px 20px 50px;
}
.forms {
    box-sizing: border-box;
    padding: 20px;
    background-color: #fff;
    .el-form {
        .el-form-item {
            display: inline-block;
            margin-bottom: 20px;
        }
        .forms-bottom {
            width: 600px;
            .elBtn {
                display: flex;
                padding: 10px 150px 0;

                .el-button {
                    margin-right: 30px;
                }
            }
        }
    }
}

.content::-webkit-scrollbar {
    display: none;
}

/deep/ .cover {
    position: absolute;
    top: 20px;
    left: 25%;
    display: -webkit-box;

    label {
        margin-right: 10px;
        color: #666;
        font-weight: 600;
        font-size: 14px;
    }

    .el-upload--picture-card {
        display: inline-block;
        margin: 0 15px;
        width: 90px;
        height: 90px;
        line-height: 90px;
    }

    .el-upload-list__item {
        width: 90px;
        height: 90px;
    }

    img {
        width: 90px;
        height: 90px;
        border-radius: 5px;
    }

    button {
        margin-top: 70px;
        color: #666;
        font-size: 14px;
    }
}
</style>
