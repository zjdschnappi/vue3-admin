import { App, Plugin } from "vue"
import Message from "./method"

type SFCWithInstall<T> = T & Plugin
const _Message = Message as SFCWithInstall<typeof Message>

_Message.install = (app: App) => {
  _Message._context = app._context
  app.config.globalProperties.$IMessage = _Message
}
export default _Message
export const IMessage = _Message
