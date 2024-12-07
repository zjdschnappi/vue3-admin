<script lang="ts" setup>
import { useLayoutMode } from "@/hooks/useLayoutMode"
import { LayoutModeEnum } from "@/constants/app-key"

const { isLeft, isLeftTop, setLayoutMode } = useLayoutMode()
</script>

<template>
  <div class="select-layout-mode">
    <v-row>
      <v-col>
        <v-tooltip text="左侧模式">
          <template v-slot:activator="{ props }">
            <v-container
              v-bind="props"
              class="layout-mode left"
              :class="{ active: isLeft }"
              @click="setLayoutMode(LayoutModeEnum.Left)"
            >
              <v-row no-gutters>
                <v-col cols="4">
                  <div class="preview-aside" />
                </v-col>
                <v-col cols="8">
                  <div class="preview-header" />
                  <div class="preview-main" />
                </v-col>
              </v-row>
            </v-container>
          </template>
        </v-tooltip>
      </v-col>
      <v-col>
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
                <v-col cols="4">
                  <div class="preview-aside" />
                </v-col>
                <v-col cols="8">
                  <div class="preview-main" />
                </v-col>
              </v-row>
            </v-container>
          </template>
        </v-tooltip>
      </v-col>
    </v-row>

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
  </div>
</template>

<style lang="scss" scoped>
.select-layout-mode {
  display: flex;
  justify-content: space-around;
}

.layout-mode {
  flex-grow: 0;
  overflow: hidden;
  cursor: pointer;
  border-radius: 6px;
  border: 2px solid transparent;
  &:hover {
    border: 2px solid var(--i-color-primary);
  }
}

.active {
  border: 2px solid var(--i-color-primary);
}

.preview-header {
  height: 8px;
}
.preview-main {
  height: 52px;
}

.preview-aside {
  width: 50%;
  height: 100%;
}

.left {
  .preview-header {
    background-color: var(--i-fill-color-darker);
  }
  .preview-aside {
    background-color: var(--i-color-primary);
  }
  .preview-main {
    background-color: var(--i-fill-color-lighter);
  }
}

.top {
  .preview-header {
    background-color: var(--i-color-primary);
  }
  .preview-main {
    background-color: var(--i-fill-color-lighter);
  }
}

.left-top {
  .preview-header {
    background-color: var(--i-fill-color-darker);
  }
  .preview-aside {
    background-color: var(--i-color-primary);
  }
  .preview-main {
    background-color: var(--i-fill-color-lighter);
  }
}
</style>
