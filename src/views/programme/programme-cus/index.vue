<template>
    <div class="app-container cus" v-loading="loading">
        <div class="cus-left">
            <el-tabs type="border-card" v-model="editableTabsValue" @tab-click="tabchange">
                <el-tab-pane v-for="(itemBox,indexBox) in tabCus" :key="indexBox" :label="itemBox.insuredPerson" :name="itemBox.insuredPerson">
                    <ul class="risk">
                        <li v-for="(items,index) in itemBox.planDetail" :key="index">
                            <el-form>
                                <div class="risk-top">
                                    <el-form-item :label="items.insureType" label-width="80px">
                                        <el-select v-model="items.insureId" @change="insureChange(items.insureId,index)">
                                            <el-option v-for="(item,i) in items.products" :key="i" :label="item.name"
                                                :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="年保费" label-width="80px">
                                        <el-input v-model="items.yearPremium" @input="changeInput()"></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button size="small" style="margin-left: 20px;">计算</el-button>
                                        <el-button size="small" @click="clear(index)">清空</el-button>
                                        <span class="span" @click="add(index)">添加产品</span>
                                    </el-form-item>
                                </div>

                                <div class="cus-select">

                                    <el-form-item :label="item.itemName" style="margin-right: 20px;" v-for="(item,index10) in items.productSKU" :key="index10">
                                        <el-select v-model="item.attrsModule" @change="changeInput()">
                                            <el-option v-for="(item2,i) in item.itemValues" :key="i" :label="item2" :value="item2">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>

                                </div>

                                <div class="cus-information">
                                    <div class="information">
                                        <p>产品信息</p>
                                        <div class="information-section">
                                            <div>
                                                <h6>保障范围</h6>
                                                <span v-for="(item,index5) in items.insureProductItems" :key="index5" v-if="item.guardItem">{{item.itemName}}:{{item.content}}<br /></span>
                                                <h6>非保障范围</h6>
                                                <span v-for="(item,index5) in items.insureProductItems" :key="index5" v-if="!item.guardItem">{{item.itemName}}:{{item.content}}<br /></span>
                                            </div>

                                        </div>
                                    </div>
                                    <div class="information">
                                        <p>产品特点</p>
                                        <div class="information-section">
                                            <div v-for="(item,index6) in items.productFeatures" :key="index6">
                                               <span v-if="item.merit"><b>优点: </b>{{item.content}}</span>
                                               <span v-else><b>缺点: </b>{{item.content}}</span>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </el-form>

                        </li>
                    </ul>
                    <div class="btn">
                        <el-button size='small' type="info" @click="dialog()">预览</el-button>
                        <el-button size='small' type="info" @click="ctrls">保存</el-button>
                        <el-button size='small' type="info" @click="over">配置完成</el-button>
                        <el-button size='small' type="info" @click="cancel">取消</el-button>

                    </div>

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

                                            <span v-if="item2.product">{{item2.insureType}}险：{{item2.products.name}}<br />
                                                保障额度{{item2.insureLines}}W / 保障期限{{item2.insureTimeLimit}} / 缴费期限{{item2.payTimeLimit}}
                                                / 年交保费{{item2.yearPremium}}
                                            </span>
                                        </div>

                                    </li>
                                </ul>
                            </div>

                        </el-dialog>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>

        <div class="cus-right">
            <div class="operation">
                <div class="operation-left">
                    <span>使用模板</span>
                    <span @click="clearAll()">清空当前方案</span>
                </div>
                <div class="operation-left">
                    <span @click="toUser(userDialogVisible = true)">增加被险人</span>
                </div>

                <div class="addUser">
                    <el-dialog title="增加被险人" :visible.sync="userDialogVisible"
                    :modal-append-to-body="false" width="60%">
                        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
                            <el-form-item label="家庭成员" label-width="80px" prop="home">
                                <el-select v-model="ruleForm.home" placeholder="请选择">
                                    <el-option v-for="(item,index1) in homeList" :key="index1" :label="item.relation" :value="item.relation">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="出生日期" label-width="100px" prop="birthDate">
                                <div class="block">
                                    <el-date-picker v-model="ruleForm.birthDate" type="date"
                                    format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                        placeholder="选择日期">
                                    </el-date-picker>
                                </div>
                            </el-form-item>
                            <el-form-item label="职业" label-width="70px">
                                <el-select v-model="ruleForm.occupation">
                                    <el-option v-for="(item1,index6) in cupationList" :key="index6" :label="item1.text" :value="item1.text">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="社保" label-width="70px">
                                <el-radio v-model="ruleForm.isSocialSecurity" :label="true">有</el-radio>
                                <el-radio v-model="ruleForm.isSocialSecurity" :label="false">无</el-radio>
                            </el-form-item>
                            <el-form-item label="是否经常出差" label-width="110px">
                                <el-radio v-model="ruleForm.isWorkOut" :label="true">是</el-radio>
                                <el-radio v-model="ruleForm.isWorkOut" :label="false">否</el-radio>
                            </el-form-item>
                            <el-form-item label="是否经常加班" label-width="110px">
                                <el-radio v-model="ruleForm.isWorkOvertime" :label="true">是</el-radio>
                                <el-radio v-model="ruleForm.isWorkOvertime" :label="false">否</el-radio>
                            </el-form-item>
                            <br />
                            <el-form-item label="是否经常驾车" label-width="110px">
                                <el-radio v-model="ruleForm.isDrive" :label="true">是</el-radio>
                                <el-radio v-model="ruleForm.isDrive" :label="false">否</el-radio>
                            </el-form-item>
                            <el-form-item label="是否已配置保险" label-width="120px">
                                <el-radio v-model="ruleForm.isInsure" :label="true">是</el-radio>
                                <el-radio v-model="ruleForm.isInsure" :label="false">否</el-radio>
                            </el-form-item>
                            <br />
                            <el-form-item label="病史" label-width="40px">
                                <el-checkbox-group v-model="ruleForm.medicalHistory" @change="changeMedica(item3.medicalHistory,index5)">
                                    <el-checkbox v-for="(item2,index7) in  medicaList" :key="index7" :label="item2.text"></el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>

                            <div class="btn">
                                <el-button size="small" type="success" @click="submit('ruleForm')" round>
                                    保存
                                </el-button>
                                <el-button size="small" type="info" @click="cancelUser('ruleForm')" round>
                                    取消
                                </el-button>
                            </div>
                        </el-form>
                    </el-dialog>
                </div>
            </div>
            <ul v-if="user">
                <h4>客户信息</h4>
                <h5>基本信息</h5>
                <li class="between">
                    <span>姓名:{{user.name}}</span>
                    <span v-if="user.sex">性别:男</span>
                    <span v-else>性别:女</span>
                </li>
                <li class="between"><span>年龄:{{user.age}}</span><span>出生日期:{{user.birthDate}}</span></li>
                <li>
                    家庭成员:<span v-for="(item,index1) in user.familyMembers" :key="index1">{{item}}、</span>
                </li>
               <!-- <li>
                    被保险人:<span v-for="(item,index2) in user.insuredPerson" :key="index2">{{item}}</span>
                </li> -->
                <li><span>地区:{{user.location}}</span></li>
                <li><span>家庭年收入:{{user.yearIncome}}</span></li>
                <li><span>家庭贷款:{{user.totalLending}}</span></li>

                <h5>被保险人信息</h5>
                <div v-for="(item3,index3) in user.familyMemberList" :key="index3">
                    <li class="between" v-if="item3.relation == editableTabsValue">
                        <span>关系:{{item3.relation}}</span>
                    </li>
                    <li class="between" v-if="item3.relation == editableTabsValue">
                        <span>年龄:{{item3.age}}</span>
                        <span>出生日期:{{item3.birthDate}}</span>
                    </li>
                    <li v-if="item3.relation == editableTabsValue">
                        病史:<span v-for="(item,index12) in item3.medicalHistory" :key="index12">{{item}}</span>
                    </li>
                    <li v-if="item3.relation == editableTabsValue">
                        <span>职业:{{item3.occupation}}</span>
                    </li>
                    <li class="between" v-if="item3.relation == editableTabsValue">
                        <span v-if="item3.isSocialSecurity">社保:有</span>
                        <span v-else-if="!item3.isSocialSecurity">社保:无</span>

                        <span v-if="item3.isWorkOut">是否经常出差:是</span>
                        <span v-else-if="!item3.isWorkOut">是否经常出差:否</span>

                    </li>
                    <li class="between" v-if="item3.relation == editableTabsValue">
                        <span v-if="item3.isWorkOvertime">是否经常加班:是</span>
                        <span v-else-if="!item3.isWorkOvertime">是否经常加班:否</span>

                        <span v-if="item3.isDrive">是否经常驾车:是</span>
                        <span v-else-if="!item3.isDrive">是否经常驾车:否</span>

                    </li>
                    <li v-if="item3.relation == editableTabsValue">
                        <span v-if="item3.isInsure">是否已配置保险:是</span>
                        <span v-else-if="!item3.isInsure">是否已配置保险:否</span>

                    </li>
                </div>

            </ul>
        </div>
    </div>
