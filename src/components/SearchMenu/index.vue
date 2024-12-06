<script lang="ts" setup>
import { ref } from "vue"
import SearchModal from "./SearchModal.vue"

/** 控制 modal 显隐 */
const modalVisible = ref<boolean>(false)
/** 打开 modal */
const handleOpen = () => {
  modalVisible.value = true
}
</script>

<template>
  <div>
    <v-tooltip text="搜索菜单">
      <template #activator="{ props }"> <v-icon v-bind="props" @click="handleOpen" icon="mdi-file-find" /></template>
    </v-tooltip>
    <SearchModal v-model="modalVisible" />
  </div>
</template>

<style lang="scss" scoped></style>
