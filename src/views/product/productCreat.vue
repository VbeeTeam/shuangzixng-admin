<template>
    <div class="app-container">
        <el-form :model="zt" :rules="rules" ref="formPic" :inline="true" size="small" label-position="right" label-width="110px">
            <div class="head-container">
                <div class="title-wrap">
                    <span class="form-title">基本信息</span>
                </div>
                <!-- <el-form :inline="true" size="small" label-position="left" label-width="100px"> -->
                <el-form-item label="名称" prop="name">
                    <el-input placeholder="输入内容" v-model="zt.name"></el-input>
                </el-form-item>
                <el-form-item label="简介" prop="intro">
                    <el-input placeholder="输入内容" v-model="zt.intro"></el-input>
                </el-form-item>
                <el-form-item label="保险公司" prop="company">
                    <el-select class="" v-model="zt.company" default-first-option filterable placeholder="请选择">
                        <el-option v-for="(item, index) in companyLists" :key="index" :label="item.name" :value="index"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="基础保费" prop="baseFee">
                    <el-input placeholder="输入内容" v-model="zt.baseFee"></el-input>
                </el-form-item>
                <el-form-item label="推广链接" prop="salesUrl">
                    <el-input placeholder="输入内容" v-model="zt.salesUrl"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-select class="" v-model="zt.type" default-first-option placeholder="请选择">
                        <el-option v-for="(item, index) in typeLists" :key="index" :label="item" :value="item"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="服务费率">
                    <el-input placeholder="输入内容" v-model="zt.feeRate"></el-input>
                </el-form-item>

                <el-form-item label="评分" prop="score">
                    <el-input placeholder="输入内容" v-model.number="zt.score"></el-input>
                </el-form-item>
                <el-form-item label="渠道" prop="channel">
                    <el-select class="" v-model="zt.channel" default-first-option placeholder="请选择">
                        <el-option v-for="(item, index) in channelLists" :key="index" :label="item.name" :value="index"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="渠道商品ID" prop="channelProductId">
                    <el-input placeholder="输入内容" v-model="zt.channelProductId"></el-input>
                </el-form-item>
                <el-form-item label="标签">
                    <el-select class="long-select" style="" size="small" v-model="tagName" @change="handelTagChange" multiple filterable allow-create default-first-option placeholder="请选择">
                        <el-option v-for="(item, index) in tagLists" :key="index" :label="item.name" :value="index"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="upload-form" label="封面上传" prop="coverUrl">
                    <el-upload :before-remove="handleBeforeRemove" :before-upload="beforePicUpload" :on-success="handleSuccess" :action="uploadImg" :headers="headers" :show-file-list="false" class="upload-demo">
                        <!-- <div class="fileList">
                            <div class="filename" v-if="filename"><i class="el-icon-document"></i>{{ filename }}</div>
                        </div> -->
                        <div class="upbox">
                            <img :src="zt.coverUrl" alt="" class="upimg" />
                            <div class="stripes">点击上传</div>
                        </div>
                        <!-- <el-button size="small" type="primary" style="float:left">点击上传</el-button> -->
                        <!-- <div>
                            <img :src="zt.coverUrl" alt="" class="thimg" />
                        </div> -->
                        <div slot="tip" style="display: block;" class="el-upload__tip">tips:请上传图片，且文件不超过2M <br />一次只能上传一个文件，后上传的文件将覆盖之前的文件</div>
                    </el-upload>
                </el-form-item>
                <el-divider></el-divider>
            </div>
            <div class="head-container">
                <div class="title-wrap">
                    <span class="form-title">投保规则</span>
                </div>
                <!-- <el-form :inline="true" size="small" label-position="left" label-width="100px"> -->
                <el-form-item label="投保年龄" prop="insureAge">
                    <el-input placeholder="输入内容" v-model="zt.insureAge"></el-input>
                </el-form-item>
                <el-form-item label="投保期间" prop="timeLimit">
                    <el-input placeholder="输入内容" v-model="zt.timeLimit"></el-input>
                </el-form-item>
                <el-form-item label="交费期间" prop="payTimeLimit">
                    <el-input placeholder="输入内容" v-model="zt.payTimeLimit"></el-input>
                </el-form-item>
                <el-form-item label="最长交费期间" prop="payMaxTimeLimit">
                    <el-input placeholder="输入内容" v-model="zt.payMaxTimeLimit"></el-input>
                </el-form-item>
                <el-form-item label="最高保额" prop="maxInsureAmount">
                    <el-input placeholder="输入内容" v-model.number="zt.maxInsureAmount"></el-input>
                </el-form-item>
                <el-form-item label="等待期" prop="waitingPeriod">
                    <el-input placeholder="输入内容" v-model="zt.waitingPeriod"></el-input>
                </el-form-item>
                <el-form-item label="适用职业" prop="forJob">
                    <el-input placeholder="输入内容" v-model="zt.forJob"></el-input>
                </el-form-item>
                <el-form-item label="免责条款" prop="exceptionClause">
                    <el-input placeholder="输入条数" v-model.number="zt.exceptionClause"> </el-input>
                </el-form-item>
                <el-form-item label="健康告知" prop="healthAdvice">
                    <el-input placeholder="输入条数" v-model.number="zt.healthAdvice"> </el-input>
                </el-form-item>
                <el-form-item label="是否吸烟" prop="smoke">
                    <el-switch v-model="zt.smoke" inactive-text="否" active-text="是"> </el-switch>
                </el-form-item>
                <el-form-item label="收入要求" prop="incomeRequirement">
                    <el-switch v-model="zt.incomeRequirement" inactive-text="否" active-text="是"> </el-switch>
                </el-form-item>
                <el-form-item label="智能核保" prop="aiCheck">
                    <el-switch v-model="zt.aiCheck" inactive-text="否" active-text="是"> </el-switch>
                </el-form-item>
                <!-- </el-form> -->
                <el-divider></el-divider>
            </div>
            <div class="fcol">
                <div class="head-container">
                    <div class="item-title">
                        <div class="item-text">保障项</div>
                        <div class="item-btn" @click="ensureAdd(1)">添加 +</div>
                        <!-- <el-button class="add" type="text" size="small" @click="ensureAdd(1)">添加 +</el-button> -->
                    </div>
                    <el-table class="item-table" :data="zt.insureListTrue" :show-header="false" fit highlight-current-row>
                        <el-table-column label="名称" align="left" width="240">
                            <template slot-scope="scope">
                                <el-form-item class="rules" label="名称" label-width="60px" :prop="'insureListTrue.' + scope.$index + '.itemName'" :rules="rulesFeature">
                                    <el-select v-model="scope.row.itemName" filterable allow-create default-first-option placeholder="请选择">
                                        <el-option v-for="(item, index) in itemLists" :key="index" :label="item" :value="item"> </el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="" align="left" width="400">
                            <template slot-scope="scope">
                                <el-form-item class="rules" label="内容" label-width="60px" :prop="'insureListTrue.' + scope.$index + '.content'" :rules="rulesFeature">
                                    <el-input class=" long-input" placeholder="输入内容" v-model="scope.row.content"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="" align="center" width="98">
                            <template slot-scope="scope">
                                <el-form-item class="rules" label="">
                                    <el-button class="btn-warning " type="text" size="small" @click.native="ensureDel(1, scope.$index)">删除</el-button>
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="head-container">
                    <div class="item-title">
                        <div class="item-text">非保障项</div>
                        <div class="item-btn" @click="ensureAdd(2)">添加 +</div>
                        <!-- <el-button class="add" type="text" size="small" @click="ensureAdd(2)">添加 +</el-button> -->
                    </div>
                    <el-table class="item-table" :data="zt.insureListFalse" :show-header="false" fit highlight-current-row>
                        <el-table-column label="" align="left" width="240">
                            <template slot-scope="scope">
                                <el-form-item class="rules" label="名称" label-width="60px" :prop="'insureListFalse.' + scope.$index + '.itemName'" :rules="rulesFeature">
                                    <el-select v-model="scope.row.itemName" filterable allow-create default-first-option placeholder="请选择">
                                        <el-option v-for="(item, index) in itemLists" :key="index" :label="item" :value="item"> </el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="" align="left" width="400">
                            <template slot-scope="scope">
                                <el-form-item class="rules" label="内容" label-width="60px" :prop="'insureListFalse.' + scope.$index + '.content'" :rules="rulesFeature">
                                    <el-input class="  long-input" placeholder="输入内容" v-model="scope.row.content"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" width="98">
                            <template slot-scope="scope">
                                <el-button class="btn-warning " type="text" size="small" @click.native="ensureDel(2, scope.$index)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="head-container">
                <div class="title-wrap">
                    <span class="form-title">点评</span>
                </div>
                <el-form-item label="适用人群" prop="applicablePopulation">
                    <el-input placeholder="输入内容" v-model="zt.applicablePopulation"></el-input>
                </el-form-item>
                <el-form-item label="综合评测" prop="evaluating">
                    <el-input class=" long-input" type="textarea" :rows="1" placeholder="输入内容" v-model="zt.evaluating"></el-input>
                </el-form-item>
                <el-form-item label="需要注意" prop="notice">
                    <el-input class=" long-input" type="textarea" :rows="1" placeholder="输入内容" v-model="zt.notice"></el-input>
                </el-form-item>

                <el-form-item label="产品条款">
                    <el-upload style="width: 400px;" :before-remove="handleBeforeRemoveTerms" :before-upload="beforeTermsUpload" :on-success="handleSuccessTerms" :on-error="handleError" :headers="headers" :action="uploadFile" :show-file-list="true" :file-list="termsFiles">
                        <el-button size="small" type="primary" style="float:left">上传</el-button>
                        <div slot="tip" style="display: block;" class="el-upload__tip">tips:请上传word、pdf，且文件不超过2M</div>
                    </el-upload>
                </el-form-item>
                <div class="dp">
                    <!--  -->
                    <div class="head-container">
                        <div class="item-title">
                            <div class="item-text">测评文章</div>
                            <div class="item-btn" @click="openApp">应用文章库 +</div>
                            <!-- <el-button class="add" type="text" size="small" @click="openApp">应用文章库</el-button> -->
                        </div>
                        <el-table class="item-table" :data="zt.articleList" :show-header="false" fit highlight-current-row>
                            <el-table-column label="标题" align="left" width="650">
                                <template slot-scope="scope">
                                    <el-form-item class="rules" label="标题" label-width="60px">
                                        <span>{{ scope.row.title }}</span>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" align="center" width="88">
                                <template slot-scope="scope">
                                    <el-button class="btn-warning" type="text" size="mini" @click.native="articleDel(scope.$index)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <!--  -->
                    <div class="head-container">
                        <div class="item-title">
                            <div class="item-text">优点</div>
                            <div class="item-btn" @click="featuresAdd(1)">优点添加 +</div>
                            <!-- <el-button class="add" type="text" size="small" @click.native="featuresAdd(1)">优点添加 +</el-button> -->
                        </div>
                        <el-table class="item-table" :data="zt.featuresListTrue" :show-header="false" fit highlight-current-row>
                            <el-table-column label="内容" align="left" width="650">
                                <template slot-scope="scope">
                                    <el-form-item class="rules" label="内容" :prop="'featuresListTrue.' + scope.$index + '.content'" :rules="rulesFeature">
                                        <el-input class=" long-input" placeholder="输入内容" v-model="scope.row.content"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="删除" align="center" width="88">
                                <template slot-scope="scope">
                                    <el-button class="btn-warning" type="text" size="small" @click.native="featuresDel(1, scope.$index)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="head-container">
                        <div class="item-title">
                            <div class="item-text">缺点</div>
                            <div class="item-btn" @click="featuresAdd(2)">缺点添加 +</div>
                            <!-- <el-button class="add" type="text" size="small" @click.native="featuresAdd(2)">缺点添加 +</el-button> -->
                        </div>
                        <el-table class="item-table" :data="zt.featuresListFalse" :show-header="false" fit highlight-current-row>
                            <el-table-column label="内容" align="left" width="650">
                                <template slot-scope="scope">
                                    <el-form-item class="rules" label="内容" :prop="'featuresListFalse.' + scope.$index + '.content'" :rules="rulesFeature">
                                        <el-input class=" long-input" placeholder="输入内容" v-model="scope.row.content"></el-input>
                                    </el-form-item>
                                </template>
                            </el-table-column>
                            <el-table-column label="删除" align="center" width="88">
                                <template slot-scope="scope">
                                    <el-button class="btn-warning" type="text" size="small" @click.native="featuresDel(2, scope.$index)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
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
            <el-divider></el-divider>
            <div style="text-align:center">
                <el-button class="long-button" type="primary" size="small" @click.native="save">保存</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
