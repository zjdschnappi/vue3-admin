import MessageBox from "./messageBox"

import type { App, Plugin } from "vue"

type SFCWithInstall<T> = T & Plugin
const _MessageBox = MessageBox as SFCWithInstall<typeof MessageBox>

_MessageBox.install = (app: App) => {
  _MessageBox._context = app._context
  app.config.globalProperties.$IMessageBox = _MessageBox
}
export default _MessageBox
export const IMessageBox = _MessageBox
