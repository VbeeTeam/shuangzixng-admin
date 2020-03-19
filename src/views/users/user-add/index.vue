<template>
    <div class="app-container add">
        <p>基本信息</p>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="70px">
            <el-form-item label="昵称"  prop="nickName">
                <el-input v-model="ruleForm.nickName"></el-input>
            </el-form-item>
            <el-form-item label="姓名"  prop="name">
                <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="性别"  prop="sex">
                <el-select v-model="ruleForm.sex">
                    <el-option v-for="(item,i) in sexList" :key="i" :label="item.relation" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="电话"  prop="phone">
                <el-input v-model="ruleForm.phone"></el-input>
            </el-form-item>
            <br />
            <el-form-item label="地区"  prop="location">
                <div class="block">
                    <el-cascader ref="refSubCat" v-model="ruleForm.locationCode" :options="locationList" @change="changeLoation"></el-cascader>
                </div>
            </el-form-item>
            <el-form-item label="家庭成员"  prop="home">
                <el-select v-model="ruleForm.home" multiple @change="homeChange" placeholder="请选择">
                    <el-option v-for="(item,index1) in homeList" :key="index1" :label="item.relation" :value="item.relation">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="被保险人"  prop="inPerson">
                <el-select v-model="ruleForm.inPerson" @change="insuredChange" multiple placeholder="请选择">
                    <el-option v-for="(item,index2) in person" :key="index2" :label="item.relation" :value="item.relation">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="年收入"  prop="yearIncome">
                <el-select v-model="ruleForm.yearIncome">
                    <el-option v-for="(item,index3) in yearIncomeList" :key="index3" :label="item" :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <br />
            <el-form-item label="家庭贷款"  prop="totalLending">
                <el-select v-model="ruleForm.totalLending">
                    <el-option v-for="(item,index4) in totalList" :key="index4" :label="item" :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="!$route.query.id" label="微信号" >
                <el-input v-model="ruleForm.wechatNum"></el-input>
            </el-form-item>
            <el-form-item v-if="!$route.query.id" label="openId" >
                <el-input v-model="ruleForm.openId"></el-input>
            </el-form-item>

            <el-tabs v-model="editableTabsValue" type="card">
                <el-tab-pane v-for="(item3, index5) in insuredPerson" :key="index5" :label="item3.relation" :name="item3.relation">
                    <!-- <el-form> -->
                    <el-form-item label="出生日期" >
                        <div class="block">
                            <el-date-picker v-model="item3.birthDate" type="date"
                            format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                            </el-date-picker>
                        </div>
                    </el-form-item>
                    <el-form-item label="职业" >
                        <el-select v-model="item3.occupation">
                            <el-option v-for="(item1,index6) in cupationList" :key="index6" :label="item1.text" :value="item1.text">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="社保" >
                        <el-radio v-model="item3.isSocialSecurity" :label="true">有</el-radio>
                        <el-radio v-model="item3.isSocialSecurity" :label="false">无</el-radio>
                    </el-form-item>
                    <el-form-item label="是否经常出差" label-width="90px">
                        <el-radio v-model="item3.isWorkOut" :label="true">是</el-radio>
                        <el-radio v-model="item3.isWorkOut" :label="false">否</el-radio>
                    </el-form-item>
                    <el-form-item label="是否经常加班" label-width="90px">
                        <el-radio v-model="item3.isWorkOvertime" :label="true">是</el-radio>
                        <el-radio v-model="item3.isWorkOvertime" :label="false">否</el-radio>
                    </el-form-item>
                    <el-form-item label="是否经常驾车" label-width="90px">
                        <el-radio v-model="item3.isDrive" :label="true">是</el-radio>
                        <el-radio v-model="item3.isDrive" :label="false">否</el-radio>
                    </el-form-item>
                    <el-form-item label="是否已配置保险" label-width="100px">
                        <el-radio v-model="item3.isInsure" :label="true">是</el-radio>
                        <el-radio v-model="item3.isInsure" :label="false">否</el-radio>
                    </el-form-item>
                    <br/>
                    <el-form-item label="病史" label-width="40px">
                        <el-checkbox-group v-model="item3.medicalHistory" @change="changeMedica(item3.medicalHistory,index5)">
                            <el-checkbox v-for="(item2,index7) in  medicaList" :key="index7" :label="item2.text"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <!-- </el-form> -->
                </el-tab-pane>
            </el-tabs>

            <div class="btn">
                <el-button size="small" type="primary" @click="submit('ruleForm')">
                    保存
                </el-button>
                <el-button size="small" type="info" @click="cancel('ruleForm')">
                    取消
                </el-button>
            </div>
        </el-form>
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
    import { provinceAndCityData } from 'element-china-area-data'


    export default {
        relation: "add",
        data() {
            var checkPhone = (rule, value, callback) => {
                    if (!value) {
                      return callback(new Error('手机号不能为空'));
                    } else {
                      const reg = /^1[3|4|5|7|8][0-9]\d{8}$/

                      if (reg.test(value)) {
                        callback();
                      } else {
                        return callback(new Error('请输入正确的手机号'));
                      }
                    }
                  };

            return {

                ruleForm: {
                    id:null,
                    nickName: "",
                    name: "",
                    sex: "",
                    phone: "",
                    location: "",
                    locationCode:[],
                    home: [],
                    inPerson: [],
                    familyMembers: [],
                    insuredPerson: [],
                    yearIncome: "",
                    totalLending: "",
                    wechatNum: "",
                    openId: "",
                    familyMemberList: []
                },
                rules: {
                    nickName: [{
                            required: true,
                            message: '请输入昵称',
                            trigger: 'blur'
                        },
                        {
                            min: 1,
                            max: 20,
                            message: '长度在 1 到 20 个字符',
                            trigger: 'blur'
                        }
                    ],
                    name: [{
                            required: true,
                            message: '请输入名称',
                            trigger: 'blur'
                        },
                        {
                            min: 1,
                            max: 20,
                            message: '长度在 1 到 20 个字符',
                            trigger: 'blur'
                        }
                    ],
                    sex: [{
                        required: true,
                        message: '请选择性别',
                        trigger: 'change'
                    }],
                    phone: [{
                        required: true,
                        validator: checkPhone,
                        trigger: 'blur'
                    }],
                    location: [{
                        required: true,
                        message: '请选择地区',
                        trigger: 'change'
                    }],
                    home: [{
                        required: true,
                        message: '请选择家庭成员',
                        trigger: 'change'
                    }],
                    inPerson: [{
                        required: true,
                        message: '请选择被保险人',
                        trigger: 'change'
                    }],
                    yearIncome: [{
                        required: true,
                        message: '请选择年收入',
                        trigger: 'change'
                    }],
                    totalLending: [{
                        required: true,
                        message: '请选择家庭贷款',
                        trigger: 'change'
                    }],
                    wechatNum: [{
                        required: true,
                        message: '请输入微信号',
                        trigger: 'blur'
                    }],
                    openId: [{
                        required: true,
                        message: '请输入openId',
                        trigger: 'blur'
                    }]
                },

                sexList: [{
                        id: 1,
                        relation: "男"
                    },
                    {
                        id: 0,
                        relation: "女"
                    }
                ],
                yearIncomeList: ['无', '5万以下', '5~10万', '10~20万', '20~30万', '30~50万', '50~100万', '100万以上'],
                totalList: ['无', '50万以下', '50~100万', '100~200万', '200~500万', '500万以上'],
                locationList: provinceAndCityData,

                homeList: [{
                        ids: 1,
                        relation: "本人",
                        birthDate: new Date(1990,0,1),
                        occupation: "无",
                        isSocialSecurity: true,
                        isWorkOvertime: true,
                        isDrive: true,
                        isInsure: true,
                        isWorkOut: true,
                        medicalHistory: ["无"],

                    },
                    {
                        ids: 2,
                        relation: "配偶",
                        birthDate: new Date(1990,0,1),
                        occupation: "无",
                        isSocialSecurity: true,
                        isWorkOvertime: true,
                        isDrive: true,
                        isInsure: true,
                        isWorkOut: true,
                        medicalHistory: ["无"],

                    },
                    {
                        ids: 3,
                        relation: "父亲",
                        birthDate: new Date(1990,0,1),
                        occupation: "无",
                        isSocialSecurity: true,
                        isWorkOvertime: true,
                        isDrive: true,
                        isInsure: true,
                        isWorkOut: true,
                        medicalHistory: ["无"],

                    },
                    {
                        ids: 4,
                        relation: "母亲",
                        birthDate: new Date(1990,0,1),
                        occupation: "无",
                        isSocialSecurity: true,
                        isWorkOvertime: true,
                        isDrive: true,
                        isInsure: true,
                        isWorkOut: true,
                        medicalHistory: ["无"],

                    },
                    {
                        ids: 5,
                        relation: "配偶父亲",
                        birthDate: new Date(1990,0,1),
                        occupation: "无",
                        isSocialSecurity: true,
                        isWorkOvertime: true,
                        isDrive: true,
                        isInsure: true,
                        isWorkOut: true,
                        medicalHistory: ["无"],

                    },
                    {
                        ids: 6,
                        relation: "配偶母亲",
                        birthDate: new Date(1990,0,1),
                        occupation: "无",
                        isSocialSecurity: true,
                        isWorkOvertime: true,
                        isDrive: true,
                        isInsure: true,
                        isWorkOut: true,
                        medicalHistory: ["无"],

                    },
                    {
                        ids: 7,
                        relation: "儿子",
                        birthDate: new Date(1990,0,1),
                        occupation: "无",
                        isSocialSecurity: true,
                        isWorkOvertime: true,
                        isDrive: true,
                        isInsure: true,
                        isWorkOut: true,
                        medicalHistory: ["无"],

                    },
                    {
                        ids: 8,
                        relation: "女儿",
                        birthDate: new Date(1990,0,1),
                        occupation: "无",
                        isSocialSecurity: true,
                        isWorkOvertime: true,
                        isDrive: true,
                        isInsure: true,
                        isWorkOut: true,
                        medicalHistory: ["无"],

                    }
                ],
                insuredPerson: [],
                person: [],

                editableTabsValue: '',

                cupationList: [],
                medicaList: []
            }
        },
        methods: {
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
            //新增客户接口
            addUser(obj) {
                postData("/api/customer", obj).then(res => {

                    this.$router.push({
                        'path': '/users/user-information'
                    })
                })
            },
            //修改客户接口
            changeUser(obj) {
                putData("/api/customer", obj).then(res => {
                    this.toast("修改成功")
                    this.$router.push({
                        'path': '/users/user-information'
                    })
                })
            },
            //提示框
            toast(msg) {
                this.$message({
                    type: 'success',
                    offset: '200',
                    duration: 1000,
                    message: msg
                });
            },
            //查询被修改的客户数据
            userData() {
                initData("/api/customer", {
                    id: this.ruleForm.id
                }).then(res => {

                    this.ruleForm = res.content[0]
                    this.ruleForm.sex = this.ruleForm.sex ? 1 : 0
                    //家庭成员
                    this.ruleForm.home = this.ruleForm.familyMembers
                    //被保险人
                    this.ruleForm.inPerson = this.ruleForm.insuredPerson

                    this.person = this.ruleForm.familyMemberList

                    this.editableTabsValue = this.ruleForm.inPerson[0]
                    //被保人信息
                    this.insuredPerson = this.ruleForm.familyMemberList

                })
            },

            //家庭成员改变
            homeChange(value) {
                var arr = []
                this.homeList.forEach((item1) => {
                    value.forEach((item2) => {
                        if (item1.relation == item2) {
                            arr.push(item1)
                        }
                    })

                })

                var obj = {};
                this.person = arr.reduce(function(item, next) {
                    obj[next.relation] ? '' : obj[next.relation] = true && item.push(next);
                    return item;
                }, []);


            },
            //被保人改变
            insuredChange(value) {

                var arr = []
                this.person.forEach((item1) => {

                    value.forEach((item2) => {

                        if (item1.relation == item2) {
                            arr.push(item1)
                        }
                    })

                })

                var obj = {};
                this.insuredPerson = arr.reduce(function(item, next) {
                    obj[next.relation] ? '' : obj[next.relation] = true && item.push(next);
                    return item;
                }, []);

                this.editableTabsValue = this.insuredPerson[0].relation
            },
            //地区
            changeLoation(value){

                var str = this.$refs["refSubCat"].getCheckedNodes()[0]
                var str2 = str.parent.label + str.label
                this.ruleForm.location = str2

            },
            //病史改变
            changeMedica(value, index) {
                this.insuredPerson[index].medicalHistory = value
            },
            //处理上传参数
            changeData() {
                this.ruleForm.familyMembers = []
                this.ruleForm.insuredPerson = []

                this.person.forEach((item) => {
                    this.ruleForm.familyMembers.push(item.relation)
                })

                this.insuredPerson.forEach((item) => {
                    this.ruleForm.insuredPerson.push(item.relation)
                })

                this.ruleForm.familyMemberList = this.insuredPerson

            },
            submit(formrelation) {

                this.$refs[formrelation].validate((valid) => {
                    if (valid) {
                        if (this.ruleForm.id) {
                            this.changeData()
                            this.changeUser(this.ruleForm)

                        } else {
                            this.changeData()
                            this.addUser(this.ruleForm)

                        }

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            cancel(formrelation) {
                this.$refs[formrelation].resetFields();
            },

        },
        created() {

            this.getList({
                sign: 1
            }) //职业列表
            this.getList({
                sign: 2
            }) //病史列表
            if (this.$route.query.id) {
                this.ruleForm.id = this.$route.query.id
                this.userData()

            }

        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .add {

        /deep/.el-form {

            .el-form-item {
                display: inline-block;
                margin-left: 30px;
                .el-form-item__label {
                    font-size: 12px;
                }
                .el-input {
                    input {
                        height: 30px;
                        line-height: 30px;
                        font-size: 12px;
                    }

                }
            }

        }

        .btn {
            display: -webkit-flex;
            justify-content: center;
        }
    }
</style>