import { productCreat, getTagList, getCompany, getItemList, getChannel, productEdit, getProductSingle } from '@/api/product'
import { uploadFile } from '@/api/upload'
import { sourceUploadImages } from '@/api/wechat'
import { deepClone } from '@/utils/deepClone'
import ArticleLibrary from '@/views/components/ArticleLibrary'
import ApplicationLibrary from '@/views/components/ApplicationLibrary'

import { getToken } from '@/utils/auth'

export default {
    data() {
        return {
            id: '',
            uploadFile: uploadFile,
            dialogArticle: false,
            dialogApp: false,
            headers: { Authorization: ' ' + getToken() },
            filename: '',
            file: '',
            thumbUrl: '',
            uploadImg: sourceUploadImages,
            zt: {
                intro: '',
                aiCheck: true,
                applicablePopulation: '',
                articleList: [],
                baseFee: 0,
                channel: '',
                channelProductId: '',
                clauseFiles: [],
                company: '',
                coverUrl: '',
                evaluating: '',
                exceptionClause: 1,
                feeRate: '',
                forJob: '',
                healthAdvice: 1,
                incomeRequirement: true,
                insureAge: '',
                insureProductFeatures: [],
                insureProductItems: [],
                insureProductTags: [],
                maxInsureAmount: 0,
                name: '',
                notice: '',
                payMaxTimeLimit: '',
                payTimeLimit: '',
                salesUrl: '',
                score: 0,
                selling: false,
                smoke: true,
                timeLimit: '',
                type: '',
                waitingPeriod: '',
                // 保障项 临时列表
                insureListTrue: [],
                insureListFalse: [],
                // 优缺点 临时列表
                featuresListTrue: [],
                featuresListFalse: []
            },
            // 输入验证规则 除服务费率、评分、标签、产品条款、测评文章外，其他项都必填
            rules: {
                name: [{ required: true, message: '请输入内容', trigger: 'blur' }],
                intro: [{ required: true, message: '请输入内容', trigger: 'blur' }],
                company: [{ required: true, message: '请输入内容', trigger: 'change' }],
                baseFee: [
                    { required: true, message: '请输入内容', trigger: 'blur' },
                    { type: 'number', message: '请输入数字', trigger: 'blur' }
                ],
                salesUrl: [{ required: true, message: '请输入内容', trigger: 'blur' }],
                type: [{ required: true, message: '请输入内容', trigger: 'change' }],
                score: [{ type: 'number', message: '请输入数字', trigger: 'blur' }],
                channel: [{ required: true, message: '请输入内容', trigger: 'change' }],
                channelProductId: [{ required: true, message: '请输入内容', trigger: 'blur' }],
                coverUrl: [{ required: true, message: '请上传封面', trigger: 'blur' }],

                insureAge: [{ required: true, message: '请输入内容', trigger: 'blur' }],
                timeLimit: [{ required: true, message: '请输入内容', trigger: 'blur' }],
                payTimeLimit: [{ required: true, message: '请输入内容', trigger: 'blur' }],
                payMaxTimeLimit: [{ required: true, message: '请输入内容', trigger: 'blur' }],
                maxInsureAmount: [
                    { required: true, message: '请输入内容', trigger: 'blur' },
                    { type: 'integer', message: '请输入整数', trigger: 'blur' }
                ],
                waitingPeriod: [{ required: true, message: '请输入内容', trigger: 'blur' }],
                forJob: [{ required: true, message: '请输入内容', trigger: 'blur' }],
                exceptionClause: [
                    { required: true, message: '请输入内容', trigger: 'blur' },
                    { type: 'integer', min: 0, max: 9999, message: '请输入整数', trigger: 'blur' }
                ],
                healthAdvice: [
                    { required: true, message: '请输入内容', trigger: 'blur' },
                    { type: 'integer', min: 0, max: 9999, message: '请输入整数', trigger: 'blur' }
                ],
                smoke: [{ required: true, message: '请输入内容', trigger: 'blur' }],
                incomeRequirement: [{ required: true, message: '请输入内容', trigger: 'blur' }],
                aiCheck: [{ required: true, message: '请输入内容', trigger: 'blur' }],

                applicablePopulation: [{ required: true, message: '请输入内容', trigger: 'blur' }],
                evaluating: [{ required: true, message: '请输入内容', trigger: 'blur' }],
                notice: [{ required: true, message: '请输入内容', trigger: 'blur' }]
            },
            rulesFeature: [{ required: true, message: '请输入内容', trigger: 'blur' }],
            // 保障项名称列表 select
            itemLists: [],
            // 保险公司列表 select
            tagLists: [],
            // 保险产品标签列表 select
            companyLists: [],
            // 类型列表 select
            typeLists: ['重疾', '医疗', '人寿', '财产', '意外', '年金', '旅游'],
            // 查询保险渠道列表 select
            channelLists: [],
            // 临时存储数据 主要为select
            // companyName: '',
            tagName: [],
            // channel: [],
            // 保障项 临时列表
            insureListTrue: [],
            insureListFalse: [],
            // 优缺点 临时列表
            featuresListTrue: [],
            featuresListFalse: [],
            // 产品条款 上传临时列表
            termsFiles: []
            // 测评文章 上传临时列表
            // articleFiles: []
        }
    },
    components: { ArticleLibrary, ApplicationLibrary },
    computed: {
        // 保障项 guardItem true 筛选区分
        tItem: function() {
            return this.zt.insureProductItems.filter(item => {
                return item.guardItem == true
            })
        },
        // 非保障项 guardItem false 筛选区分
        fItem: function() {
            return this.zt.insureProductItems.filter(item => {
                return item.guardItem == false
            })
        },
        // 优点 guardItem true 筛选区分
        tFeatures: function() {
            return this.zt.insureProductFeatures.filter(item => {
                return item.merit == true
            })
        },
        // 缺点 guardItem false 筛选区分
        fFeatures: function() {
            return this.zt.insureProductFeatures.filter(item => {
                return item.merit == false
            })
        }
    },
    watch: {},
    inject: ['reload'],
    created() {
        this.id = this.$route.query.id
    },
    mounted() {
        let that = this

        this.getItemSel()
        if (this.id) {
            Promise.all([this.getData(), this.getCompanySel(), this.getChannelSel(), this.getTagSel()])
                .then(result => {
                    // console.log('GOOGLE: 查询列表', result)
                    // 绑定保险公司等select
                    let pdata = result[0]
                    let companyList = result[1]
                    let channelList = result[2]
                    let tagList = result[3]
                    // 绑定id
                    that.zt.id = pdata.id
                    // 绑定select
                    // 保险公司
                    let company = that.getIndex(pdata.company, companyList)
                    that.zt.company = company
                    // 标签
                    let tag = that.getIndex(pdata.insureProductTags, tagList)
                    that.tagName = tag
                    // 渠道
                    let channel = that.getIndex(pdata.channel, channelList)
                    that.zt.channel = channel
                })
                .catch(error => {
                    console.log(error)
                })
        } else {
            this.getCompanySel()
            this.getChannelSel()
            this.getTagSel()
        }

        // this.getData()
    },

    methods: {
        // 编辑前 获取信息
        getData() {
            let that = this
            return new Promise((resolve, reject) => {
                getProductSingle(that.id)
                    .then(res => {
                        // console.log('GOOGLE: getData', res)
                        res.articleList = JSON.parse(res.articleList)
                        res.clauseFiles = JSON.parse(res.clauseFiles)
                        // 绑定数据 置空再赋值
                        that.zt = {}
                        that.zt = res
                        // 封面url复制 用作显示
                        // that.thumbUrl = res.coverUrl
                        // 处理上传列表 产品条款
                        res.clauseFiles.map(item => {
                            that.termsFiles.push({
                                name: item.fileName,
                                url: item.url
                            })
                        })
                        // 区分保障项 优缺点列表
                        that.zt.insureListTrue = that.tItem
                        that.zt.insureListFalse = that.fItem
                        that.zt.featuresListTrue = that.tFeatures
                        that.zt.featuresListFalse = that.fFeatures
                        resolve(res)
                    })
                    .catch(err => {
                        reject(err)
                        // console.log(err.response.data.message)
                    })
            })
        },
        // 获取产品信息后 判断select选中的的index值 做选中绑定
        getIndex(selected, list) {
            //如果有push方法则 定义newObj为数组，否则为对象。
            let isArry = selected.push ? true : false
            if (isArry) {
                // selected为数组 多选
                let idxArr = []
                selected.map(val => {
                    let idx = list.findIndex(item => item.id == val.id)
                    idxArr.push(idx)
                })
                return idxArr
            } else {
                // selected为对象 单选
                let idx = list.findIndex(item => item.id == selected.id)
                return idx
            }
        },
        // 增加一行 保障项/非
        ensureAdd(val) {
            if (val == 1) {
                this.zt.insureListTrue.push({
                    content: '',
                    guardItem: true,
                    itemName: ''
                })
            } else if (val == 2) {
                this.zt.insureListFalse.push({
                    content: '',
                    guardItem: false,
                    itemName: ''
                })
            }
        },
        // 删除 保障项
        ensureDel(val, index) {
            if (val == 1) {
                this.zt.insureListTrue.splice(index, 1)
            } else if (val == 2) {
                this.zt.insureListFalse.splice(index, 1)
            }
        },
        // 增加一行 优缺点
        featuresAdd(val) {
            if (val == 1) {
                this.zt.featuresListTrue.push({
                    content: '',
                    merit: true
                })
            } else if (val == 2) {
                this.zt.featuresListFalse.push({
                    content: '',
                    merit: false
                })
            }
        },
        // 删除 优缺点
        featuresDel(val, index) {
            if (val == 1) {
                this.zt.featuresListTrue.splice(index, 1)
            } else if (val == 2) {
                this.zt.featuresListFalse.splice(index, 1)
            }
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
        // 产品条款 上传成功处理数据
        handleSuccessTerms(response, file, fileList) {
            this.termsFiles.push({
                name: file.name,
                url: file.response.data,
                uid: file.uid
            })
            this.$notify({
                title: '文件上传成功',
                type: 'success',
                duration: 2500
            })
        },
        // 产品条款 删除处理数据
        handleBeforeRemoveTerms(file, fileList) {
            this.termsFiles = this.termsFiles.filter(item => {
                return item.uid != file.uid
            })
        },

        // 产品条款 文件上传前判断
        beforeTermsUpload(file) {
            let typeArr = ['application/msword', 'application/pdf', 'application/vnd.ms-works', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
            const isJPG = typeArr.includes(file.type)
            const isLt2M = file.size / 1024 / 1024 < 5

            if (!isJPG) {
                this.$message.error('上传文件只能是word pdf格式 ')
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

        // 图片上传方法
        handleSuccess(response, file, fileList) {
            this.filename = file.name
            this.zt.coverUrl = response.data
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

        // textarea文本域回车切换 回车转<br/>
        getFormatCode() {
            this.baseData.title = this.baseData.title
                .replace(/\r\n/g, '<br/>')
                .replace(/\n/g, '<br/>')
                .replace(/\s/g, ' ')
        },
        // textarea <br/>转回车
        getCode(strValue) {
            return strValue.replace(/<br\/>/g, '\n')
        },
        // 保险产品保障项名称列表
        getItemSel() {
            let that = this
            getItemList()
                .then(res => {
                    res.map(item => {
                        if (item) {
                            that.itemLists.push(item)
                        }
                    })
                })
                .catch(err => {
                    // console.log(err.response.data.message)
                })
        },
        // 保险公司列表
        getCompanySel() {
            let that = this
            return new Promise((resolve, reject) => {
                getCompany()
                    .then(res => {
                        that.companyLists = res
                        resolve(res)
                    })
                    .catch(err => {
                        reject(err)
                        // console.log(err.response.data.message)
                    })
            })
        },
        // 保险产品标签列表
        getTagSel() {
            let that = this
            return new Promise((resolve, reject) => {
                getTagList()
                    .then(res => {
                        that.tagLists = res
                        resolve(res)
                    })
                    .catch(err => {
                        reject(err)
                        // console.log(err.response.data.message)
                    })
            })
        },
        // 渠道列表
        getChannelSel() {
            let that = this
            return new Promise((resolve, reject) => {
                getChannel()
                    .then(res => {
                        that.channelLists = res
                        resolve(res)
                    })
                    .catch(err => {
                        reject(err)

                        // console.log(err.response.data.message)
                    })
            })
        },
        // 保险公司 处理select选中后数据格式 改为提交时处理
        handelCompanyChange(index) {
            // this.zt.company = {}
            // this.zt.company = this.companyLists[index]
            return this.companyLists[index]
        },
        // 基本信息-标签 处理select选中后数据格式
        handelTagChange(val) {
            // console.log('GOOGLE: val', val)
            this.zt.insureProductTags = []
            val.map(item => {
                if (typeof item == 'number') {
                    this.zt.insureProductTags.push(this.tagLists[item])
                } else if (typeof item == 'string') {
                    this.zt.insureProductTags.push({
                        name: item
                    })
                }
            })
        },
        // 渠道 处理select选中后数据格式 改为提交时处理
        handleChannelChange(index) {
            // console.log('GOOGLE: val', val)
            // this.zt.channel = {}
            // this.zt.channel = this.channelLists[index]
            return this.channelLists[index]
        },
        // 标签 多选删除
        handelTagRemove(val) {},
        // 弹窗相关
        getInfo(info) {
            console.log('GOOGLE: getInfo -> info', info)
            this.zt.articleList.push(...info)
            this.cancel()
        },
        cancel() {
            this.dialogArticle = false
            this.dialogApp = false
        },
        openArticle() {
            this.dialogArticle = true
        },
        openApp() {
            this.dialogApp = true
        },
        articleDel(index) {
            this.zt.articleList.splice(index, 1)
        },

        // 验证保存上传
        save() {
            this.$refs['formPic'].validate(valid => {
                // 验证表单内容
                if (valid) {
                    //判断优缺点 保障项是否填写
                    if (this.zt.insureListTrue.length == 0 || this.zt.insureListFalse.length == 0) {
                        this.$notify({
                            title: '请添加保障项和非保障项',
                            type: 'warning',
                            duration: 2500
                        })
                    } else if (this.zt.featuresListTrue.length == 0 || this.zt.featuresListFalse.length == 0) {
                        this.$notify({
                            title: '请添加优缺点',
                            type: 'warning',
                            duration: 2500
                        })
                    } else {
                        this.submit()
                    }
                } else {
                    this.$notify({
                        title: '请填写完整后再提交',
                        type: 'warning',
                        duration: 2500
                    })
                }
            })
        },
        // 提交数据
        submit() {
            //createTime 为null 深拷贝报错
            delete this.zt.createTime
            // 处理上传列表 产品条款
            this.zt.clauseFiles = []
            this.termsFiles.map(item => {
                this.zt.clauseFiles.push({
                    fileName: item.name,
                    url: item.url
                })
            })
            // 封面url
            // this.zt.coverUrl = this.thumbUrl
            // 保障列表合并
            this.zt.insureProductItems = []
            this.zt.insureProductItems.push(...this.zt.insureListTrue, ...this.zt.insureListFalse)
            // 优缺点列表合并
            this.zt.insureProductFeatures = []
            this.zt.insureProductFeatures.push(...this.zt.featuresListTrue, ...this.zt.featuresListFalse)

            // 深拷贝一个对象数据 用来字符串化两个参数 否则会污染原数据
            let newZt = deepClone(this.zt)
            newZt.articleList = JSON.stringify(newZt.articleList)
            newZt.clauseFiles = JSON.stringify(newZt.clauseFiles)
            // 赋值几个选项列表的值 因为提交时需要是对象 select绑定的单个值
            newZt.channel = {}
            newZt.channel = this.handleChannelChange(this.zt.channel)
            newZt.company = {}
            newZt.company = this.handelCompanyChange(this.zt.company)

            if (this.id) {
                productEdit(newZt)
                    .then(res => {
                        this.$notify({
                            title: '编辑成功',
                            message: '正在刷新本页面',
                            type: 'success',
                            duration: 2500
                        })
                        this.reload()
                    })
                    .catch(err => {
                        this.$notify({
                            title: '请正确完整填写信息',
                            type: 'warning',
                            duration: 2500
                        })
                        // console.log(err.response.data.message)
                    })
            } else {
                productCreat(newZt)
                    .then(res => {
                        this.id = res.id
                        this.zt.id = res.id
                        this.$notify({
                            title: '添加成功',
                            message: '跳转至编辑页面',
                            type: 'success',
                            duration: 2500
                        })
                        this.$router.push({
                            name: 'productCreat',
                            query: {
                                id: this.id
                            }
                        })
                    })
                    .catch(err => {
                        this.$notify({
                            title: '请正确完整填写信息',
                            type: 'warning',
                            duration: 2500
                        })
                        // console.log(err.response.data.message)
                    })
            }
        }
    }
}
</script>
<style scoped="scoped">
.fcol {
    margin-left: 40px;
    width: 740px;
    /* display: flex;
    justify-content: flex-start; */
}
.dp {
    margin-left: 40px;
    width: 740px;
}
.fcol .head-container {
    /* margin-right: 50px; */
}
.flex {
    display: flex;
    justify-content: flex-start;
}
.flex .table-wrap {
    margin-right: 50px;
}
.bold {
    font-weight: 900;
}
.thimg {
    margin-top: 15px;
    width: 200px;
}
.form-title {
    margin-left: -20px;
    padding: 2px 18px;
    background-color: rgba(233, 245, 254, 1);
    color: #016df8;
    font-weight: 900;
    font-size: 16px;
}
.title-wrap {
    margin-bottom: 35px;
}
/* 保障项等表格样式 */
.item-title {
    display: flex;
    justify-content: space-between;
    background-color: #f2f6fc;
}

.item-title .item-text {
    text-indent: 20px;
    font-size: 14px;
    line-height: 40px;
}
.item-title .item-btn {
    padding-right: 20px;
    color: #016df8;
    text-indent: 20px;
    font-size: 14px;
    line-height: 40px;
    cursor: pointer;
}
.item-title .item-btn:hover {
    color: #348af9;
}
.item-title .add {
    margin-top: 5px;
}
.item-title .el-form-item--small.el-form-item,
.item-table .el-form-item--small.el-form-item {
    margin-bottom: 0;
}
.item-table {
    border: 1px solid #f2f6fc;
    border-top: none;
}
.item-table >>> td {
    border-bottom: none;
}
</style>
<style>
.el-select__input {
    vertical-align: top;
}
</style>