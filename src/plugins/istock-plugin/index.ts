import { type App } from "vue"
import IMessage from "@/components/Message"
import IMessageBox from "@/components/MessageBox"

export function loadIstockPlugin(app: App) {
  /** Element Plus 组件完整引入 */
  app.use(IMessage).use(IMessageBox)
}
