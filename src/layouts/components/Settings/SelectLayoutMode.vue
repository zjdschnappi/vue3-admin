<script lang="ts" setup>
import { useLayoutMode } from "@/hooks/useLayoutMode"
import { LayoutModeEnum } from "@/constants/app-key"

const { isLeft, isLeftTop, setLayoutMode } = useLayoutMode()
</script>

<template>
  <div class="select-layout-mode">
    <v-tooltip text="左侧模式">
      <template v-slot:activator="{ props }">
        <v-container
          v-bind="props"
          class="layout-mode left"
          :class="{ active: isLeft }"
          @click="setLayoutMode(LayoutModeEnum.Left)"
        >
          <v-row no-gutters>
            <v-col cols="6">
              <div class="preview-aside" />
            </v-col>
            <v-col cols="6">
              <div class="preview-header" />
              <div class="preview-main" />
            </v-col>
          </v-row>
        </v-container>
      </template>
    </v-tooltip>
    <!-- <v-tooltip text="顶部模式">
      <template v-slot:activator="{ props }">
        <v-container
          v-bind="props"
          class="layout-mode top"
          :class="{ active: isTop }"
          @click="setLayoutMode(LayoutModeEnum.Top)"
        >
          <div class="preview-header" />
          <div class="preview-main" />
        </v-container>
      </template>
    </v-tooltip> -->
    <v-tooltip text="混合模式">
      <template v-slot:activator="{ props }">
        <v-container
          v-bind="props"
          class="layout-mode left-top"
          :class="{ active: isLeftTop }"
          @click="setLayoutMode(LayoutModeEnum.LeftTop)"
        >
          <v-row>
            <v-col>
              <div class="preview-header" />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="6">
              <div class="preview-aside" />
            </v-col>
            <v-col cols="6">
              <div class="preview-main" />
            </v-col>
          </v-row>
        </v-container>
      </template>
    </v-tooltip>
  </div>
</template>

<style lang="scss" scoped>
.select-layout-mode {
  display: flex;
  justify-content: space-between;
}

.layout-mode {
  flex-grow: 0;
  overflow: hidden;
  cursor: pointer;
  border-radius: 6px;
  border: 2px solid transparent;
  &:hover {
    border: 2px solid var(--el-color-primary);
  }
}

.active {
  border: 2px solid var(--el-color-primary);
}

.preview-header {
  height: 8px;
  width: 22px;
}
.preview-main {
  height: 52px;
  width: 22px;
}

.preview-aside {
  width: 12px;
  height: 100%;
}

.left {
  .preview-header {
    background-color: var(--el-fill-color-darker);
  }
  .preview-aside {
    background-color: var(--el-color-primary);
  }
  .preview-main {
    background-color: var(--el-fill-color-lighter);
  }
}

.top {
  .preview-header {
    width: 34px;
    background-color: var(--el-color-primary);
  }
  .preview-main {
    background-color: var(--el-fill-color-lighter);
  }
}

.left-top {
  .preview-header {
    width: 40px;
    background-color: var(--el-fill-color-darker);
  }
  .preview-aside {
    background-color: var(--el-color-primary);
  }
  .preview-main {
    background-color: var(--el-fill-color-lighter);
  }
}
</style>
