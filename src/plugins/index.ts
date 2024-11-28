import { type App } from "vue"
import { loadElementPlus } from "./element-plus"
import { loadVuetify } from "./vuetify"
import { loadElementPlusIcon } from "./element-plus-icon"
import { loadVxeTable } from "./vxe-table"

export function loadPlugins(app: App) {
  loadElementPlus(app)
  loadElementPlusIcon(app)
  loadVxeTable(app)
  loadVuetify(app)
}
