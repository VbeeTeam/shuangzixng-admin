<template>
    <div class="app-container public-account-management clearfix">
        <!--左边预览菜单-->
        <div class="left">
            <div class="menu clearfix">
                <div class="menu_bottom" v-for="(item, i) of menu.button" :key="i">
                    <!-- 一级菜单 -->
                    <div @click="menuFun(i, item)" class="menu_item" :class="{ active: isActive == i }">{{ item.name }}</div>
                    <!--以下为二级菜单-->
                    <div class="submenu" v-if="isSubMenuFlag == i">
                        <div class="subtitle" v-for="(subItem, k) in item.sub_button" :key="k">
                            <div class="menu_subItem" :class="{ active: isSubMenuActive == i + '' + k }" @click="subMenuFun(item, subItem, i, k)">{{ subItem.name }}</div>
                        </div>
                        <!--  二级菜单加号， 当长度 小于  5 才显示二级菜单的加号  -->
                        <div class="menu_bottom menu_addicon" v-if="item.sub_button.length < 5" @click="addSubMenu(item)"><i class="el-icon-plus"></i></div>
                    </div>
                </div>
                <!-- 一级菜单加号 -->
                <div class="menu_bottom menu_addicon" v-if="menuKeyLength < 3" @click="addMenu"><i class="el-icon-plus"></i></div>
            </div>
        </div>
        <!--右边配置-->
        <el-form :model="tempObj" :rules="rules" class="right_form">
            <div class="delete_btn">
                <el-button size="small" type="primary" icon="el-icon-refresh" @click="loadMenu(tempObj)">加载已有菜单</el-button>
                <el-button size="small" type="warning" icon="el-icon-delete" @click="deleteMenu(tempObj)">删除当前菜单</el-button>
                <el-button size="small" type="danger" icon="el-icon-close" @click="deleteAllMenu(tempObj)">删除所有菜单</el-button>
            </div>
            <div v-if="!showRightFlag" class="right">
                <div class="configure_page">
                    <div>
                        <el-form-item label="菜单名称：" prop="name">
                            <!-- <span>菜单名称：</span> -->
                            <el-input class="input_width" v-model="tempObj.name" placeholder="请输入菜单名称" clearable></el-input>
                        </el-form-item>
                    </div>

                    <div>
                        <div class="menu_content">
                            <el-form-item label="菜单内容：">
                                <!-- <span>菜单内容：</span> -->
                                <el-radio-group v-model="tempObj.type">
                                    <el-radio :label="'media_id'">发送素材</el-radio>
                                    <el-radio :label="'view'">跳转链接</el-radio>
                                    <el-radio :label="'click'">发送关键词</el-radio>
                                    <el-radio :label="'miniprogram'">小程序</el-radio>
                                    <el-radio :label="'scancode_push'">扫码推事件</el-radio>
                                    <el-radio :label="'scancode_waitmsg'">扫码推事件等</el-radio>
                                    <el-radio :label="'pic_sysphoto'">拍照发送</el-radio>
                                    <el-radio :label="'pic_photo_or_album'">拍照或选择相册</el-radio>
                                    <el-radio :label="'pic_weixin'">选择照片发送</el-radio>
                                    <el-radio :label="'location_select'">发送位置</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </div>
                        <div class="configur_content">
                            <div class="material" v-if="tempObj.type == 'media_id'">
                                <el-form-item label="素材ID：">
                                    <!-- <span>素材内容：</span> -->
                                    <el-input class="input_width" v-model="tempObj.media_id" placeholder="素材名称" :disabled="true"></el-input>
                                </el-form-item>
                                <!--选择素材 弹框-->
                                <!-- dialog -->
                                <el-dialog :visible.sync="visible2" :close-on-click-modal="false" :before-close="cancel" title="图片库" append-to-body width="700px">
                                    <media-library @sureClick="handleEdit" @closeD="cancel"></media-library>
                                </el-dialog>
                                <!-- dialog -->
                                <el-button slot="reference" type="success" @click="openIamge">选择素材</el-button>
                                <p class="blue">tips:需要上传素材后，再进行选择</p>
                            </div>
                            <div v-if="tempObj.type == 'view'">
                                <el-form-item label="跳转链接：">
                                    <!-- <span>跳转链接：</span> -->
                                    <el-input class="input_width" v-model="tempObj.url" placeholder="请输入链接" clearable></el-input>
                                </el-form-item>
                            </div>
                            <div v-if="tempObj.type == 'click'">
                                <div>
                                    <el-form-item label="关键词(key)：">
                                        <!-- <span>关键词：</span> -->
                                        <el-input class="input_width" v-model="tempObj.key" placeholder="请输入关键词(key)" clearable></el-input>
                                    </el-form-item>
                                </div>
                                <!-- <p class="blue">tips:这里需要配合关键词推送消息一起使用</p> -->
                            </div>
                            <div v-if="tempObj.type == 'miniprogram'">
                                <div>
                                    <el-form-item label="小程序的appid：">
                                        <!-- <span>小程序的appid：</span> -->
                                        <el-input class="input_width" v-model="tempObj.appid" placeholder="请输入小程序的appid" clearable></el-input>
                                    </el-form-item>
                                </div>
                                <div>
                                    <el-form-item label="小程序的页面路径：">
                                        <!-- <span>小程序的页面路径：</span> -->
                                        <el-input class="input_width" v-model="tempObj.pagepath" placeholder="请输入小程序的页面路径，如：pages/index" clearable></el-input>
                                    </el-form-item>
                                </div>
                                <div>
                                    <el-form-item label="跳转链接(备用)：">
                                        <!-- <span>跳转链接：</span> -->
                                        <el-input class="input_width" v-model="tempObj.url" placeholder="请输入链接" clearable></el-input>
                                    </el-form-item>
                                </div>

                                <!-- <p class="blue">tips:需要和公众号进行关联才可以把小程序绑定带微信菜单上</p> -->
                            </div>
                            <div v-if="tempObj.type == 'scancode_push'">
                                <div>
                                    <el-form-item label="关键词(key)：">
                                        <!-- <span>关键词：</span> -->
                                        <el-input class="input_width" v-model="tempObj.key" placeholder="请输入关键词(key)" clearable></el-input>
                                    </el-form-item>
                                </div>
                                <!-- <p class="blue">tips:需要和公众号进行关联才可以把小程序绑定带微信菜单上</p> -->
                            </div>
                            <div v-if="tempObj.type == 'scancode_waitmsg'">
                                <div>
                                    <el-form-item label="关键词(key)：">
                                        <!-- <span>关键词：</span> -->
                                        <el-input class="input_width" v-model="tempObj.key" placeholder="请输入关键词(key)" clearable></el-input>
                                    </el-form-item>
                                </div>
                                <!-- <p class="blue">tips:需要和公众号进行关联才可以把小程序绑定带微信菜单上</p> -->
                            </div>
                            <div v-if="tempObj.type == 'pic_sysphoto'">
                                <div>
                                    <el-form-item label="关键词(key)：">
                                        <!-- <span>关键词：</span> -->
                                        <el-input class="input_width" v-model="tempObj.key" placeholder="请输入关键词(key)" clearable></el-input>
                                    </el-form-item>
                                </div>
                                <!-- <p class="blue">tips:需要和公众号进行关联才可以把小程序绑定带微信菜单上</p> -->
                            </div>
                            <div v-if="tempObj.type == 'pic_photo_or_album'">
                                <div>
                                    <el-form-item label="关键词(key)：">
                                        <!-- <span>关键词：</span> -->
                                        <el-input class="input_width" v-model="tempObj.key" placeholder="请输入关键词(key)" clearable></el-input>
                                    </el-form-item>
                                </div>
                                <!-- <p class="blue">tips:需要和公众号进行关联才可以把小程序绑定带微信菜单上</p> -->
                            </div>
                            <div v-if="tempObj.type == 'pic_weixin'">
                                <div>
                                    <el-form-item label="关键词(key)：">
                                        <!-- <span>关键词：</span> -->
                                        <el-input class="input_width" v-model="tempObj.key" placeholder="请输入关键词(key)" clearable></el-input>
                                    </el-form-item>
                                </div>
                                <!-- <p class="blue">tips:需要和公众号进行关联才可以把小程序绑定带微信菜单上</p> -->
                            </div>
                            <div v-if="tempObj.type == 'location_select'">
                                <div>
                                    <el-form-item label="关键词(key)：">
                                        <!-- <span>关键词：</span> -->
                                        <el-input class="input_width" v-model="tempObj.key" placeholder="请输入关键词(key)" clearable></el-input>
                                    </el-form-item>
                                </div>
                                <!-- <p class="blue">tips:需要和公众号进行关联才可以把小程序绑定带微信菜单上</p> -->
                            </div>
                        </div>
                    </div>
                </div>
                <el-button size="small" class="save_btn" type="success" @click="saveFun">保存&发布</el-button>
                <!-- <div>{{ menu }}</div> -->
            </div>
        </el-form>
        <!--一进页面就显示的默认页面，当点击左边按钮的时候，就不显示了-->
        <div v-if="showRightFlag" class="right">
            <p>请先选择菜单配置</p>
        </div>
    </div>
