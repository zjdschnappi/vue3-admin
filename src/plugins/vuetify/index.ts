import "@mdi/font/css/materialdesignicons.css"
import "vuetify/styles"
import * as components from "vuetify/components"
import * as directives from "vuetify/directives"
import { createVuetify } from "vuetify"
// import message from "@/components/Message/method"

export function loadVuetify(app) {
  const vuetify = createVuetify({
    // ... your configuration
    components,
    directives
  })

  app.use(vuetify)
  // app.config.globalProperties.$message = message
}
