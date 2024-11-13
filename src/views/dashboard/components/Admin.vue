<template>
  <div class="app-container center">
    <div ref="terminalDom" />
  </div>
</template>

<script lang="js">
import { defineComponent, onMounted, ref } from "vue"
import "@xterm/xterm/css/xterm.css"
import { Terminal } from "@xterm/xterm"

export default defineComponent({
  setup() {
    const terminalDom = ref(null)
    onMounted(() => {
      const term = new Terminal()
      term.open(terminalDom.value)
      setInterval(() => {
        term.write(" Hello from \x1B[1;3;31mxterm.js\x1B[0m $ \r\n")
      }, 500)
    })
    return {
      terminalDom
    }
  }
})
</script>

<style lang="scss" scoped>
.center {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
