<script lang="ts" setup>
import { type ThemeName, useTheme } from "@/hooks/useTheme"
import { mergeProps, ref } from "vue"

const { themeList, activeThemeName, setTheme } = useTheme()

const handleChangeTheme = ({ clientX, clientY }: any, themeName: ThemeName) => {
  const maxRadius = Math.hypot(
    Math.max(clientX, window.innerWidth - clientX),
    Math.max(clientY, window.innerHeight - clientY)
  )
  const style = document.documentElement.style
  style.setProperty("--v3-theme-x", clientX + "px")
  style.setProperty("--v3-theme-y", clientY + "px")
  style.setProperty("--v3-theme-r", maxRadius + "px")
  const handler = () => {
    setTheme(themeName)
  }

  document.startViewTransition ? document.startViewTransition(handler) : handler()
}
const menu = ref(false)
</script>

<template>
  <v-menu v-model="menu">
    <template #activator="{ props: menu }">
      <v-tooltip text="主题模式">
        <template #activator="{ props: tooltip }">
          <v-icon :size="20" v-bind="mergeProps(menu, tooltip)" icon="mdi-magic-staff" />
        </template>
      </v-tooltip>
    </template>
    <template #default>
      <v-list>
        <v-list-item
          v-for="(theme, index) in themeList"
          :key="index"
          :disabled="activeThemeName === theme.name"
          @click="
            (e: MouseEvent | KeyboardEvent) => {
              handleChangeTheme(e, theme.name)
            }
          "
        >
          <span>{{ theme.title }}</span>
        </v-list-item>
      </v-list>
    </template>
  </v-menu>
</template>
