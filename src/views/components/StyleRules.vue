<template>
    <div class="app-container">
        <h2 class="h2">Style</h2>
        <h3 class="h3">尺寸</h3>
        <p class="info">尺寸有：medium、small、mini，default,项目设置默认尺寸为small(size为small时可以不写)</p>
        <h3 class="h3">主色</h3>
        <div class="el-row">
            <div class="" style="float: left; box-sizing: border-box; width: 329.156px; padding-left: 6px; padding-right: 6px;">
                <div class="demo-color-box" style=" background: #016DF8;">
                    Primary Color
                    <div class="value" style="font-size: 12px; opacity: 0.69; line-height: 24px;">#016DF8</div>
                </div>
            </div>
        </div>
        <p class="info">除了主色外的场景色，需要在不同的场景中使用（例如危险色表示危险的操作）。</p>
        <div class="el-row">
            <div class="el-col el-col-6 el-col-xs-12">
                <div class="demo-color-box" style=" background: #2EE2AC;">
                    Success
                    <div class="value" style="font-size: 12px; opacity: 0.69; line-height: 24px;">#2EE2AC</div>
                    <div class="bg-color-sub"></div>
                </div>
            </div>
            <div class="el-col el-col-6 el-col-xs-12">
                <div class="demo-color-box" style=" background: #FEA03A;">
                    Warning
                    <div class="value" style="font-size: 12px; opacity: 0.69; line-height: 24px;">#FEA03A</div>
                    <div class="bg-color-sub"></div>
                </div>
            </div>
            <div class="el-col el-col-6 el-col-xs-12">
                <div class="demo-color-box" style=" background: #FF631D;">
                    Danger
                    <div class="value" style="font-size: 12px; opacity: 0.69; line-height: 24px;">#FF631D</div>
                    <div class="bg-color-sub"></div>
                </div>
            </div>
            <div class="el-col el-col-6 el-col-xs-12">
                <div class="demo-color-box" style=" background: #999999;">
                    Info
                    <div class="value" style="font-size: 12px; opacity: 0.69; line-height: 24px;">#999999</div>
                    <div class="bg-color-sub"></div>
                </div>
            </div>
        </div>
        <h3 class="h3">表单</h3>
        <p class="info">表单label设置了最小宽度110px</p>
        <h3 class="h3">输入框</h3>
        <p class="info">输入框使用small尺寸即项目默认尺寸,small尺寸下默认宽度为140px,其他情况如240px的宽度再单独设置(可以在class添加long-input属性,long-input属性目前设置为240px)</p>
        <el-form ref="form">
            <el-form-item label="默认">
                <el-input></el-input>
            </el-form-item>
            <el-divider></el-divider>
            <p class="info">class="long-input"</p>
            <el-form-item label="240尺寸">
                <el-input class="long-input"></el-input>
            </el-form-item>
        </el-form>
        <h3 class="h3">按钮</h3>
        <el-form ref="form">
            <p class="info">默认按钮 size="small" type="primary"</p>
            <el-form-item label="默认">
                <el-button type="primary">默认</el-button>
            </el-form-item>
            <el-divider></el-divider>
            <el-form-item label='无背景  type="info"'>
                <el-button type="info">无背景</el-button>
            </el-form-item>
            <el-divider></el-divider>
            <p class="info">长按钮 class="long-button"</p>
            <el-form-item label="200尺寸">
                <el-button class="long-button" type="primary">200px</el-button>
            </el-form-item>
            <el-divider></el-divider>
            <p class="info">文字按钮 type="text" size="mini" 颜色用class区分</p>
            <el-form-item label='文字按钮 class="btn-primary"'>
                <el-button type="text" size="mini" class="btn-primary">primary</el-button>
            </el-form-item>
            <el-form-item label='文字按钮 class="btn-success"'>
                <el-button type="text" size="mini" class="btn-success">success</el-button>
            </el-form-item>
            <el-form-item label='文字按钮 class="btn-warning"'>
                <el-button type="text" size="mini" class="btn-warning">warning</el-button>
            </el-form-item>
            <el-form-item label='文字按钮 class="btn-danger"'>
                <el-button type="text" size="mini" class="btn-danger">danger</el-button>
            </el-form-item>
        </el-form>
        <h3 class="h3">switch</h3>
        <p class="info">设置了默认颜色及尺寸</p>
        <el-form ref="form">
            <el-form-item label="">
                <el-switch v-model="iswitch" inactive-text="否" active-text="是"> </el-switch>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'StyleRules',
    data() {
        return {
            iswitch: false
        }
    },
    mounted() {}
}
</script>

<style scoped>
.h2 {
    font-size: 28px;
    color: #1f2f3d;
    margin: 0;
    font-weight: 400;
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', SimSun, sans-serif;
}
.h3 {
    font-size: 22px;
    font-weight: 400;
    color: #1f2f3d;
    margin: 55px 0 20px;
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', SimSun, sans-serif;
}
.info {
    font-size: 14px;
    color: #5e6d82;
    line-height: 1.5em;
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', SimSun, sans-serif;
}
.el-row {
    position: relative;
    box-sizing: border-box;
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', SimSun, sans-serif;
    margin-left: -6px;
    margin-right: -6px;
}
.el-col {
    float: left;
    box-sizing: border-box;
    width: 197.5px;
    padding-left: 6px;
    padding-right: 6px;
}
.demo-color-box {
    position: relative;
    border-radius: 4px;
    padding: 20px;
    margin: 5px 0;
    height: 114px;
    box-sizing: border-box;
    color: #fff;
    font-size: 14px;
}
.bg-color-sub {
    border-radius: 0 0 4px 4px;
    width: 185.5px;
    height: 40px;
    left: 0;
    bottom: 0;
    position: absolute;
}
</style>
