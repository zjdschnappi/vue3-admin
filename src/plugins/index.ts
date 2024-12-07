import { type App } from "vue"
import { loadVuetify } from "./vuetify"
import { loadIstockPlugin } from "./istock-plugin"
// import { loadElementPlus } from "./element-plus"

export function loadPlugins(app: App) {
  // loadElementPlus(app)
  loadVuetify(app)
  loadIstockPlugin(app)
}
