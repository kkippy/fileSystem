<template>
  <div  class="link-container">
    <el-card body-class="cardStyle" style="border-radius: 10px">
      <search-header-component
        class="linkHeader"
        placeholderTitle="请输入链接名"
        @onSearch="onSearch"
        @reset="reset"
      >
        <template #searchBtn>
          <el-button type="success" style="margin-left: 0" :icon="Plus" @click="handleAddLink">上传链接</el-button>
        </template>
      </search-header-component>

      <el-table
        :data="linkListData"
        v-loading="loading"
        border
        height="65vh"
        style="width: 100%"
      >
        <el-table-column align="center" type="index" label="序号" width="80" />
        <el-table-column align="center" show-overflow-tooltip prop="linkName" label="链接名称" width="450"/>
        <el-table-column align="center" show-overflow-tooltip prop="status" width="100" label="链接状态" >
          <template #default={row}>
            <el-switch
              v-model="row.status"
              :active-value="0"
              :inactive-value="1"
              @change="handleChangeLinkStatus(row)"
              inline-prompt
              style="--el-switch-on-color: #13ce66;
              --el-switch-off-color: #ff4949"
              active-text="启用"
              inactive-text="禁用"
            />
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip prop="createTime" label="上传时间"  />
        <el-table-column align="center" show-overflow-tooltip prop="updateTime" label="更新时间"  />
        <el-table-column align="center" label="操作" width="340" >
          <template #default="{row}">
            <el-button type="primary" @click="handleCheckLink(row)" :icon="View">查看</el-button>
            <el-button type="warning" @click="handleEditLink(row)" :icon="Edit">编辑</el-button>
            <el-popconfirm
              :title="`确认删除${row.linkName}?`"
              width="200px"
              @confirm="handleDelLink(row.id)"
            >
              <template #reference>
                <el-button type="danger" :icon="Delete">
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        style="margin-top: 20px;"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :size="size"
        :page-sizes="[20,50,100]"
        :background="true"
        layout="prev,pager,next,jumper,->,sizes,total"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="getLinkList"
      />

    </el-card>

    <el-dialog v-model="linkDialogVisible" :title="linkForm.id ? '编辑链接' : '添加链接'" width="30%">
      <el-form label-width="80px">
        <el-form-item label="链接名称">
          <el-input v-model="linkForm.linkName" placeholder="请输入链接名称" />
        </el-form-item>
        <el-form-item label="链接地址">
          <el-input v-model="linkForm.linkAddress" placeholder="请输入链接地址"/>
        </el-form-item>
<!--        <el-form-item label="所属科室">-->
<!--          <el-input v-model="linkForm.department" placeholder="请输入链接地址"/>-->
<!--          <el-select-->
<!--            v-model="linkForm.department"-->
<!--            @change="handleSelectChange"-->
<!--            placeholder="请选择所属科室"-->
<!--          >-->
<!--            <el-option-->
<!--              v-for="item in options"-->
<!--              :key="item.value"-->
<!--              :label="item.label"-->
<!--              :value="item.value"-->
<!--            />-->
<!--          </el-select>-->
<!--        </el-form-item>-->

      </el-form>

        <template #footer>
          <span class="dialog-footer">
            <el-button @click="linkDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleConfirm">确 定</el-button>
          </span>
        </template>
    </el-dialog>


  </div>
</template>

<script setup lang="ts">
import SearchHeaderComponent from '@/components/SearchHeader/index.vue'
import type { ResponseData, linkResponseData, linkListItem,searchResponseData,linkFormFormat } from '@/api/link/type'
import { Delete, Plus,View,Edit } from '@element-plus/icons-vue'
import type {ComponentSize} from "element-plus";
import { ref, onMounted, reactive, watchEffect } from 'vue'
import { uploadLink,getLinks,checkLink,updateLink,deleteLink } from '@/api/link'
import { ElMessage } from 'element-plus'
import { type RouteLocationNormalizedLoaded, useRoute } from 'vue-router'

interface Route extends RouteLocationNormalizedLoaded{
  meta:  {
    department?: string;
  }
}

let size = ref<ComponentSize>('default')
let currentPage = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)
const loading = ref<boolean>(false)
const linkDialogVisible = ref<boolean>(false)
const route = useRoute() as Route
let department: string | undefined = route.meta.department ||  route.fullPath

