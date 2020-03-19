<template>
    <div class="app-container over">
        <el-form>
            <el-form-item label="昵称" label-width="80px">
                <el-input v-model="search.nickName"></el-input>
            </el-form-item>
            <el-form-item label="姓名" label-width="80px">
                <el-input v-model="search.name"></el-input>
            </el-form-item>
            <el-form-item label="电话" label-width="80px">
                <el-input v-model="search.phone"></el-input>
            </el-form-item>
            <el-form-item label="顾问" label-width="80px">
                <el-input v-model="search.adviser"></el-input>
            </el-form-item>
            <el-form-item label="地区" label-width="80px">
                <div class="block">
                    <el-cascader ref="refSubCat" :options="search.locationList" @change="changeLoation"></el-cascader>
                </div>
            </el-form-item>
            <br />
            <el-form-item label="收入" label-width="80px">
                <el-select v-model="search.yearIncome">
                    <el-option v-for="(item,i) in search.yearIncomeList" :key="i" :label="item" :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="支付状态" label-width="80px">
                <el-select v-model="search.yearIncome">
                    <el-option v-for="(item,i) in search.yearIncomeList" :key="i" :label="item" :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="生日时间" label-width="80px">
                <div class="block">
                    <el-date-picker v-model="search.birthDate" type="datetimerange" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                        range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                </div>
            </el-form-item>
            <el-form-item label="定制人" label-width="80px">
                <el-input v-model="search.cusPerson"></el-input>
            </el-form-item>
            <br />
            <el-form-item label="创建时间" label-width="80px">
                <div class="block">
                    <el-date-picker v-model="search.createTime" type="datetimerange" format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                </div>
            </el-form-item>
            <el-form-item label="渠道" label-width="80px">
                <el-select v-model="search.channel">
                    <el-option v-for="(item,i) in search.channelList" :key="i" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="主体" label-width="80px">
                <el-select v-model="search.content">
                    <el-option v-for="(item,i) in search.contentList" :key="i" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="margin-left: 30px;">
                <el-button size='small' type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
            </el-form-item>

        </el-form>

        <div class="dialog">
            <el-dialog title="方案预览" :visible.sync="centerDialogVisible" :modal-append-to-body="false" width="20%">
                <div class="preview">
                    <h4>总览</h4>
                    <div class="overview">
                        <div>
                            <div v-for="(item1,index9) in totalPlanDetail" :key="index9">
                                <span>{{item1.insureType}}总保障：{{item1.insureLines}}W</span>
                            </div>
                        </div>


                        <div>
                            <span v-for="(item1,index8) in totalTabcus" :key="index8">{{item1.insuredPerson}}保费：{{item1.totalYearPremium}}</span>
                            <span>总保费：{{totalYear}}</span>
                        </div>

                    </div>
                    <ul>
                        <li v-for="(item1,index4) in totalTabcus" :key="index4">
                            <h4>{{item1.insuredPerson}}方案</h4>
                            <div v-for="(item2,index7) in item1.planDetail" :key="index7">
                                <span v-if="item2.insureLines">{{item2.insureType}}保障：{{item2.insureLines}}</span>

                                <span v-if="item2.product">{{item2.insureType}}险：{{item2.product.name}}<br />
                                    保障额度{{item2.insureLines}}W / 保障期限{{item2.insureTimeLimit}} / 缴费期限{{item2.payTimeLimit}}
                                    / 年交保费{{item2.yearPremium}}
                                </span>
                            </div>

                        </li>
                    </ul>
                </div>

            </el-dialog>
        </div>

        <el-table class="tableStyle" border ref="multipleTable" :data="notcusList" :header-cell-style="tableHeaderColor"
            :cell-style="tableCellStyle" style="width: 100%" v-loading="loading" @selection-change="selectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" label="序号" width="100">
            </el-table-column>
            <el-table-column prop="planType" label="方案类型" width="100">
            </el-table-column>
            <el-table-column label="方案" width="100">
                <template slot-scope="scope">
                    <span class="copy-btn" @click="doCopy(scope.row.customer.userId)">复制链接</span>

                </template>
            </el-table-column>
            <el-table-column prop="channel" label="渠道" width="100">
            </el-table-column>
            <el-table-column prop="nickName" label="昵称" width="120">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="120">
                <template slot-scope="scope">
                    <span @click="dialogUser(scope.$index)">{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column label="年龄" width="100">
                <template slot-scope="scope">
                    <div v-for="(item,index2) in scope.row.customer.familyMemberList" :key="index2">
                        {{item.relation}}&nbsp;:&nbsp;{{item.age}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="被保人" width="120">
                <template slot-scope="scope">
                    <div v-for="(item,index10) in scope.row.insuredPerson" :key="index10">
                        {{item}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="phone" label="手机号" width="150">
            </el-table-column>
            <el-table-column prop="madePersonName" label="顾问" width="120">
            </el-table-column>
            <el-table-column prop="madePersonName" label="定制人" width="120">
            </el-table-column>
            <el-table-column prop="status" label="支付状态" width="120">
                <template slot-scope="scope">
                    <span v-if="scope.row.status == 0">免费</span>
                    <span v-else-if="scope.row.status == 1">未支付</span>
                    <span v-else-if="scope.row.status == 2">已支付</span>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="定制完成时间">
                <template slot-scope="scope">{{ parseTime(scope.row.updateTime) }}</template>
            </el-table-column>

        </el-table>
        <div class="table-btn">
            <el-button size='small' type="info" @click="dialog()">预览</el-button>
            <el-button size='small' type="info" @click="userDetail()">客情信息</el-button>
            <el-button size='small' type="info" @click="toCus(1)">重新定制</el-button>
            <el-button size='small' type="info" @click="toCus(0)">备选方案</el-button>
            <el-button size='small' type="info">申请退款</el-button>
            <el-button size='small' type="info" @click="excel()">导出</el-button>

        </div>
        <div class="block" style="margin-top:20px;">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage"
                :page-sizes="[10, 20, 30, 50]" :page-size="size" layout="total,sizes, prev, pager, next" :total="totalNum">
            </el-pagination>
        </div>

        <div class="dialogUser">
            <el-dialog :visible.sync="dialogFormUser" :modal-append-to-body='false' top="30vh">
                <el-form>

                    <p>客户信息</p>
                    <div class="from-content">
                        <div class="from-left">
                            <p>基本信息</p>
                            <el-form-item label="昵称" >
                                <span>{{fromList.nickName}}</span>
                            </el-form-item>
                            <el-form-item label="性别" >
                                <span v-if="fromList.sex">男</span>
                                <span v-else>女</span>
                            </el-form-item>
                            <el-form-item label="年龄" >
                                <span>{{fromList.age}}</span>
                            </el-form-item>
                            <el-form-item label="生日" >
                                <span>{{fromList.birthDate}}</span>
                            </el-form-item>
                            <el-form-item label="地区" >
                                <span>{{fromList.location}}</span>
                            </el-form-item>
                            <el-form-item label="家庭成员" >
                                <span v-for="item in fromList.familyMembers" :key="item">{{item}}&nbsp;&nbsp;</span>
                            </el-form-item>
                            <el-form-item label="被保险人" >
                                <span v-for="item in fromList.insuredPerson" :key="item">{{item}}&nbsp;&nbsp;</span>
                            </el-form-item>
                            <el-form-item label="家庭收入" >
                                <span>{{fromList.yearIncome}}</span>
                            </el-form-item>
                            <el-form-item label="家庭贷款" >
                                <span>{{fromList.totalLending}}</span>
                            </el-form-item>
                        </div>
                        <div class="from-right">
                            <el-table :data="fromList.familyMemberList" :header-cell-style="tableHeaderColor"
                                :cell-style="tableCellStyle" style="width: 100%" v-loading="loading">

                                <el-table-column prop="relation" label="被保险人" width="100">
                                </el-table-column>
                                <el-table-column prop="age" label="年龄" width="50">
                                </el-table-column>
                                <el-table-column prop="birthDate" label="生日" width="100">
                                </el-table-column>
                                </el-table-column>
                                <el-table-column prop="medicalHistory" label="病史" width="100">
                                </el-table-column>
                                <el-table-column prop="occupation" label="职业" width="100">
                                </el-table-column>
                                <el-table-column prop="isSocialSecurity" label="有无社保" width="100">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.isSocialSecurity">有</span>
                                        <span v-else>无</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="isWorkOut" label="经常出差" width="100">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.isWorkOut">是</span>
                                        <span v-else>否</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="isWorkOvertime" label="经常加班" width="100">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.isWorkOvertime">是</span>
                                        <span v-else>否</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="isDrive" label="经常驾车" width="100">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.isDrive">是</span>
                                        <span v-else>否</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="isInsure" label="已配置保险" width="100">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.isInsure">是</span>
                                        <span v-else>否</span>
                                    </template>
                                </el-table-column>

                            </el-table>
                        </div>
                    </div>

                </el-form>
            </el-dialog>
        </div>

        <div class="dialogUserDetail">
            <el-dialog :visible.sync="dialogFormUserDetail" :modal-append-to-body='false' top="10vh">
                <h4>客情信息</h4>
                <div class="basic">
                    <p>基本信息</p>
                    <el-form>
                        <el-form-item label="昵称" label-width="80px">
                            <el-input v-model="customer.nickName"></el-input>
                        </el-form-item>
                        <el-form-item label="姓名" label-width="80px">
                            <el-input v-model="customer.name"></el-input>
                        </el-form-item>
                        <el-form-item label="性别" label-width="80px">
                            <el-select v-model="customer.sex">
                                <el-option v-for="(item,index1) in sexList" :key="index1" :label="item.relation" :value="item.status">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="电话" label-width="80px">
                            <el-input v-model="customer.phone"></el-input>
                        </el-form-item>
                        <el-form-item label="家庭成员" label-width="80px">
                           <el-select v-model="customer.familyMembers" multiple @change="homeChange" placeholder="请选择">
                               <el-option v-for="(item,index2) in homeList" :key="index2" :label="item.relation" :value="item.relation">
                               </el-option>
                           </el-select>
                        </el-form-item>
                        <el-form-item label="被保险人" label-width="80px">
                            <el-select v-model="customer.insuredPerson" @change="insuredChange" multiple placeholder="请选择">
                                <el-option v-for="(item,index3) in person" :key="index3" :label="item.relation" :value="item.relation">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="地区" label-width="80px">
                            <div class="block">
                                <el-cascader ref="locationDetail" v-model="customer.locationCode" :options="search.locationList" @change="changeLoation2"></el-cascader>
                            </div>
                        </el-form-item>
                        <el-form-item label="年收入" label-width="80px">
                            <el-select v-model="customer.yearIncome">
                                <el-option v-for="(item,index4) in search.yearIncomeList" :key="index4" :label="item" :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="家庭贷款" label-width="80px">
                            <el-select v-model="customer.totalLending">
                                <el-option v-for="(item,index5) in totalList" :key="index5" :label="item" :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="微信号" label-width="80px">
                            <el-input v-model="customer.wechatNum"></el-input>
                        </el-form-item>

                    </el-form>
                </div>
                <div class="guest">
                    <p>客情信息</p>
                    <el-form>
                        <el-form-item label="购买意向" label-width="80px">
                            <el-select v-model="guest.buyIntention">
                                <el-option v-for="(item,index5) in buyIntentions" :key="index5" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="预算" label-width="80px">
                           <el-input v-model="guest.budget"></el-input>
                        </el-form-item>
                        <el-form-item label="是否添加微信" label-width="120px">
                            <el-select v-model="guest.isAddWechat">
                                <el-option v-for="(item,index6) in isNo" :key="index6" :label="item.label" :value="item.status">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="回访时间" label-width="80px">
                            <div class="block">
                                <el-date-picker v-model="guest.returnVisitTime" type="date"
                                format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </div>
                        </el-form-item>
                        <el-form-item label="教育程度" label-width="80px">
                            <el-select v-model="guest.eduLevel">
                                <el-option v-for="(item,index7) in eduLevels" :key="index7" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="是否老客介绍" label-width="100px">
                            <el-select v-model="guest.isOldCustomerIntroduce">
                                <el-option v-for="(item,index6) in isNo" :key="index6" :label="item.label" :value="item.status">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="成交因素" label-width="80px">
                            <el-select v-model="guest.dealReason" multiple>
                                <el-option v-for="(item,index9) in dealReasons" :key="index9" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="流单因素" label-width="80px">
                            <el-select v-model="guest.lossReason" multiple>
                                <el-option v-for="(item,index9) in lossReasons" :key="index9" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <br/>
                        <el-form-item label="咨询过的产品" label-width="120px">
                            <el-select class="input" v-model="guest.consultedProduct"
                            filterable multiple placeholder="请输入关键词" style="width: 300px;">
                                <el-option v-for="(item,index9) in productList" :key="index9" :label="item.name" :value="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="标签" label-width="80px">
                           <el-input class="input" v-model="guest.tag" placeholder="输入内容"></el-input>
                        </el-form-item>
                        <br/>
                        <el-form-item label="关键信息" label-width="80px">
                           <el-input class="input" type="textarea" v-model="guest.keyInfo"
                           placeholder="如果用户提到过的平台未有的产品,其他的平台或社群的测评文章等等"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="btn">
                    <el-button type="success" size="small" round @click="ctrlSuser()">保存</el-button>
                    <el-button type="info" size="small" round @click="dialogFormUserDetail = false">取消</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import { parseTime } from '@/utils/index'
import { provinceAndCityData } from 'element-china-area-data'

import { initData } from '@/api/data'
import { putData } from '@/api/data'
import request from '@/utils/request'
import { getAge } from '@/utils/age'

export default {
    name: 'programmeOver',
    data() {
        return {
            centerDialogVisible: false,
            // 搜索
            search: {
                location: '',
                yearIncome: '',
                status: null,
                birthDate: '',
                createTime: '',
                channel: '',
                content: '',
                locationList: provinceAndCityData,

                yearIncomeList: ['无', '5万以下', '5~10万', '10~20万', '20~30万', '30~50万', '50~100万', '100万以上'],
                statusList: [
                    {
                        value: 0,
                        label: '免费'
                    },
                    {
                        value: 1,
                        label: '未支付'
                    },
                    {
                        value: 2,
                        label: '已支付'
                    }
                ],
                channelList: [
                    {
                        value: 0,
                        label: '百度'
                    },
                    {
                        value: 1,
                        label: '360'
                    },
                    {
                        value: 2,
                        label: 'UC信息流'
                    }
                ],
                contentList: [
                    {
                        value: 0,
                        label: '公众号'
                    },
                    {
                        value: 1,
                        label: '服务号'
                    },
                    {
                        value: 2,
                        label: '小程序'
                    },
                    {
                        value: 3,
                        label: 'Web'
                    },
                    {
                        value: 4,
                        label: '抖音'
                    }
                ]
            },
            sexList: [
                {
                    status: true,
                    relation: '男'
                },
                {
                    status: false,
                    relation: '女'
                }
            ],
            isNo: [
                {
                    status: true,
                    label: '是'
                },
                {
                    status: false,
                    label: '否'
                }
            ],
            homeList: [
                {
                    ids: 1,
                    relation: '本人'
                },
                {
                    ids: 2,
                    relation: '配偶'
                },
                {
                    ids: 3,
                    relation: '父亲'
                },
                {
                    ids: 4,
                    relation: '母亲'
                },
                {
                    ids: 5,
                    relation: '配偶父亲'
                },
                {
                    ids: 6,
                    relation: '配偶母亲'
                },
                {
                    ids: 7,
                    relation: '儿子'
                },
                {
                    ids: 8,
                    relation: '女儿'
                }
            ],
            person: [],

            notcusList: [],
            loading: true,
            totalNum: 0,
            currentPage: 0,
            size: 10,
            cus: [],
            selectId: null,
            customerId: null,
            totalYear: 0,
            totalTabcus: [],
            totalPlanDetail: [],
            copy: '',
            fromList: {},
            dialogFormUser: false,
            dialogFormUserDetail: false,
            totalList: ['无', '50万以下', '50~100万', '100~200万', '200~500万', '500万以上'],
            customer: {
                nickName: '',
                name: '',
                sex: '',
                phone: '',
                familyMembers: [],
                insuredPerson: [],
                locationCode: [],
                location: '',
                yearIncome: '',
                totalLending: '',
                wechatNum: ''
            },
            guest: {
                buyIntention: '',
                budget: '',
                isAddWechat: '',
                isOldCustomerIntroduce: '',
                eduLevel: '',
                dealReason: '',
                lossReason: '',
                consultedProduct: [],
                returnVisitTime: '',
                keyInfo: '',
                tag: '',
                customerId: ''
            },
            buyIntentions: [],
            lossReasons: [],
            dealReasons: [],
            eduLevels: [],
            productList: []
        }
    },
    methods: {
        parseTime,
        //设置表格单元格的样式
        tableCellStyle({ row, columnrowIndex, columnIndex }) {
            return 'font-size:12px;text-align:center;padding:7px 0;'
        },
        //设置表头行的样式
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            return 'font-size:12px;text-align:center;padding:5px 0;background:#f7f7f7;'
        },
        //提示框
        toast(msg) {
            this.$message({
                type: 'success',
                offset: '200',
                duration: 1000,
                message: msg
            })
        },
        //复制链接
        doCopy(val) {
            let str = process.env.BASE_API
            let url = str.substring(0, str.length - 24)
            this.copy = url + '/#/programmeList?userId=' + val
            this.$copyText(this.copy).then(
                e => {
                    this.$message.success('内容已复制到剪贴板')
                },
                e => {
                    alert('Can not copy')
                    console.log(e)
                }
            )
        },
        //客户信息弹窗
        dialogUser(index) {
            this.fromList = this.notcusList[index].customer
            this.fromList.age = getAge(this.fromList.birthDate)
            this.fromList.familyMemberList.forEach(item => {
                item.age = getAge(item.birthDate)
            })
            setTimeout(() => {
                this.dialogFormUser = true
            })
        },
        //客情信息弹窗
        userDetail() {
            if (this.cus.length == 1) {
                this.guest = {
                    buyIntention: '',
                    budget: '',
                    isAddWechat: '',
                    isOldCustomerIntroduce: '',
                    eduLevel: '',
                    dealReason: '',
                    lossReason: '',
                    consultedProduct: [],
                    returnVisitTime: '',
                    keyInfo: '',
                    tag: '',
                    customerId: ''
                }

                this.customerDetail() //查询客情信息

                this.dialogFormUserDetail = true
            } else {
                this.toast('请选择一条方案')
            }
        },
        //保存客情信息
        ctrlSuser() {
            var obj = {
                customer: this.customer,
                customerSituation: this.guest
            }
            console.log(obj)
            this.changeUser(obj)
        },

        //家庭成员改变
        homeChange(value) {
            var arr = []
            this.homeList.forEach(item1 => {
                value.forEach(item2 => {
                    if (item1.relation == item2) {
                        arr.push(item1)
                    }
                })
            })

            var obj = {}
            this.person = arr.reduce(function(item, next) {
                obj[next.relation] ? '' : (obj[next.relation] = true && item.push(next))
                return item
            }, [])
        },
        //被保人改变
        insuredChange(value) {
            console.log(value)
        },
        //地区
        changeLoation2(value) {
            var str = this.$refs['locationDetail'].getCheckedNodes()[0]
            var str2 = str.parent.label + str.label
            this.customer.location = str2
            console.log(str2)
        },

        //分页
        handleSizeChange(val) {
            this.loading = true
            this.size = val
            var obj = {
                planStatus: 2,
                name: this.search.name,
                nickName: this.search.nickName,
                phone: this.search.phone,
                status: this.search.status,
                yearIncome: this.search.yearIncome,
                location: this.search.location,
                birthDateStart: this.search.birthDate[0],
                birthDateEnd: this.search.birthDate[1],
                createTimeStart: this.search.createTime[0],
                createTimeEnd: this.search.createTime[1],
                page: this.currentPage - 1,
                size: this.size,
                sort: 'createTime,desc'
            }
            this.getList(obj)
        },
        handleCurrentChange(val) {
            this.loading = true
            this.currentPage = val
            var obj = {
                planStatus: 2,
                name: this.search.name,
                nickName: this.search.nickName,
                phone: this.search.phone,
                status: this.search.status,
                yearIncome: this.search.yearIncome,
                location: this.search.location,
                birthDateStart: this.search.birthDate[0],
                birthDateEnd: this.search.birthDate[1],
                createTimeStart: this.search.createTime[0],
                createTimeEnd: this.search.createTime[1],
                page: this.currentPage - 1,
                size: this.size,
                sort: 'createTime,desc'
            }
            this.getList(obj)
        },

        //获取方案列表
        getList(obj) {
            initData('/api/customerOrder', obj).then(res => {
                this.notcusList = res.content
                this.notcusList.forEach(item1 => {
                    item1.customer.familyMemberList.forEach(item2 => {
                        item2.age = getAge(item2.birthDate)
                    })
                })
                this.totalNum = res.totalElements
                this.loading = false
            })
        },
        //获取客情信息
        customerDetail() {
            initData('/api/customerSituation/' + this.customerId).then(res => {
                this.guest.customerId = this.customerId
                this.customer = res.customer

                if (res.customerSituation) {
                    this.guest = res.customerSituation
                }
            })

            initData('/api/insure/product', { size: 1000 }).then(res => {
                console.log(res)
                this.productList = res.content
            })
        },
        //修改客情信息接口
        changeUser(obj) {
            putData('/api/customerSituation', obj).then(res => {
                console.log('修改客情', res)
                this.dialogFormUserDetail = false
            })
        },

        //地区
        changeLoation(value) {
            var str = this.$refs['refSubCat'].getCheckedNodes()[0]
            var str2 = str.parent.label + str.label
            this.search.location = str2
        },
        //复选框
        selectionChange(val) {
            this.cus = val

            this.selectId = val[0].id
            this.customerId = val[0].customer.id
        },
        //查询
        onSearch() {
            var obj = {
                planStatus: 2,
                name: this.search.name,
                nickName: this.search.nickName,
                phone: this.search.phone,
                status: this.search.status,
                yearIncome: this.search.yearIncome,
                location: this.search.location,
                birthDateStart: this.search.birthDate[0],
                birthDateEnd: this.search.birthDate[1],
                createTimeStart: this.search.createTime[0],
                createTimeEnd: this.search.createTime[1],
                page: 0,
                size: this.size,
                sort: 'createTime,desc'
            }
            this.getList(obj)
        },
        //定制方案
        toCus(a) {
            if (this.cus.length == 1) {
                if (a == 1) {
                    this.$router.push({
                        path: '/programme/programme-cus',
                        query: {
                            cus: this.cus[0].customer.id,
                            requestId: this.cus[0].id,
                            status: 2,
                            type: 1
                        }
                    })
                } else {
                    this.$router.push({
                        path: '/programme/programme-cus',
                        query: {
                            cus: this.cus[0].customer.id,
                            requestId: this.cus[0].id,
                            status: 2,
                            type: 0
                        }
                    })
                }
            } else {
                this.toast('请选择一条信息定制方案')
            }
        },
        //总保障求和
        keyPlusValue(arr) {
            const result = arr.reduce((obj, item) => {
                if (!obj[item.insureType]) {
                    obj[item.insureType] = 0
                }
                obj[item.insureType] += item.insureLines
                return obj
            }, {})
            return Object.keys(result).map(key => ({ insureType: key, insureLines: result[key] }))
        },
        //查询方案
        planMain() {
            initData('/api/planMain', {
                customerOrderId: this.selectId,
                type: 1
            }).then(res => {
                this.totalTabcus = res.plan

                this.totalTabcus.forEach(item1 => {
                    item1.totalYearPremium = 0

                    item1.planDetail.forEach(item2 => {
                        if (item2.yearPremium) {
                            item1.totalYearPremium = item1.totalYearPremium + Number(item2.yearPremium)
                        }
                        this.totalPlanDetail.push(item2)

                        this.$forceUpdate()
                    })
                })

                //险种总保障
                var array = this.totalPlanDetail

                this.totalPlanDetail = this.keyPlusValue(array)

                //总保费
                this.totalTabcus.forEach(item => {
                    this.totalYear = item.totalYearPremium + this.totalYear
                })

                this.centerDialogVisible = true
            })
        },

        //预览
        dialog() {
            if (this.cus.length == 1) {
                this.totalPlanDetail = []
                this.planMain()
            } else {
                this.toast('请选择一条方案')
            }
        },

        //导出excel
        excel() {
            var obj = {
                planStatus: 2
            }
            request({
                url: process.env.BASE_API + '/api/customerOrder/download',
                method: 'get',
                params: obj,
                responseType: 'blob'
            }).then(res => {
                const link = document.createElement('a')
                let blob = new Blob([res], {
                    type: 'application/vnd.ms-excel'
                })
                link.style.display = 'none'
                link.href = URL.createObjectURL(blob)

                // link.download = res.headers['content-disposition'] //下载后文件名
                link.download = '未发送方案.xls' //下载的文件名
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            })
        }
    },
    // 设置数据字典
    dicts: ['buyIntention', 'lossReason', 'dealReason', 'eduLevel'],
    created() {
        var obj = {
            planStatus: 2,
            page: this.currentPage,
            size: this.size,
            sort: 'updateTime,desc'
        }
        this.getList(obj)

        this.buyIntentions = this.dict.buyIntention
        this.lossReasons = this.dict.lossReason
        this.dealReasons = this.dict.dealReason
        this.eduLevels = this.dict.eduLevel
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.over {

    .el-form {
        border-bottom: 1px solid #ccc;
        margin-bottom: 20px;
        /deep/.el-form-item {
            display: inline-block;

            .block {
                .el-date-editor {
                    padding: 0 5px;
                    height: 30px;
                    line-height: 30px;
                    font-size: 12px;
                    border-radius: 0;
                    i{
                        line-height: 30px;
                    }
                    span{
                        line-height: 30px;
                    }
                }
            }
        }
    }

    .dialog {
        .preview {
            h4 {
                font-size: 14px;
                color: #1890ff;
            }

            span {
                display: inline-block;
                font-size: 12px;
                margin-bottom: 10px;
            }

            .overview {
                display: -webkit-flex;

                div {
                    flex: 1;
                }

                span {
                    display: block;
                }
            }

            ul {
                list-style: none;
                padding: 0;
                margin: 0;

                li {
                    span {
                        margin-right: 10px;
                    }
                }
            }
        }
    }

    /deep/.tableStyle {
        .el-table__row {
            td:nth-of-type(4) {
                cursor: pointer;

                span {
                    border-bottom: 1px solid blue !important;
                    color: blue;
                }
            }
            td:nth-of-type(7) {
                cursor: pointer;

                span {
                    border-bottom: 1px solid blue !important;
                    color: blue;
                }
            }
        }
    }

    .table-btn{
        text-align: right;
        margin-top: 20px;
    }

    .block{
        text-align: right;
    }

    .dialogUser {
        /deep/.el-dialog {
            width: 70%;

            .el-dialog__body {
                padding: 0px 20px 20px;
            }

            .el-form {
                border: 0;

                .from-content {
                    display: -webkit-flex;

                    .from-left {
                        width: 300px;
                        margin-bottom: 20px;
                        background-color: #f7f7f7;
                        margin-right: 20px;

                        p {
                            text-align: center;
                            color: #ff4949;
                        }

                        .el-form-item {
                            display: block;
                            margin: 0;
                            padding-left: 20px;
                            .el-form-item__label {
                                font-size: 12px;
                            }
                            .el-form-item__content {
                                padding-right: 15px;
                            }
                        }
                    }

                    .from-right {
                        width: 950px;
                    }
                }
            }
        }
    }

    /deep/.dialogUserDetail {
        .el-dialog__body {
            padding: 10px 20px;
        }
        p {
            padding-left: 20px;
            color: blue;
        }
        .basic {
            padding-top: 10px;
            box-shadow: 0 0 5px #ccc;
            margin-bottom: 20px;
        }
        .guest {
            padding-top: 10px;
            box-shadow: 0 0 5px #ccc;
            .input {
                width: 600px;
            }
            .el-input__icon {
                line-height: 30px;
            }
            .block {
                .el-input {
                    width: 170px;
                }
            }
        }
        .btn {
            display: -webkit-flex;
            justify-content: center;
            padding-top: 10px;
        }
    }
}
</style>
