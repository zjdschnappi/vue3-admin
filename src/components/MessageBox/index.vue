<template>
  <v-overlay :theme="activeThemeName" v-model="visible" :content-class="['i-overlay is-message-box', modalClass]">
    <div role="dialog" :aria-label="title" aria-modal="true" :class="`i-overlay-message-box`">
      <!-- @click="overlayEvent.onClick"
        @mousedown="overlayEvent.onMousedown"
        @mouseup="overlayEvent.onMouseup" -->
      <div ref="rootRef" :class="['i-message-box', customClass]" :style="customStyle" tabindex="-1" @click.stop="">
        <div
          v-if="title !== null && title !== undefined"
          ref="headerRef"
          :class="['i-message-box__header', { 'show-close': showClose }]"
        >
          <div class="i-message-box__title">
            <!-- <v-icon v-if="iconComponent && center" :class="[typeClass]">
                <component :is="iconComponent" />
              </v-icon> -->
            <span>{{ title }}</span>
          </div>
          <button
            v-if="showClose"
            type="button"
            class="i-message-box__headerbtn"
            aria-label=""
            @click="handleAction(distinguishCancelAndClose ? 'close' : 'cancel')"
            @keydown.prevent.enter="handleAction(distinguishCancelAndClose ? 'close' : 'cancel')"
          >
            <v-icon icon="mdi-close" class="i-message-box__close" />
          </button>
        </div>
        <div :id="contentId" class="i-message-box__content">
          <div class="i-message-box__container">
            <v-icon v-if="hasMessage" :class="[typeClass]" :icon="typeIconMap[boxType]" />
            <div v-if="hasMessage" class="i-message-box__message">
              <slot>
                <p v-if="!dangerouslyUseHTMLString">
                  {{ !dangerouslyUseHTMLString ? innerMessage : "" }}
                </p>
              </slot>
            </div>
          </div>
        </div>
        <div class="i-message-box__btns">
          <v-btn
            v-if="showCancelButton"
            density="comfortable"
            :loading="cancelButtonLoading"
            :disabled="confirmButtonLoading"
            :class="[cancelButtonClass]"
            :round="roundButton"
            style="margin-right: 10px"
            @click="handleAction('cancel')"
            @keydown.prevent.enter="handleAction('cancel')"
          >
            {{ cancelButtonText || "取消" }}
          </v-btn>
          <v-btn
            v-show="showConfirmButton"
            ref="confirmRef"
            color="primary"
            density="comfortable"
            :loading="confirmButtonLoading"
            :class="[confirmButtonClasses]"
            :disabled="confirmButtonDisabled"
            @click="handleAction('confirm')"
            @keydown.prevent.enter="handleAction('confirm')"
          >
            {{ confirmButtonText || "确认" }}
          </v-btn>
        </div>
      </div>
    </div>
  </v-overlay>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  // markRaw,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  toRefs,
  watch,
  watchEffect
} from "vue"

// eslint-disable-next-line vue/prefer-import-from-vue
import type { ComponentPublicInstance, PropType } from "vue"

