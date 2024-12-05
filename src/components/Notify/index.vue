<script lang="ts" setup>
import { ref, computed } from "vue"
// import { ElMessage } from "element-plus"
// import { Bell } from "@element-plus/icons-vue"
import NotifyList from "./NotifyList.vue"
import { type ListItem, notifyData, messageData, todoData } from "./data"

type TabName = "通知" | "消息" | "待办"

interface DataItem {
  name: TabName
  type: "primary" | "success" | "warning" | "danger" | "info"
  list: ListItem[]
}

/** 角标当前值 */
const badgeValue = computed(() => {
  return data.value.reduce((sum, item) => sum + item.list.length, 0)
})
/** 角标最大值 */
const badgeMax = 99
/** 面板宽度 */
const popoverWidth = 350
/** 当前 Tab */
const activeName = ref<TabName>("通知")
const menu = ref(false)
/** 所有数据 */
const data = ref<DataItem[]>([
  // 通知数据
  {
    name: "通知",
    type: "primary",
    list: notifyData
  },
  // 消息数据
  {
    name: "消息",
    type: "danger",
    list: messageData
  },
  // 待办数据
  {
    name: "待办",
    type: "warning",
    list: todoData
  }
])

const handleHistory = () => {
  // ElMessagesuccess(`跳转到${activeName.value}历史页面`)
  window.alert(`跳转到${activeName.value}历史页面`)
}
</script>

<template>
  <div class="notify">
    <v-menu v-model="menu" :close-on-content-click="false" location="end" :width="popoverWidth">
      <template #activator="{ props }">
        <v-badge v-bind="props" color="error" :content="badgeValue" :max="badgeMax" :hidden="badgeValue === 0">
          <v-tooltip text="消息通知">
            <template #activator="{ props }">
              <v-icon v-bind="props" :size="20" icon="mdi-bell" />
            </template>
          </v-tooltip>
        </v-badge>
      </template>
      <template #default>
        <v-card>
          <v-tabs v-model="activeName" class="demo-tabs" color="primary" grow>
            <v-tab v-for="(item, index) in data" :text="item.name" :value="item.name" :key="index">
              <template #append>
                <v-badge :content="item.list.length" :max="badgeMax" />
              </template>
            </v-tab>
          </v-tabs>
          <v-tabs-window v-model="activeName">
            <v-tabs-window-item v-for="(item, index) in data" :text="item.name" :value="item.name" :key="index">
              <NotifyList :list="item.list" />
            </v-tabs-window-item>
          </v-tabs-window>
          <div class="notify-history">
            <v-btn variant="text" color="primary" @click="handleHistory">查看{{ activeName }}历史</v-btn>
          </div>
        </v-card>
      </template>
    </v-menu>
  </div>
</template>

<style lang="scss" scoped>
.notify {
  margin-right: 10px;
}

.notify-history {
  text-align: center;
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color);
}
</style>