</template>

<script>
    import {
        initData
    } from '@/api/data'
    import {
        postData
    } from '@/api/data'
    import {
        putData
    } from '@/api/data'

    export default {
        name: "",
        data() {
            return {
                loading: true,
                editableTabsValue: '',
                centerDialogVisible: false,
                userDialogVisible:false,
                tabCus: [],
                totalTabcus: [],
                tabIndex: 0,
                user: {},
                statusList: [{
                        value: 0,
                        label: "免费"
                    },
                    {
                        value: 1,
                        label: "未支付"
                    },
                    {
                        value: 2,
                        label: "已支付"
                    },
                ],
                a: 0,

                ruleForm: {
                    home: "",
                    birthDate: "",
                    occupation:"无",
                    isSocialSecurity:true,
                    isWorkOut:true,
                    isWorkOvertime:true,
                    isDrive:true,
                    isInsure:true,
                    medicalHistory:['无']
                },
                rules: {

                    home: [{
                        required: true,
                        message: '请选择家庭成员',
                        trigger: 'change'
                    }],
                    birthDate: [{
                        required: true,
                        message: '请选择日期',
                        trigger: 'change'
                    }],

                },
                homeList: [{
                        ids: 1,
                        relation: "本人",
                    },
                    {
                        ids: 2,
                        relation: "配偶",
                    },
                    {
                        ids: 3,
                        relation: "父亲",
                    },
                    {
                        ids: 4,
                        relation: "母亲",
                    },
                    {
                        ids: 5,
                        relation: "配偶父亲",
                    },
                    {
                        ids: 6,
                        relation: "配偶母亲",
                    },
                    {
                        ids: 7,
                        relation: "儿子",
                    },
                    {
                        ids: 8,
                        relation: "女儿",
                    }
                ],
                cupationList:[],
                medicaList:[],

                totalElements: null,
                totalYear: null,
                totalPlanDetail: [],

            }
        },
        methods: {
            //刷新数据
            changeInput() {

                this.$forceUpdate();
            },

            //查询险种
            planList() {
                var tabIndex = this.tabIndex
                initData("/api/insure/product/getInsureType", {}).then(res => {

                    this.tabCus[tabIndex]['planDetail'] = res
                    this.$forceUpdate();
                })
            },

            //修改方案接口
            changePlan(obj) {
                putData("/api/planMain", obj).then(res => {

                    if(obj.status == 0){
                        //跳转未定制方案
                        this.$router.push({
                            path: '/programme/programme-notcus'
                        })
                    }else if(obj.status == 1){
                        //跳转未发送方案
                        this.$router.push({
                            path: '/programme/programme-notsend'
                        })
                    }else if(obj.status == 2){
                        //跳转未发送方案
                        this.$router.push({
                            path: '/programme/programme-over'
                        })
                    }
                })
            },

            //查询方案
            planMain() {

                initData("/api/planMain", {
                    customerOrderId: this.$route.query.requestId,
                    type: this.$route.query.type
                }).then(res => {


                    if (res.status == 204) {
                        // 查询险种
                        this.planList()
                        this.totalElements = 0
                        this.loading = false
                    } else {

                        this.tabCus = res.plan
                        this.tabCus.forEach((item1)=>{
                            item1.planDetail.forEach((item2)=>{
                                item2.plan = {id:item1.id}

                                if(item2.product){ //产品id
                                    item2.insureId = item2.product.id
                                    item2.insureProductItems = item2.product.insureProductItems
                                }
                            })
                        })

                        this.$forceUpdate();
                        this.loading = false
                    }


                })
            },

            //保险产品规格
            attrs(id, index) {
                var tabIndex = this.tabIndex
                initData("/api/insure/product/sku/attrs/" + id).then(res => {
                  if(res.skuattributeItems){
                      this.tabCus[this.tabIndex].planDetail[index].productSKU =  res.skuattributeItems
                  }else{
                      this.tabCus[this.tabIndex].planDetail[index].productSKU = []
                  }
                  this.$forceUpdate();
                })
            },
            //保险产品信息
            product(id, index) {
                var tabIndex = this.tabIndex
                initData("/api/insure/product/" + id).then(res => {

                    this.tabCus[tabIndex].planDetail[index].insureProductItems = res.insureProductItems
                    this.tabCus[tabIndex].planDetail[index].productFeatures = res.insureProductFeatures
                    this.$forceUpdate();

                })
            },
            //查询被保人
            getInsuredPerson(){
                initData("/api/customerOrder/getInsuredPerson/" + this.$route.query.requestId).then(res => {
                    console.log(res)
                    var arr = res
                    this.tabCus = []
                    arr.forEach((item) => {
                        this.tabCus.push({
                            insuredPerson: item,
                            planDetail: []
                        })
                    })


                    this.editableTabsValue = res[0]
                    this.planMain()
                })
            },

            //查询客户数据
            userData(obj) {
                initData("/api/customer", obj).then(res => {

                    this.user = res.content[0]
                    this.getInsuredPerson()

                })
            },
            //新增保存，配置完成接口
            preservation(obj) {

                postData("/api/planMain", obj).then(res => {

                    if(obj.status == 0){
                        //跳转未定制方案
                        this.$router.push({
                            path: '/programme/programme-notcus'
                        })
                    }else if(obj.status == 1){
                        //跳转未发送方案
                        this.$router.push({
                            path: '/programme/programme-notsend'
                        })
                    }else if(obj.status == 2){
                        //跳转未发送方案
                        this.$router.push({
                            path: '/programme/programme-over'
                        })
                    }

                })
            },

            //查询新增产品
            productSearch(obj, i) {
                initData("/api/insure/product/listByTypeForReturnNameAndId", obj).then(res => {

                    var obj = {
                        insureType: this.tabCus[this.tabIndex].planDetail[i].insureType,
                        products: res
                    }

                    this.tabCus[this.tabIndex].planDetail.splice(i + 1, 0, obj);
                })
            },

            //清空当前产品
            clear(i) {
                this.tabCus[this.tabIndex].planDetail[i].insureId = ""
                this.tabCus[this.tabIndex].planDetail[i].yearPremium = ""
                this.tabCus[this.tabIndex].planDetail[i].payTimeLimit = ""
                this.tabCus[this.tabIndex].planDetail[i].insureLines = ""
                this.tabCus[this.tabIndex].planDetail[i].insureTimeLimit = ""
                this.tabCus[this.tabIndex].planDetail[i].productFeatures = []
                this.tabCus[this.tabIndex].planDetail[i].insureProductItems = []

                this.$forceUpdate()
            },
            //添加当前产品
            add(i) {
                this.productSearch({type:this.tabCus[this.tabIndex].planDetail[i].insureType},i)
            },
            //取消
            cancel() {
                this.$router.go(0);
            },


            //清空当前所有方案
            clearAll() {

                this.tabCus.forEach((item1, index1) => {
                    item1.planDetail.forEach((item2, index2) => {
                        this.tabCus[index1].planDetail[index2].insureId = ""
                        this.tabCus[index1].planDetail[index2].yearPremium = ""
                        this.tabCus[index1].planDetail[index2].payTimeLimit = ""
                        this.tabCus[index1].planDetail[index2].insureLines = ""
                        this.tabCus[index1].planDetail[index2].insureTimeLimit = ""
                        this.tabCus[index1].planDetail[index2].productFeatures = []
                        this.tabCus[index1].planDetail[index2].insureProductItems = []
                        this.$forceUpdate()
                    })
                })
            },
           //保存新增被保人
            submit(formrelation){
                var obj = {
                    customerOrderId: this.$route.query.requestId,
                    familyMember: this.ruleForm,
                    insuredPerson: this.ruleForm.home,
                    type: this.$route.query.type
                }
                this.$refs[formrelation].validate((valid) => {
                    if (valid) {
                       postData("/api/tFamilyMember/addInsuredPerson", obj).then(res => {

                           this.userDialogVisible = false
                           this.$refs[formrelation].resetFields();
                           //查询用户信息
                           this.userData({
                               id: this.$route.query.cus
                           })
                       })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });



            },
            cancelUser(formrelation){
                this.userDialogVisible = false
                this.$refs[formrelation].resetFields();
            },

            //切换被保人
            tabchange(tab, e) {

                this.tabIndex = tab.index

                if(this.tabCus[tab.index].planDetail.length == 0){
                    this.planList()
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
              return Object.keys(result).map(key => ({insureType: key, insureLines: result[key]}))
            },
            //预览
            dialog() {
                this.totalPlanDetail = []
                this.totalTabcus = this.tabCus

                this.totalTabcus.forEach((item1) => {
                    item1.totalYearPremium = 0

                    item1.planDetail.forEach((item2) => {

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

                this.totalTabcus.forEach((item) => {
                    this.totalYear = item.totalYearPremium + this.totalYear
                })


                this.centerDialogVisible = true


            },
            //保存
            ctrls() {
                var obj = {}

                var arr = this.tabCus

                // arr = arr.filter(item => {
                //     return item.planDetail.length != 0
                // })

                arr.forEach((item, index) => {

                    arr[index].planDetail = item.planDetail.filter(item2 => {
                        return item2.insureId
                    })

                })


                if (this.totalElements == 0) {
                    obj = {

                        status: this.$route.query.status,
                        type: this.$route.query.type,
                        customerOrder: {
                            id: this.$route.query.requestId
                        },
                        plan: arr
                    }
                    this.preservation(obj) // 新增
                } else {
					obj = {
                        customerOrder:{id:this.$route.query.requestId},
					    status: this.$route.query.status,
                        type:this.$route.query.type,
					    plan: arr
					}
                    this.changePlan(obj) //修改
                }

            },

            //配置完成
            over() {
                var obj = {}

                var arr = this.tabCus

                // arr = arr.filter(item => {
                //     return item.planDetail.length != 0
                // })

                arr.forEach((item, index) => {

                    arr[index].planDetail = item.planDetail.filter(item2 => {
                        return item2.insureId
                    })
                })



                if (this.totalElements == 0) {
                    obj = {

                        status: this.$route.query.status == 0 ? 1 : this.$route.query.status,
                        type: this.$route.query.type,
                        customerOrder: {
                            id: this.$route.query.requestId
                        },
                        plan: arr
                    }
                    this.preservation(obj) // 新增
                } else {
                    obj = {
                        customerOrder:{id:this.$route.query.requestId},
                        type:this.$route.query.type,
                        status: this.$route.query.status == 0 ? 1 : this.$route.query.status,
                        plan: arr
                    }
                    this.changePlan(obj) //修改
                }

            },
            //选择产品
            insureChange(id, index) {

                this.tabCus[this.tabIndex].planDetail[index].product = {
                    id: id
                }

                this.attrs(id, index)
                this.product(id, index)
            },
            // 获取列表
            getList(obj) {
                initData("/api/generalType/show", obj).then(res => {

                    if (obj.sign == 1) {
                        this.cupationList = res
                    } else {
                        this.medicaList = res
                    }
                })
            },
        },
        created() {
            if(this.$route.query.cus){
                this.getList({
                    sign: 1
                }) //职业列表
                this.getList({
                    sign: 2
                }) //病史列表

                //查询用户信息
                this.userData({
                    id: this.$route.query.cus
                })

            }

        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .cus {

        display: -webkit-flex;

        .cus-left {
            width: 800px;

            .risk {
                list-style: none;
                padding: 0;
                margin: 0;

                li {
                    padding: 10px;
                    margin-bottom: 20px;
                    background-color: #f7f7f7;
                }

            }

            .btn {
                display: -webkit-flex;
                justify-content: flex-end;
                margin-top: 20px;
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
        }

        .cus-right {
            width: 350px;
            height: 100%;
            margin-left: 30px;

            .operation {
                display: -webkit-flex;
                justify-content: space-between;

                .operation-left {
                    span {
                        font-size: 12px;
                        color: #1890ff;
                        margin-left: 10px;
                        padding: 5px;
                        cursor: pointer;
                        border-bottom: 1px solid #1890ff;
                    }
                }
            }

            ul {
                list-style: none;
                padding: 0;
                margin: 0;
                background-color: #f7f7f7;
                padding: 10px 30px;
                box-sizing: border-box;
                margin-top: 10px;

                li {

                    line-height: 30px;
                    font-size: 12px;
                }

                .between {
                    display: -webkit-flex;
                    justify-content: space-between;
                }
            }

        }

        /deep/.el-form {
            .el-form-item {
                display: inline-block;
                margin-bottom: 10px;

                // input {
                //     width: 160px;
                //     height: 32px;
                //     line-height: 32px;
                //     font-size: 12px;
                // }

                span {
                    color: #1890ff;
                }

                .span {
                    font-size: 12px;
                    margin-left: 10px;
                    padding: 5px 8px;
                    cursor: pointer;
                    border-bottom: 1px solid #1890ff;
                }


            }

            .risk-top {
                border-bottom: 1px solid #ccc;
                margin-bottom: 10px;
            }

            .cus-information {
                display: -webkit-flex;

                .information {
                    flex: 1;

                    p {
                        font-size: 14px;
                    }

                    .information-section {
                        width: 300px;
                        height: 180px;
                        padding: 10px;
                        background: #fff;
                        font-size: 12px;
                        overflow-y: scroll;
                        line-height: 20px;
                        h6{
                            margin: 0;
                            padding: 10px 0;
                        }
                    }
                }

            }
            .btn {
                display: -webkit-flex;
                justify-content: center;
            }
        }
    }
</style>
