<script lang="ts" setup>
import { useTheme } from "@/hooks/useTheme"
// 将 Element Plus 的语言设置为中文
// import zhCn from "element-plus/es/locale/lang/zh-cn"

const { initTheme, activeThemeName } = useTheme()

/** 初始化主题 */
initTheme()
</script>

<template>
  <!-- <el-config-provider :locale="zhCn"> -->
  <v-app :theme="activeThemeName">
    <router-view />
  </v-app>
  <!-- </el-config-provider> -->
</template>
