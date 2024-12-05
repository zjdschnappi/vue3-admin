<script lang="ts" setup>
import { type ListItem } from "./data"

interface Props {
  list: ListItem[]
}

const props = defineProps<Props>()
</script>

<template>
  <v-empty v-if="props.list.length === 0" />
  <v-card v-else>
    <v-list style="padding: 15px">
      <v-list-item v-for="(item, index) in props.list" :key="index" class="card-container" color="primary" rounded="xl">
        <template #title>
          <div class="card-header">
            <div>
              <span>
                <span class="card-title">{{ item.title }}</span>
                <v-tag v-if="item.extra" :type="item.status" effect="plain" size="small">{{ item.extra }}</v-tag>
              </span>
              <div class="card-time">{{ item.datetime }}</div>
            </div>
            <div v-if="item.avatar" class="card-avatar">
              <img :src="item.avatar" width="34" />
            </div>
          </div>
        </template>
        <v-divider />
        <div class="card-body">
          {{ item.description ?? "No Data" }}
        </div>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<style lang="scss" scoped>
.card-container {
  border: 1px solid #e4e7ed;
  margin-bottom: 10px;
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 5px;
    .card-title {
      font-weight: bold;
      font-size: 14px;
      margin-right: 10px;
    }
    .card-time {
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
    .card-avatar {
      display: flex;
      align-items: center;
    }
  }
  .card-body {
    font-size: 12px;
    padding: 15px 0;
    line-height: 1.5;
  }
}
</style>
