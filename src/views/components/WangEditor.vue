<template>
    <div class="editor_warp">
        <div ref="editor" class="text"></div>
        <!-- <div style="margin: 12px 5px;font-size: 16px;font-weight: bold;color: #696969">HTML渲染如下：</div> -->
        <div class="editor-content">
            <div class="content" v-html="editorContent"></div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import E from 'wangeditor'
import { getToken } from '@/utils/auth'
import { uploadImages, uploadImg } from '@/api/wechat'

export default {
    name: 'Editor',
    data() {
        return {
            headers: {
                Authorization: ' ' + getToken()
            },
            // headers: { 'Content-Type': 'multipart/form-data', Authorization: ' ' + getToken() },
            // headers: {
            //     Accept: 'multipart/form-data',
            //     Authorization: ' ' + getToken()
            // },
            editorContent: ``,
            editor: ''
        }
    },
    props: {
        //此处一定要用value
        value: {
            type: String
        }
    },
    watch: {
        value(val) {
            // console.log(val)
            this.editorContent = val
            this.editor.txt.html(this.editorContent)
        }
    },
    computed: {
        ...mapGetters(['imagesUploadApi'])
    },
    mounted() {
        var editor = new E(this.$refs.editor)
        //editor.customConfig.uploadImgShowBase64 = false // 使用 base64 保存图片
        // 关闭粘贴样式的过滤
        editor.customConfig.pasteFilterStyle = false
        // 忽略粘贴内容中的图片
        editor.customConfig.pasteIgnoreImg = true
        // 不可修改
        editor.customConfig.uploadImgHeaders = this.headers
        // editor.customConfig.debug = true;
        // 自定义文件名，不可修改，修改后会上传失败

        if (this.$parent.model.cataList) {
            editor.customConfig.uploadFileName = 'file'
            editor.customConfig.uploadImgServer = process.env.VUE_APP_BASE_API + '/api/oss/resources?configId=3' // 上传图片到服务器
        } else {
            editor.customConfig.uploadFileName = 'files'
            editor.customConfig.uploadImgServer = uploadImages // 上传图片到服务器
        }

        editor.customConfig.withCredentials = true
        // 将 timeout 时间改为 3s
        editor.customConfig.uploadImgTimeout = 3000
        editor.customConfig.uploadImgHooks = {
            before: function(xhr, editor, files) {
                console.log('GOOGLE: xhr', xhr)
                console.log('GOOGLE: files', files)
                // 图片上传之前触发
                // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件
                // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
                // return {
                //     prevent: true,
                //     msg: '放弃上传'
                // }
            },
            success: function(xhr, editor, result) {
                console.log('GOOGLE: xhr, editor, result', result)
                // 图片上传并返回结果，图片插入成功之后触发
                // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
            },
            fail: function(xhr, editor, result) {
                console.log('GOOGLE: xhr, editor, result', xhr, editor, result)
                // 图片上传并返回结果，但图片插入错误时触发
            }
        }
        editor.customConfig.onchange = html => {
            this.editorContent = html
            this.$emit('input', this.editorContent)
        }
        editor.create()
        // 初始化数据
        editor.txt.html(this.editorContent)
        this.editor = editor
    }
}
</script>

<style scoped="scoped">
.editor_warp {
    /* display: flex; */
    justify-content: space-around;
}

.editor-content {
    padding-left: 5px;
    width: 30px;
    float: right;
    display: inline-block;
    width: 350px;
    height: 715px;
    background: url('../../assets/ipx.png') no-repeat;
    background-size: 100% auto;
    padding: 60px 30px 69px;
    position: relative;
    box-sizing: border-box;
    margin-right: 30px;
}

.content {
    width: 290px;
    height: 100%;
    overflow-y: scroll;
    word-break: break-all;
}

.content::-webkit-scrollbar {
    display: none;
}

.text {
    float: left;
    text-align: left;
    margin: 5px;
    width: 60%;
}
</style>
<style>
.w-e-text-container {
    min-height: 600px;
}
</style>
