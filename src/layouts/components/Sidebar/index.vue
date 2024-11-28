<script lang="ts" setup>
import { computed } from "vue"
import { useAppStore } from "@/store/modules/app"
import { usePermissionStore } from "@/store/modules/permission"
import { useSettingsStore } from "@/store/modules/settings"
import SidebarItem from "./SidebarItem.vue"
import Logo from "../Logo/index.vue"

import { useLayoutMode } from "@/hooks/useLayoutMode"
import { getCssVariableValue } from "@/utils"

const v3SidebarMenuBgColor = getCssVariableValue("--v3-sidebar-menu-bg-color")

const { isLeft, isTop } = useLayoutMode()

const appStore = useAppStore()
const permissionStore = usePermissionStore()
const settingsStore = useSettingsStore()

const noHiddenRoutes = computed(() => permissionStore.routes.filter((item) => !item.meta?.hidden))
const isCollapse = computed(() => !appStore.sidebar.opened)
const isLogo = computed(() => isLeft.value && settingsStore.showLogo)
const backgroundColor = computed(() => (isLeft.value ? v3SidebarMenuBgColor : undefined))

const tipLineWidth = computed(() => {
  return !isTop.value ? "2px" : "0px"
})

console.log(noHiddenRoutes.value)
</script>

<template>
  <div :class="{ 'has-logo': isLogo }">
    <div style="position: relative; height: 100%">
      <v-navigation-drawer :rail="isCollapse && !isTop" absolute :color="backgroundColor">
        <v-list nav activatable>
          <v-list-item v-if="isLogo" :active="false">
            <template #title>
              <Logo :collapse="isCollapse" />
            </template>
          </v-list-item>
          <v-divider />
          <SidebarItem v-for="route in noHiddenRoutes" :key="route.path" :item="route" :base-path="route.path" />
        </v-list>
      </v-navigation-drawer>
    </div>
  </div>
</template>

<style lang="scss" scoped>
%tip-line {
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: v-bind(tipLineWidth);
    height: 100%;
    background-color: var(--v3-sidebar-menu-tip-line-bg-color);
  }
}
</style>
