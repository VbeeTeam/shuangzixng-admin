<template>
    <div class="editor_warp">
        <div ref="editor" class="text" />
        <!-- <div style="margin: 12px 5px;font-size: 16px;font-weight: bold;color: #696969">HTML渲染如下：</div> -->
        <div class="editor-content">
            <div class="content" v-html="editorContent" />
        </div>
    </div>
</template>

<script>
import '@/assets/styles/jodit.min.css'
import Jodit from 'jodit'
import { mapGetters } from 'vuex'
import E from 'wangeditor'
import { getToken } from '@/utils/auth'
import { uploadImages, uploadImg } from '@/api/wechat'

export default {
    name: 'Editor',
    props: {
        // 此处一定要用value
        // value: {
        //     type: String
        // },
        // 增加content 用作编辑时从父组件传入已有文章 解决文章末尾回车问题
        content: {
            type: String
        }
    },
    data() {
        return {
            headers: {
                Authorization: ' ' + getToken()
            },

            editorContent: ``,
            editor: ''
        }
    },
    watch: {
        // value(val) {
        //     this.editorContent = val
        //     this.editor.value = this.editorContent
        // },
        content(val) {
            console.log('GOOGLE: watch')
            this.editorContent = val
            this.editor.value = this.editorContent
        }
    },
    computed: {
        ...mapGetters(['imagesUploadApi'])
    },
    mounted() {
        const that = this
        // var editor = new E(this.$refs.editor)
        // var editor = new Jodit(this.$refs.editor)

        var editor = new Jodit(this.$refs.editor, {
            // minWidth: 500,
            // maxWidth: 600,
            width: 600,
            height: 500,
            askBeforePasteHTML: false,
            // processPasteHTML: false,
            language: 'zh_cn',
            // toolbarStickyOffset: 100,
            // toolbarSticky: false,
            uploader: {
                url: uploadImages,
                // format: 'json',
                filesVariableName: function(e) {
                    return 'files'
                },

                insertImageAsBase64URI: false,
                imagesExtensions: ['jpg', 'png', 'jpeg', 'gif'],
                withCredentials: true,
                headers: this.headers,

                prepareData: function(data) {
                    console.log(data)
                    data.append('id', 24)
                    return data
                },
                isSuccess: function(resp) {
                    console.log('0>>>' + JSON.stringify(resp[0]))
                    return resp
                },
                process: function(resp) {
                    console.log('GOOGLE: resp', resp)
                    return {
                        files: ['', resp.data[0] + '?time=' + new Date().valueOf()],
                        isImages: [false, true],
                        baseurl: ''
                        // error: resp[0].fileType,
                        // msg: resp[0].size
                    }
                }
            }
            // events: {
            //     beforePaste: function(event) {
            //         console.log('GOOGLE: beforePaste')
            //     },
            //     processPaste: function(event, html) {
            //         console.log('GOOGLE: html', html)
            //         html = '1234'
            //     },
            //     afterPaste: function(event) {
            //         console.log('GOOGLE: afterPaste')
            //     }
            // }
        })
        this.editor = editor
        // 监听编辑器内容改变 给预览 父组件赋值
        editor.events.on('change', function(value, aa, bb) {
            console.log('GOOGLE: change')
            that.editorContent = value
            that.editorContent = that.editorContent.replace(/crossorigin=\"anonymous\"/g, '')
            // that.editor.value = that.editorContent
            that.$emit('input', that.editorContent)
        })

        // 监听编辑器内容从粘贴来 处理图片跨域 给预览 父组件赋值 并返回给编辑器本身 给编辑器本身赋值会使光标返回开头
        // processPaste 触发不稳定
        // editor.events.on('processPaste', function(event, clipboard_html, types_str) {
        //     console.log('GOOGLE: processPaste')
        //     that.editor.selection.insertHTML(clipboard_html)
        //     that.editor.tempContent = that.editor.getEditorValue()
        // })
        // 获取的数据不对
        // editor.events.on('paste', function(event) {
        //     console.log('GOOGLE: paste', that.editor.value)
        //     that.editorContent = that.editor.getEditorValue()
        //     that.editorContent = that.editorContent.replace(/crossorigin=\"anonymous\"/g, '')
        //     that.editor.value = that.editorContent
        //     that.$emit('input', that.editorContent)
        // })
        // 第一次粘贴不触发
        // editor.events.on('afterPaste', function(event) {
        //     console.log('GOOGLE: afterPaste', that.editor.value)
        //     that.editorContent = that.editor.value
        //     that.editorContent = that.editorContent.replace(/crossorigin=\"anonymous\"/g, '')
        //     that.editor.value = that.editorContent
        //     that.$emit('input', that.editorContent)
        // })

        // 初始化数据
        // editor.value = this.value
        // console.log('GOOGLE: value', this.value)
    }
}
</script>

<style scoped="scoped">
.editor_warp {
    display: flex;
    justify-content: space-around;
}

.editor-content {
    position: relative;
    /* float: right; */
    box-sizing: border-box;
    margin-right: 30px;
    margin-left: 58px;
    padding: 25px 17px 20px;
    /* display: inline-block; */
    width: 375px;
    height: 768px;
    background: #fff url('../../assets/ipx.png') no-repeat;
    background-size: 100% auto;
}

.content {
    overflow-y: scroll;
    width: 100%;
    height: 100%;
    background-color: #fff;
    word-break: break-all;
}

.content::-webkit-scrollbar {
    display: none;
}

.text {
    float: left;
    margin: 0;
    text-align: left;
    /* width: 500px !important; */
}

.editor_warp >>> .jodit_container {
    float: left;
    text-align: left;
    /* margin: 5px; */
    /* width: 60%; */
}
</style>

<style>
.w-e-text-container {
    /* min-height: 600px; */
}
.jodit_workplace {
    /* min-height: 600px !important; */
}
</style>
