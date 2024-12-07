<script lang="ts" setup>
import { getCurrentInstance, reactive, ref } from "vue"
import { createTableDataApi, deleteTableDataApi, updateTableDataApi, getTableDataApi } from "@/api/table"
import { type CreateOrUpdateTableRequestData, type TableData } from "@/api/table/types/table"

import { usePagination } from "@/hooks/usePagination"
import { cloneDeep } from "lodash-es"
import { VForm } from "vuetify/components/VForm"

const loading = ref<boolean>(false)
const { paginationData } = usePagination()

//#region 增
const DEFAULT_FORM_DATA: CreateOrUpdateTableRequestData = {
  id: undefined,
  username: "",
  password: ""
}
const dialogVisible = ref<boolean>(false)
const formRef = ref<any>(null)
const formData = ref<CreateOrUpdateTableRequestData>(cloneDeep(DEFAULT_FORM_DATA))
const formRules = {
  username: [(value) => !!value || "请输入用户名"],
  password: [(value) => !!value || "请输入密码"]
}
const instance = getCurrentInstance()
const handleCreateOrUpdate = async () => {
  if (!formRef.value) return
  const { valid, errors } = await formRef.value.validate()
  if (!valid) return console.error("表单校验不通过", errors)
  loading.value = true
  const api = formData.value.id === undefined ? createTableDataApi : updateTableDataApi
  api(formData.value)
    .then(() => {
      // ElMessage.success("操作成功")
      dialogVisible.value = false
      getTableData()
    })
    .finally(() => {
      loading.value = false
    })
}
const resetForm = () => {
  formRef.value?.clearValidate()
  formData.value = cloneDeep(DEFAULT_FORM_DATA)
}
//#endregion

//#region 删
const handleDelete = (row: TableData) => {
  instance?.proxy?.$IMessageBox?.confirm("确认删除？", "提示", {
    beforeClose: (action, vm, done) => {
      if (action === "confirm") {
        vm.confirmButtonLoading = true
        deleteTableDataApi(row.id).then(() => {
          done()
          instance?.proxy?.$IMessage?.success({ message: "删除成功" })
          vm.confirmButtonLoading = false
          getTableData()
        })
      } else {
        done()
      }
    }
  })
}
//#endregion

//#region 改
const handleUpdate = (row: TableData) => {
  dialogVisible.value = true
  formData.value = cloneDeep(row)
}
//#endregion

//#region 查
const tableData = ref<TableData[]>([])
const tableColumns = ref<any[]>([
  { title: "用户名", key: "username", value: "username" },
  { title: "角色", key: "roles", value: "roles" },
  { title: "手机号", key: "phone", value: "phone" },
  { title: "邮箱", key: "email", value: "email" },
  { title: "状态", key: "status", value: "status" },
  { title: "创建时间", key: "createTime", value: "createTime" },
  { title: "操作", key: "operate", value: "operate" }
])
const searchFormRef = ref<VForm | null>(null)
const searchData = reactive({
  username: "",
  phone: ""
})
const loadItems = ({ page, itemsPerPage }) => {
  getTableData({ page, itemsPerPage })
}
const getTableData = (props?) => {
  loading.value = true
  getTableDataApi({
    currentPage: props?.page ?? paginationData.currentPage,
    size: props?.itemsPerPage ?? paginationData.pageSize,
    username: searchData.username || undefined,
    phone: searchData.phone || undefined
  })
    .then(({ data }) => {
      paginationData.total = data.total
      paginationData.pages = Math.ceil(data.total / paginationData.pageSize)
      tableData.value = data.list
    })
    .catch(() => {
      tableData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
const handleSearch = () => {
  paginationData.currentPage === 1 ? getTableData() : (paginationData.currentPage = 1)
}
const resetSearch = () => {
  searchFormRef.value?.reset?.()
  handleSearch()
}

//#endregion
</script>

<template>
  <div class="app-container">
    <v-container v-loading="loading" shadow="never" class="search-wrapper">
      <v-form ref="searchFormRef" :model="searchData">
        <v-row>
          <v-col cols="4">
            <v-text-field
              color="primary"
              density="compact"
              variant="outlined"
              label="用户名"
              v-model="searchData.username"
              placeholder="请输入"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              color="primary"
              density="compact"
              variant="outlined"
              label="手机号"
              v-model="searchData.phone"
              placeholder="请输入"
            />
          </v-col>
          <v-col cols="4">
            <v-btn color="primary" @click="handleSearch" style="margin-right: 10px">查询</v-btn>
            <v-btn @click="resetSearch">重置</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
    <v-divider />
    <v-container v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <v-btn color="primary" @click="dialogVisible = true" style="margin-right: 10px">新增用户</v-btn>
          <v-btn color="danger">批量删除</v-btn>
        </div>
        <div>
          <v-tooltip text="下载">
            <template v-slot:activator="{ props }">
              <v-btn size="x-small" v-bind="props" icon="mdi-download" style="margin-right: 10px" />
            </template>
          </v-tooltip>
          <v-tooltip text="刷新当前页">
            <template v-slot:activator="{ props }">
              <v-btn size="x-small" v-bind="props" icon="mdi-refresh" @click="getTableData" />
            </template>
          </v-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <v-data-table-server
          show-select
          :items="tableData"
          :items-length="paginationData.total"
          :loading="loading"
          :headers="tableColumns"
          v-model:items-per-page="paginationData.pageSize"
          @update:options="loadItems"
        >
          <template v-slot:item.roles="{ item }">
            <span v-if="item.roles === 'admin'">admin</span>
            <span v-else>{{ item.roles }}</span>
          </template>
          <template v-slot:item.status="{ item }">
            <span v-if="item.status">启用</span>
            <span v-else>禁用</span>
          </template>
          <template v-slot:item.operate="{ item }">
            <v-btn color="primary" size="small" @click="handleUpdate(item)" style="margin-right: 10px">修改</v-btn>
            <v-btn color="danger" size="small" @click="handleDelete(item)">删除</v-btn>
          </template>
        </v-data-table-server>
      </div>
    </v-container>
    <!-- 新增/修改 -->
    <v-dialog
      v-model="dialogVisible"
      :title="formData.id === undefined ? '新增用户' : '修改用户'"
      @closed="resetForm"
      width="500"
    >
      <template v-slot:default>
        <v-card title="修改用户" density="compact">
          <v-form ref="formRef" :model="formData">
            <v-card-text style="padding: 10px 20px">
              <v-text-field
                density="compact"
                variant="outlined"
                :rules="formRules.username"
                v-model="formData.username"
                label="用户名"
                placeholder="请输入"
              />
              <v-text-field
                density="compact"
                variant="outlined"
                v-model="formData.password"
                :rules="formRules.password"
                label="密码"
                placeholder="请输入"
              />
            </v-card-text>
          </v-form>

          <v-container>
            <div style="padding: 0px 15px; text-align: right">
              <v-btn @click="dialogVisible = false" style="margin-right: 10px">取消</v-btn>
              <v-btn color="primary" @click="handleCreateOrUpdate" :loading="loading">确认</v-btn>
            </div>
          </v-container>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
