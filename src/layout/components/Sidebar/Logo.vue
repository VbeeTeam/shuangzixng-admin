<template>
    <div class="sidebar-logo-container" :class="{ collapse: collapse }">
        <transition name="sidebarLogoFade">
            <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
                <img v-if="logo" :src="logo" class="sidebar-logo" />
                <h1 v-else class="sidebar-title">
                    {{ title }}
                </h1>
            </router-link>
            <router-link v-else key="expand" class="sidebar-logo-link" to="/">
                <img v-if="logo" :src="logo" class="sidebar-logo" />
                <h1 class="sidebar-title">
                    {{ title }}
                </h1>
            </router-link>
        </transition>
    </div>
</template>

<script>
import Logo from '@/assets/images/logo.png'
export default {
    name: 'SidebarLogo',
    props: {
        collapse: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            title: '星池-后台管理',
            logo: Logo
        }
    }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
    transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
    opacity: 0;
}

.sidebar-logo-container {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 50px;
    text-align: center;
    line-height: 50px;

    & .sidebar-logo-link {
        width: 100%;
        height: 100%;

        & .sidebar-logo {
            margin-left: 12px;
            // width: 32px;
            height: 32px;
            vertical-align: middle;
        }

        & .sidebar-title {
            display: inline-block;
            margin: 0;
            color: #fff;
            vertical-align: middle;
            font-weight: 600;
            font-size: 14px;
            font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
            line-height: 50px;
        }
    }

    &.collapse {
        .sidebar-logo {
            margin-left: 12px;
        }
    }
}
</style>
