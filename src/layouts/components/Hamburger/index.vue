<script lang="ts" setup>
interface Props {
  isActive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false
})

/** Vue 3.3+ defineEmits 语法 */
const emit = defineEmits<{
  toggleClick: []
}>()

const toggleClick = () => {
  emit("toggleClick")
}
</script>

<template>
  <div @click="toggleClick">
    <v-icon :size="20" class="icon" :icon="props.isActive ? 'mdi-arrow-expand-left' : 'mdi-arrow-expand-right'" />
  </div>
</template>

<style lang="scss" scoped>
.icon {
  vertical-align: middle;
  color: var(--v3-hamburger-text-color);
}
</style>
