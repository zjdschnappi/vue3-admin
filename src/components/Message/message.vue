<template>
  <transition name="i-message-fade" @before-leave="onClose" @after-leave="$emit('destroy')">
    <div
      v-show="visible"
      :id="id"
      ref="messageRef"
      :class="['i-message', typeClass, customClass]"
      :style="customStyle"
      role="alert"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
    >
      <v-icon size="15" :icon="typeIconMap[props.type]" :class="['i-message-icon', `i-message-icon--${props.type}`]" />

      <slot>
        <p v-if="!dangerouslyUseHTMLString" class="i-message__content">
          {{ message }}
        </p>
        <!-- Caution here, message could've been compromised, never use user's input as message -->
        <p v-else class="" v-html="message" />
      </slot>
      <v-icon
        v-if="showClose"
        size="14"
        :class="['i-message-icon', `i-message-icon--${props.type}`]"
        @click.stop="close"
        icon="mdi-close"
      />
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue"
import { useEventListener, useResizeObserver, useTimeoutFn } from "@vueuse/core"
// import { VIcon } from "vuetify/components/VIcon"
// import { TypeComponents, TypeComponentsMap } from "@element-plus/utils"
// import { useGlobalComponentSettings } from "@element-plus/components/config-provider"
import { messageEmits, messageProps } from "./message"
import { getLastOffset, getOffsetOrSpace } from "./instance"
// import type { BadgeProps } from "@element-plus/components/badge"
import type { CSSProperties } from "vue"
import { useZIndex } from "@/hooks/useZindex"
import { EVENT_CODE } from "@/utils"

// const { Close } = TypeComponents
defineOptions({
  name: "IMessage"
})

const props = defineProps(messageProps)
defineEmits(messageEmits)

const { currentZIndex, nextZIndex } = useZIndex()

const messageRef = ref<HTMLDivElement>()
const visible = ref(false)
const height = ref(0)

let stopTimer: (() => void) | undefined = undefined

const typeClass = computed(() => {
  const type = props.type
  return `i-message--${type}`
})
const typeIconMap = {
  success: "mdi-check-circle",
  error: "mdi-close-circle",
  warning: "mdi-alert-circle",
  info: "mdi-information"
}

// const iconComponent = computed(() => props.icon || "")

const lastOffset = computed(() => getLastOffset(props.id))
const offset = computed(() => getOffsetOrSpace(props.id, props.offset) + lastOffset.value)
const bottom = computed((): number => height.value + offset.value)
const customStyle = computed<CSSProperties>(() => ({
  top: `${offset.value}px`,
  zIndex: currentZIndex.value
}))

function startTimer() {
  if (props.duration === 0) return
  ;({ stop: stopTimer } = useTimeoutFn(() => {
    close()
  }, props.duration))
}

function clearTimer() {
  stopTimer?.()
}

function close() {
  visible.value = false
}

function keydown({ code }: KeyboardEvent) {
  if (code === EVENT_CODE.esc) {
    // press esc to close the message
    close()
  }
}

onMounted(() => {
  startTimer()
  nextZIndex()
  visible.value = true
})

watch(
  () => props.repeatNum,
  () => {
    clearTimer()
    startTimer()
  }
)

useEventListener(document, "keydown", keydown)

useResizeObserver(messageRef, () => {
  height.value = messageRef.value!.getBoundingClientRect().height
})

defineExpose({
  visible,
  bottom,
  close
})
</script>
<style lang="scss"></style>
