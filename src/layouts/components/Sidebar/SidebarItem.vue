<script lang="ts" setup>
import { computed } from "vue"
import { type RouteRecordRaw } from "vue-router"
import SidebarItemLink from "./SidebarItemLink.vue"
import { isExternal } from "@/utils/validate"
import path from "path-browserify"

interface Props {
  item: RouteRecordRaw
  basePath?: string
}

const parentProps = withDefaults(defineProps<Props>(), {
  basePath: ""
})

/** 是否始终显示根菜单 */
const alwaysShowRootMenu = computed(() => parentProps.item.meta?.alwaysShow)

/** 显示的子菜单 */
const showingChildren = computed(() => {
  return parentProps.item.children?.filter((child) => !child.meta?.hidden) ?? []
})

/** 显示的子菜单数量 */
const showingChildNumber = computed(() => {
  return showingChildren.value.length
})

/** 唯一的子菜单项 */
const theOnlyOneChild = computed(() => {
  const number = showingChildNumber.value
  switch (true) {
    case number > 1:
      return null
    case number === 1:
      return showingChildren.value[0]
    default:
      return { ...parentProps.item, path: "" }
  }
})

/** 解析路径 */
const resolvePath = (routePath: string) => {
  switch (true) {
    case isExternal(routePath):
      return routePath
    case isExternal(parentProps.basePath):
      return parentProps.basePath
    default:
      return path.resolve(parentProps.basePath, routePath)
  }
}
</script>

<template>
  <template v-if="!alwaysShowRootMenu && theOnlyOneChild && !theOnlyOneChild.children">
    <SidebarItemLink v-if="theOnlyOneChild.meta" :to="resolvePath(theOnlyOneChild.path)">
      <v-list-item link :index="resolvePath(theOnlyOneChild.path)" :title="theOnlyOneChild.meta.title">
        <template v-if="theOnlyOneChild.meta?.elIcon" #prepend>
          <v-icon :icon="theOnlyOneChild.meta?.elIcon" />
        </template>
      </v-list-item>
    </SidebarItemLink>
  </template>
  <v-list-group v-else :value="parentProps.item.meta?.title">
    <template v-slot:activator="{ props }">
      <v-list-item v-bind="props" :title="parentProps.item.meta?.title">
        <template #prepend>
          <v-icon :icon="parentProps.item.meta?.elIcon" />
        </template>
      </v-list-item>
    </template>
    <template v-if="parentProps.item.children">
      <SidebarItem
        v-for="child in showingChildren"
        :key="child.path"
        :item="child"
        :base-path="resolvePath(child.path)"
      />
    </template>
  </v-list-group>

  <!-- <el-sub-menu v-else :index="resolvePath(parentProps.item.path)" teleported>
    <template #title>
      <SvgIcon v-if="parentProps.item.meta?.svgIcon" :name="parentProps.item.meta.svgIcon" />
      <component v-else-if="parentProps.item.meta?.elIcon" :is="parentProps.item.meta.elIcon" class="el-icon" />
      <span v-if="parentProps.item.meta?.title">{{ parentProps.item.meta.title }}</span>
    </template>
    <template v-if="parentProps.item.children">
      <SidebarItem
        v-for="child in showingChildren"
        :key="child.path"
        :item="child"
        :base-path="resolvePath(child.path)"
      />
    </template>
  </el-sub-menu> -->
</template>

<style lang="scss" scoped>
.svg-icon {
  min-width: 1em;
  margin-right: 12px;
  font-size: 18px;
}

.el-icon {
  width: 1em !important;
  margin-right: 12px !important;
  font-size: 18px;
}
</style>
