<script lang="ts" setup>
import { ref } from "vue"

interface Props {
  buttonTop?: number
}

const props = withDefaults(defineProps<Props>(), {
  buttonTop: 350
})

const buttonTopCss = props.buttonTop + "px"
const show = ref(false)
</script>

<template>
  <div class="handle-button" @click="show = true">
    <v-icon :size="24" icon="mdi-wrench" />
  </div>
  <v-navigation-drawer class="drawer" v-model="show" location="right" temporary width="350">
    <slot />
  </v-navigation-drawer>
</template>

<style lang="scss" scoped>
@import "@/styles/mixins.scss";
.handle-button {
  width: 48px;
  height: 48px;
  background-color: var(--i-fill-color-lighter);
  position: fixed;
  top: v-bind(buttonTopCss);
  right: 0;
  border-radius: 6px 0 0 6px;
  z-index: 10;
  cursor: pointer;
  pointer-events: auto;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.drawer {
  :deep() {
    .v-navigation-drawer__content {
      @extend %scrollbar;
    }
  }
}
</style>