import type { Action, MessageBoxState, MessageBoxType } from "./message-box.type.ts"
import { useZIndex } from "@/hooks/useZindex"
import { VBtn, VIcon, VOverlay } from "vuetify/components"
import { useId } from "@/hooks/useId"
import { useTheme } from "@/hooks/useTheme.ts"
const typeIconMap = {
  alert: "mdi-alert-circle",
  confirm: "mdi-information"
}
export default defineComponent({
  name: "IMessageBox",
  directives: {},
  components: {
    VBtn,
    VOverlay,
    VIcon
  },
  inheritAttrs: false,
  props: {
    modal: {
      type: Boolean,
      default: true
    },
    showClose: {
      type: Boolean,
      default: false
    },
    closeOnClickModal: {
      type: Boolean,
      default: true
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true
    },
    closeOnHashChange: {
      type: Boolean,
      default: true
    },
    center: Boolean,
    draggable: Boolean,
    overflow: Boolean,
    roundButton: {
      default: false,
      type: Boolean
    },
    container: {
      type: String, // default append to body
      default: "body"
    },
    message: {
      type: String, //
      default: ""
    },
    title: {
      type: String, //
      default: "提示"
    },
    boxType: {
      type: String as PropType<MessageBoxType>,
      default: ""
    }
  },
  emits: ["vanish", "action"],
  setup(props, { emit }) {
    const { nextZIndex } = useZIndex()
    const { activeThemeName } = useTheme()
    const visible = ref(true)
    // s represents state
    const state = reactive<MessageBoxState>({
      // autofocus element when open message-box
      autofocus: true,
      beforeClose: null,
      callback: null,
      cancelButtonText: "",
      cancelButtonClass: "",
      confirmButtonText: "",
      confirmButtonClass: "",
      customClass: "",
      customStyle: {},
      dangerouslyUseHTMLString: false,
      distinguishCancelAndClose: false,
      icon: "",
      innerMessage: "",
      modalFade: true,
      modalClass: "",
      showCancelButton: false,
      showConfirmButton: true,
      type: "",

      action: "" as Action,
      confirmButtonLoading: false,
      cancelButtonLoading: false,
      // confirmButtonLoadingIcon: markRaw(Loading),
      // cancelButtonLoadingIcon: markRaw(Loading),
      confirmButtonDisabled: false,
      // refer to: https://github.com/ElemeFE/element/commit/2999279ae34ef10c373ca795c87b020ed6753eed
      // seemed ok for now without this state.
      // isOnComposition: false, // temporary remove
      validateError: false,
      zIndex: nextZIndex()
    })

    const typeClass = computed(() => {
      // const type = state.type
      return {}
    })
    watchEffect(() => {
      state.innerMessage = props.message
    })
    const contentId = useId()
    const inputId = useId()

    const hasMessage = computed(() => !!state.innerMessage)
    const rootRef = ref<HTMLElement>()
    const headerRef = ref<HTMLElement>()
    const focusStartRef = ref<HTMLElement>()
    const inputRef = ref<ComponentPublicInstance>()
    const confirmRef = ref<ComponentPublicInstance>()

    const confirmButtonClasses = computed(() => state.confirmButtonClass)

    // watch(
    //   () => state.inputValue,
    //   async (val) => {
    //     await nextTick()
    //     if (props.boxType === "prompt" && val !== null) {
    //       validate()
    //     }
    //   },
    //   { immediate: true }
    // )

    watch(
      () => visible.value,
      (val) => {
        if (val) {
          state.zIndex = nextZIndex()
        }
      }
    )

    // const draggable = computed(() => props.draggable)
    // const overflow = computed(() => props.overflow)
    // useDraggable(rootRef, headerRef, draggable, overflow)

    onMounted(async () => {
      await nextTick()
      if (props.closeOnHashChange) {
        window.addEventListener("hashchange", doClose)
      }
    })

    onBeforeUnmount(() => {
      if (props.closeOnHashChange) {
        window.removeEventListener("hashchange", doClose)
      }
    })

    function doClose() {
      if (!visible.value) return
      visible.value = false
      nextTick(() => {
        if (state.action) emit("action", state.action)
      })
    }

    const handleWrapperClick = () => {
      if (props.closeOnClickModal) {
        handleAction(state.distinguishCancelAndClose ? "close" : "cancel")
      }
    }

    // const overlayEvent = useSameTarget(handleWrapperClick)

    const handleAction = (action: Action) => {
      state.action = action

      if (state.beforeClose) {
        state.beforeClose?.(action, state, doClose)
      } else {
        doClose()
      }
    }

    const handleClose = () => {
      handleAction("close")
    }

    // when close on press escape is disabled, pressing esc should not callout
    // any other message box and close any other dialog-ish elements
    // e.g. Dialog has a close on press esc feature, and when it closes, it calls
    // props.beforeClose method to make a intermediate state by callout a message box
    // for some verification or alerting. then if we allow global event liek this
    // to dispatch, it could callout another message box.
    const onCloseRequested = () => {
      if (props.closeOnPressEscape) {
        handleClose()
      }
    }

    return {
      ...toRefs(state),

      activeThemeName,
      visible,
      hasMessage,
      typeClass,
      contentId,
      inputId,
      confirmButtonClasses,
      rootRef,
      focusStartRef,
      headerRef,
      inputRef,
      confirmRef,
      doClose, // for outside usage
      handleClose, // for out side usage
      onCloseRequested,
      handleWrapperClick,
      handleAction,
      typeIconMap
    }
  }
})
</script>
