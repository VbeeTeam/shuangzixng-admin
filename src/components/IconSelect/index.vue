<!-- @author zhengjie -->
<template>
    <div class="icon-body">
        <el-input v-model="name" style="position: relative;" clearable placeholder="请输入图标名称" @clear="filterIcons" @input.native="filterIcons">
            <i slot="suffix" class="el-icon-search el-input__icon" />
        </el-input>
        <div class="icon-list">
            <div v-for="(item, index) in iconList" :key="index" @click="selectedIcon(item)">
                <svg-icon :icon-class="item" style="height: 30px;width: 16px;" />
                <span>{{ item }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import icons from './requireIcons'
export default {
    name: 'IconSelect',
    data() {
        return {
            name: '',
            iconList: icons
        }
    },
    methods: {
        filterIcons() {
            if (this.name) {
                this.iconList = this.iconList.filter(item => item.includes(this.name))
            } else {
                this.iconList = icons
            }
        },
        selectedIcon(name) {
            this.$emit('selected', name)
            document.body.click()
        },
        reset() {
            this.name = ''
            this.iconList = icons
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.icon-body {
    padding: 10px;
    width: 100%;
    .icon-list {
        overflow-y: scroll;
        height: 200px;
        div {
            float: left;
            margin-bottom: -5px;
            width: 50%;
            height: 30px;
            line-height: 30px;
            cursor: pointer;
        }
        span {
            display: inline-block;
            overflow: hidden;
            vertical-align: -0.15em;

            fill: currentColor;
        }
    }
}
</style>