</template>
<script>
import { getMenu, saveMenu, deleteMenu } from '@/api/wechat'
import MediaLibrary from '@/views/components/MediaLibrary'

export default {
    name: 'PublicAccountManagement',
    props: {},
    data() {
        var validateName = (rule, value, callback) => {
            if (value == '') {
                callback(new Error('请输入名称'))
            } else {
                if (this.tempSelfObj.grand == 1) {
                    if (value.length > 4) {
                        this.tempObj.name = value.substr(0, 4)
                        callback(new Error('一级菜单最多4个汉字'))
                    }
                } else if (this.tempSelfObj.grand == 2) {
                    if (value.length > 7) {
                        this.tempObj.name = value.substr(0, 7)
                        callback(new Error('二级菜单最多7个汉字'))
                    }
                }
            }
        }
        return {
            showRightFlag: true, //右边配置显示默认详情还是配置详情
            menu: {
                // 一级菜单
                button: [
                    {
                        //type: "click",
                        name: '菜单1',
                        // key: "menu1",关键词
                        //url: "",//跳转链接
                        //media_id:"",//素材名称--图文消息
                        sub_button: [
                            {
                                //type: "",//media_id:素材内容; view:跳转链接
                                name: '子菜单1'
                                // url: "",//跳转链接
                                // media_id:"",//素材名称--图文消息
                            }
                        ]
                    }
                ]
            }, //横向菜单
            isActive: -1, // 一级菜单点中样式
            isSubMenuActive: -1, // 一级菜单点中样式
            isSubMenuFlag: -1, // 二级菜单显示标志

            tempObj: {
                // type:"view",//media_id:素材内容; view:跳转链接
                // name: '' //菜单名称
                // material:"",//素材名称
                // link:"",//跳转链接
            }, //右边临时变量，作为中间值牵引关系
            tempSelfObj: {
                //一些临时值放在这里进行判断，如果放在tempObj，由于引用关系，menu也会多了多余的参数
                // grand:"" 1:表示一级菜单； 2:表示二级菜单
                // index:"" 表示一级菜单索引
                // secondIndex:"" 表示二级菜单索引
            },

            visible2: false, //素材内容  "选择素材"按钮弹框显示隐藏
            tableData: [
                {
                    name: '素材1'
                },
                {
                    name: '素材2'
                },
                {
                    name: '素材3'
                }
            ], //素材内容弹框数据

            rules: {
                name: [{ validator: validateName, trigger: 'blur' }]
            }
        }
    },
    components: { MediaLibrary },

    created() {},
    mounted() {
        // this.httpGetData();
    },
    filters: {},
    methods: {
        // 素材内容弹框的选择按钮函数
        handleEdit(id) {
            this.cancel()
            this.tempObj.media_id = id
        },
        cancel() {
            this.visible2 = false
        },
        openIamge() {
            this.visible2 = true
            // this.getList()
        },
        saveFun() {
            // let menuString = JSON.stringify(this.menu)
            saveMenu(this.menu)
                .then(res => {
                    console.log('888: saveFun -> res', res)

                    this.$notify({
                        title: '保存成功',
                        type: 'success',
                        duration: 2500
                    })
                })
                .catch(err => {
                    // this.$notify({
                    //     title: '保存失败，请检查菜单',
                    //     type: 'error',
                    //     duration: 2500
                    // })
                    console.log(err.response.data.message)
                })
        },
        // 一级菜单点击事件
        menuFun(i, item) {
            this.showRightFlag = false //右边菜单隐藏
            // console.log(i);
            this.tempObj = item //这个如果放在顶部，flag会没有。因为重新赋值了。
            this.tempSelfObj.grand = '1' //表示一级菜单
            this.tempSelfObj.index = i //表示一级菜单索引

            this.isActive = i //一级菜单选中样式
            this.isSubMenuFlag = i //二级菜单显示标志
            this.isSubMenuActive = -1 //二级菜单去除选中样式
        },
        // 二级菜单点击事件
        subMenuFun(item, subItem, index, k) {
            this.showRightFlag = false //右边菜单隐藏

            this.tempObj = subItem //将点击的数据放到临时变量，对象有引用作用

            this.tempSelfObj.grand = '2' //表示二级菜单
            this.tempSelfObj.index = index //表示一级菜单索引
            this.tempSelfObj.secondIndex = k //表示二级菜单索引

            this.isSubMenuActive = index + '' + k //二级菜单选中样式
            this.isActive = -1 //一级菜单去除样式
        },
        // 添加横向一级菜单
        addMenu() {
            // 先判断1，再判断2,对象增加，会进行往下计算，所以必须先判断2，再判断1
            if (this.menuKeyLength == 2) {
                this.$set(this.menu.button, '2', {
                    // type: "",
                    name: '菜单3',
                    // url: "",//跳转链接
                    // media_id:"",//素材名称--图文消息
                    sub_button: []
                })
            }
            if (this.menuKeyLength == 1) {
                this.$set(this.menu.button, '1', {
                    // type: "",
                    name: '菜单2',
                    // url: "",//跳转链接
                    // media_id:"",//素材名称--图文消息
                    sub_button: []
                })
            }
        },
        // 添加横向二级菜单
        addSubMenu(item) {
            let subMenuKeyLength = item.sub_button.length //获取二级菜单key长度
            if (subMenuKeyLength == 4) {
                this.$set(item.sub_button, '4', {
                    // type: "",
                    name: '子菜单5'
                    // url: "",//跳转链接
                    // media_id:"",//素材名称--图文消息
                })
            }
            if (subMenuKeyLength == 3) {
                this.$set(item.sub_button, '3', {
                    // type: "",
                    name: '子菜单4'
                    // url: "",//跳转链接
                    // media_id:"",//素材名称--图文消息
                })
            }
            if (subMenuKeyLength == 2) {
                this.$set(item.sub_button, '2', {
                    // type: "",
                    name: '子菜单3'
                    // url: "",//跳转链接
                    // media_id:"",//素材名称--图文消息
                })
            }
            if (subMenuKeyLength == 1) {
                this.$set(item.sub_button, '1', {
                    // type: "",
                    name: '子菜单2'
                    // url: "",//跳转链接
                    // media_id:"",//素材名称--图文消息
                })
            }
            if (subMenuKeyLength == 0) {
                this.$set(item.sub_button, '0', {
                    // type: "",
                    name: '子菜单1'
                    // url: "",//跳转链接
                    // media_id:"",//素材名称--图文消息
                })
            }
        },
        //删除当前菜单
        deleteMenu(obj) {
            console.log(obj)
            var _this = this
            this.$confirm('此操作将删除选中菜单, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    _this.deleteData() // 删除菜单数据
                })
                .catch(() => {})
        },
        // 删除菜单数据
        deleteData() {
            // 一级菜单的删除方法
            if (this.tempSelfObj.grand == '1') {
                this.menu.button.splice(this.tempSelfObj.index, 1)
            }
            // 二级菜单的删除方法
            if (this.tempSelfObj.grand == '2') {
                this.menu.button[this.tempSelfObj.index].sub_button.splice(this.tempSelfObj.secondIndex, 1)
            }
            this.$message({
                type: 'success',
                message: '删除成功!'
            })
        },

        // 删除所有菜单数据
        deleteAllMenu() {
            var _this = this
            this.$confirm('此操作将删除所有菜单, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    deleteMenu()
                        .then(res => {
                            this.$notify({
                                title: '删除成功',
                                type: 'success',
                                duration: 2500
                            })
                        })
                        .catch(err => {
                            console.log(err.response.data.message)
                        })
                    this.menu = {
                        // 一级菜单
                        button: [
                            {
                                //type: "click",
                                name: '菜单1',
                                // key: "menu1",关键词
                                //url: "",//跳转链接
                                //media_id:"",//素材名称--图文消息
                                sub_button: [
                                    {
                                        //type: "",//media_id:素材内容; view:跳转链接
                                        name: '子菜单1'
                                        // url: "",//跳转链接
                                        // media_id:"",//素材名称--图文消息
                                    }
                                ]
                            }
                        ]
                    }
                })
                .catch(() => {})
        },

        // 加载菜单数据
        loadMenu() {
            getMenu()
                .then(res => {
                    console.log('888: loadMenu -> res', res)
                    if (res.is_menu_open == 0) {
                        this.$notify({
                            title: '没有可加载菜单',
                            type: 'warning',
                            duration: 2500
                        })
                    } else {
                        this.menu = res.menu
                        this.$notify({
                            title: '加载成功',
                            type: 'success',
                            duration: 2500
                        })
                    }
                })
                .catch(err => {
                    console.log(err.response.data.message)
                })
            // this.menu = {
            //     button: [
            //         {
            //             name: '菜单1',
            //             sub_button: [
            //                 { name: '子菜单1', type: 'click', key: '3342' },
            //                 { name: '子菜单2', type: 'miniprogram', key: '222', appid: '33', pagepath: '333' },
            //                 { name: '子菜单3', type: 'view', url: '222' }
            //             ]
            //         },
            //         { name: '菜单2', sub_button: [{ name: '子菜单1' }] },
            //         {
            //             name: '菜单3',
            //             sub_button: [
            //                 { name: '子菜单1', type: 'view', media_id: '素材1' },
            //                 { name: '子菜单2', type: 'media_id', media_id: '素材7' },
            //                 { name: '子菜单3', type: 'media_id', media_id: '素材1' }
            //             ]
            //         }
            //     ]
            // }
        }
    },
    computed: {
        // menuObj的长度，当长度 小于  3 才显示一级菜单的加号
        menuKeyLength: function() {
            return this.menu.button.length
        }
    }
}
</script>
<!--本组件样式-->
<style scoped="scoped">
/* 公共颜色变量 */
.clearfix {
    *zoom: 1;
}
.clearfix::after {
    content: '';
    display: table;
    clear: both;
}
div {
    text-align: left;
}
.public-account-management {
    /* min-width: 1200px; */
    /* width: 1200px; */
    /* margin: 0 auto; */
    /* padding: 30px 0 0 0px; */
    background-color: #fff;
}
.public-account-management .left {
    float: left;
    display: inline-block;
    width: 350px;
    height: 715px;
    background: url('../../assets/ipx.png') no-repeat;
    background-size: 100% auto;
    padding: 600px 25px 69px;
    position: relative;
    box-sizing: border-box;
}
/*第一级菜单*/
.public-account-management .left .menu .menu_bottom {
    position: relative;
    float: left;
    display: inline-block;
    box-sizing: border-box;
    width: 100px;
    /*height: 44px;*/
    /*line-height: 44px;*/
    text-align: center;
    background-color: #e2e2e2;
    border: 1px solid #ebedee;
    cursor: pointer;
}
.public-account-management .left .menu .menu_bottom.menu_addicon {
    height: 46px;
    line-height: 46px;
}
.public-account-management .left .menu .menu_bottom .menu_item {
    height: 44px;
    line-height: 44px;
    /*padding: 14px 0;*/
    text-align: center;
    box-sizing: border-box;
}
.public-account-management .left .menu .menu_bottom .menu_item.active {
    border: 1px solid #2ee2ac;
}
.public-account-management .left .menu .menu_bottom .menu_subItem {
    height: 44px;
    line-height: 44px;
    text-align: center;
    box-sizing: border-box;
}
/*padding: 14px 0;*/
.public-account-management .left .menu .menu_bottom .menu_subItem.active {
    border: 1px solid #2ee2ac;
}
.public-account-management .left .menu i {
    color: #2ee2ac;
}
/*第二级菜单*/
.public-account-management .left .menu .submenu {
    position: absolute;
    width: 100px;
    bottom: 45px;
}
.public-account-management .left .menu .submenu .subtitle {
    background-color: #f5efef;
    box-sizing: border-box;
    margin-bottom: 2px;
}
.public-account-management .left .save_btn {
    position: absolute;
    bottom: -50px;
    left: 100px;
}
/*右边菜单内容*/
.public-account-management .right {
    float: left;
    width: 63%;
    background-color: #f5efef;
    padding: 25px 10px 0px 20px;
    height: 656px;
    margin-left: 20px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}

.public-account-management .delete_btn {
    text-align: right;
    float: left;
    width: 63%;
    background-color: #f5efef;
    padding: 25px 30px 0px 0px;
    margin-left: 20px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
.public-account-management .right .configure_page .menu_content {
    margin-top: 20px;
}
.public-account-management .right .configure_page .configur_content {
    margin-top: 20px;
}
.public-account-management .right .configure_page .blue {
    color: #016df8;
    margin-top: 10px;
}
.public-account-management .right .configure_page .applet {
    margin-bottom: 20px;
}
.public-account-management .right .configure_page .applet span {
    margin-right: 18px;
}
.public-account-management .right .configure_page .material .input_width {
    width: 30%;
}
.public-account-management .right .configure_page .material .el-textarea {
    width: 80%;
}
</style>
<!--修改UI框架样式-->
<style>
.public-account-management .el-input {
    width: 78%;
}
.public-account-management .material .el-button {
    float: right;
}
.public-account-management .el-form-item__error {
    text-indent: 140px;
}
.public-account-management .el-form-item__label {
    width: 140px;
    text-align: left;
}
</style>
