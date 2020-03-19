<template>
    <div class="login">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-position="left" label-width="0px" class="login-form">
            <div class="title">
                <svg-icon class="title-svg" icon-class="title" />
            </div>
            <el-form-item prop="username">
                <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号" style="width:100%">
                    <span slot="prefix" class=" el-input__icon input-icon icon iconfont icon-icon_user" style="margin-top:4px; display:block;"></span>
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码" @keyup.enter.native="handleLogin" style="width:100%">
                    <span slot="prefix" class=" el-input__icon input-icon icon iconfont icon-icon_lock" style="margin-top:3px; display:block;"></span>
                </el-input>
            </el-form-item>
            <el-form-item prop="code">
                <el-input v-model="loginForm.code" auto-complete="off" placeholder="验证码" style="width: 63%" @keyup.enter.native="handleLogin">
                    <span slot="prefix" class=" el-input__icon input-icon icon iconfont icon-icon_safe" style="margin-top:3px; display:block;"></span>
                </el-input>
                <div class="login-code">
                    <img :src="codeUrl" @click="getCode" />
                </div>
            </el-form-item>
            <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">
                记住我
            </el-checkbox>
            <el-form-item style="width:100%; text-align:center;">
                <el-button :loading="loading" size="medium" type="primary" style="width:200px;" @click.native.prevent="handleLogin">
                    <span v-if="!loading">登 录</span>
                    <span v-else>登 录 中...</span>
                </el-button>
            </el-form-item>
        </el-form>
        <!--  底部  -->
        <div v-if="$store.state.settings.showFooter" id="el-login-footer">
            <span v-html="$store.state.settings.footerTxt" />
            <span> ⋅ </span>
            <a href="http://www.beian.miit.gov.cn" target="_blank">{{ $store.state.settings.caseNumber }}</a>
        </div>
    </div>
</template>

<script>
import { encrypt } from '@/utils/rsaEncrypt'
import Config from '@/settings'
import { getCodeImg } from '@/api/login'
import Cookies from 'js-cookie'
export default {
    name: 'Login',
    data() {
        return {
            codeUrl: '',
            cookiePass: '',
            loginForm: {
                username: '',
                password: '',
                rememberMe: false,
                code: '',
                uuid: ''
            },
            loginRules: {
                username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
                password: [{ required: true, trigger: 'blur', message: '密码不能为空' }],
                code: [{ required: true, trigger: 'change', message: '验证码不能为空' }]
            },
            loading: false,
            redirect: undefined
        }
    },
    watch: {
        $route: {
            handler: function(route) {
                this.redirect = route.query && route.query.redirect
            },
            immediate: true
        }
    },
    created() {
        this.getCode()
        this.getCookie()
    },
    methods: {
        getCode() {
            getCodeImg().then(res => {
                this.codeUrl = res.img
                this.loginForm.uuid = res.uuid
            })
        },
        getCookie() {
            const username = Cookies.get('username')
            let password = Cookies.get('password')
            const rememberMe = Cookies.get('rememberMe')
            // 保存cookie里面的加密后的密码
            this.cookiePass = password === undefined ? '' : password
            password = password === undefined ? this.loginForm.password : password
            this.loginForm = {
                username: username === undefined ? this.loginForm.username : username,
                password: password,
                rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
                code: ''
            }
        },
        handleLogin() {
            this.$refs.loginForm.validate(valid => {
                const user = {
                    username: this.loginForm.username,
                    password: this.loginForm.password,
                    rememberMe: this.loginForm.rememberMe,
                    code: this.loginForm.code,
                    uuid: this.loginForm.uuid
                }
                if (user.password !== this.cookiePass) {
                    user.password = encrypt(user.password)
                }
                console.log('GOOGLE: user', user)

                if (valid) {
                    this.loading = true
                    if (user.rememberMe) {
                        Cookies.set('username', user.username, { expires: Config.passCookieExpires })
                        Cookies.set('password', user.password, { expires: Config.passCookieExpires })
                        Cookies.set('rememberMe', user.rememberMe, { expires: Config.passCookieExpires })
                    } else {
                        Cookies.remove('username')
                        Cookies.remove('password')
                        Cookies.remove('rememberMe')
                    }
                    this.$store
                        .dispatch('Login', user)
                        .then(() => {
                            this.loading = false
                            this.$router.push({ path: this.redirect || '/' })
                        })
                        .catch(() => {
                            this.loading = false
                            this.getCode()
                        })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    // background-size: cover;
    background: lightskyblue url('../assets/img/login.png') no-repeat center / cover;
    // background-image: url('../assets/img/login.png');
}
.login .title {
    margin: 0 auto 30px auto;
    color: #016df8;
    text-align: center;
    font-weight: 900;
    font-size: 18px;
}

.login-form {
    padding: 25px 25px 5px 25px;
    width: 385px;
    border-radius: 6px;
    background: #fff;
    .el-input {
        height: 38px;
        input {
            height: 38px;
        }
    }
    .input-icon {
        margin-left: 2px;
        width: 14px;
        height: 39px;
    }
}
.login-tip {
    color: #bfbfbf;
    text-align: center;
    font-size: 13px;
}
.login-code {
    display: inline-block;
    float: right;
    width: 33%;
    height: 38px;
    img {
        vertical-align: middle;
        cursor: pointer;
    }
}
.login .icon {
    color: #016df8;
}
.login .title-svg {
    height: 30px;
    vertical-align: baseline;
    font-size: 170px;
}
</style>
