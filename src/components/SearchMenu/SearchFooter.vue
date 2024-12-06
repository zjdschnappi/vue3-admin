<script lang="ts" setup>
import { useDevice } from "@/hooks/useDevice"

interface Props {
  total: number
}

const props = defineProps<Props>()

const { isMobile } = useDevice()
</script>

<template>
  <div class="search-footer">
    <template v-if="!isMobile">
      <span class="search-footer-item">
        <v-icon icon="mdi-keyboard-return" />
        <span>确认</span>
      </span>
      <span class="search-footer-item">
        <v-icon icon="mdi-chevron-up" />
        <v-icon icon="mdi-chevron-down" />
        <span>切换</span>
      </span>
      <span class="search-footer-item">
        <v-icon icon="mdi-keyboard-esc" />
        <span>关闭</span>
      </span>
    </template>
    <span class="search-footer-total">共 {{ props.total }} 项</span>
  </div>
</template>

<style lang="scss" scoped>
.search-footer {
  display: flex;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  padding: 10px 10px;
  &-item {
    display: flex;
    align-items: center;
    margin-right: 12px;
    .svg-icon {
      margin-right: 5px;
      padding: 2px;
      font-size: 20px;
      background-color: var(--el-fill-color);
    }
  }
  &-total {
    margin: 0 0 0 auto;
  }
}
</style>