watchEffect( ()=>{
  if(department !== route.meta.department){
    department = route.meta.department
    getLinkList()
  }
})

const options = [
  {
    value: 'section1',
    label: '信息化一室',
  },
  {
    value: 'section2',
    label: '信息化二室',
  },
  {
    value: 'basic',
    label: '基础架构室',
  },
  {
    value: 'support',
    label: '开发支持室',
  },
  {
    value: 'manage',
    label: '综合管理室',
  },
]

const linkForm = reactive<linkFormFormat>({
  linkName:'',
  linkAddress:'',
  department:''
})

const linkListData = ref<linkListItem>([])

onMounted(()=>{
  getLinkList()
})

const getLinkList = async (pager = 1)=>{
  currentPage.value = pager
  loading.value = true
  const result:linkResponseData = await getLinks(currentPage.value,pageSize.value,department as string)
  linkListData.value = result.data.items
  total.value = result.data.counts
  loading.value = false
}

const handleAddLink = ()=>{
    Object.assign(linkForm,{
      id:null,
      linkName:'',
      linkAddress:'',
      department:''
  })
  linkDialogVisible.value = true
}

// const handleSelectChange = (val:string) =>{
//   if(val === '信息化一室'){
//     linkForm.department = 'section1'
//   }else if(val === '信息化二室'){
//     linkForm.department = 'section2'
//   } else if(val === '基础架构室'){
//     linkForm.department = 'basic'
//   }else if(val === '开发支持室'){
//     linkForm.department = 'support'
//   } else {
//     linkForm.department = 'manage'
//   }
// }

const handleEditLink = async (row:any)=>{
  const result:searchResponseData = await checkLink(row.id)
  if(row.id){
    Object.assign(linkForm,row)
  }
  if(result.code !== 200) {
    ElMessage({
      message: result.msg,
      type: 'error'
    })
    return
  }
  linkForm.linkName = result.data.linkName
  linkForm.linkAddress = result.data.linkAddress as string
  linkDialogVisible.value = true
}

const handleConfirm = async ()=>{
  try{
    if(linkForm.id){
      const params = {
        id:linkForm.id,
        linkName:linkForm.linkName,
        linkAddress:linkForm.linkAddress
      }
      const result:any = await updateLink(linkForm.id,params)
      ElMessage({
        message: result.code === 200 ? '修改成功' : result.msg,
        type: result.code === 200 ? 'success' : 'error'
      })
    } else {
      const result:ResponseData = await uploadLink(linkForm.linkName,linkForm.linkAddress,department as string)
      ElMessage({
        message: result.msg,
        type:result.code === 200 ? 'success' : 'error'
      })
    }
  } catch(err){
    console.log(err)
  } finally {
    linkDialogVisible.value = false
    await getLinkList(linkForm.id ? currentPage.value : 1)
  }
}

const handleCheckLink = async (row:any)=>{
  const result:searchResponseData = await checkLink(row.id)
  if(result.code === 200){
    window.open(result.data.linkAddress)
  } else {
    ElMessage({
      message: result.msg,
      type: 'error'
    })
  }
}

const handleChangeLinkStatus = async (row:any)=>{
  await updateLink(row.id,{id:row.id,status:row.status})
  ElMessage({
    message: '状态修改成功',
    type: "success"
  })
  await getLinkList()
}

const handleDelLink = async (id:number)=>{
  const result:any = await deleteLink(id)
  ElMessage({
    message: result.code === 200 ? '删除成功' : result.msg,
    type: result.code === 200 ? 'success' : 'error'
  })
  await getLinkList()
}

const onSearch = async (searchValue:string) => {
  const result:linkResponseData = await getLinks( currentPage.value,
    pageSize.value,department as string,{linkName:searchValue} )
    linkListData.value = result.data.items
    total.value = result.data.counts
}

const reset = () => {
  getLinkList()
}

const handleSizeChange = () => {
  currentPage.value = 1
  getLinkList()
}
</script>

<style scoped lang="scss">
.link-container{
  :global(.cardStyle){
    border-radius: 10px;
    padding-top: 0;
  }
  .linkHeader{
    box-shadow: none;
  }
}
</style>
