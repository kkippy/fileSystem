<template>
  <el-dialog :width="width" v-model="visible">
    <template #header>
      <div style="display: flex; align-items: center;justify-content: space-between">
        <div>
          <span>{{ title }}</span>
          <el-input
            :suffix-icon="Search"
            style="margin-left: 10px; width: 60%;"
            :placeholder="placeholder"
            v-model="searchQuery"
          />
        </div>
        <span>已选择{{selectLength}}条</span>
      </div>
    </template>

    <el-table :data="props.data" height="40vh" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column align="center" v-for="(column) in columns" :key="column.prop" :label="column.label" :prop="column.prop" />
    </el-table>

    <el-pagination
      style="margin-top: 20px;"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :size="size"
      :page-sizes="[20, 50, 100]"
      :background="true"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <template #footer>
      <div style="flex: auto">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="commitSelection">提交</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref,watch } from 'vue';
import type { ComponentSize } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import _ from 'lodash';
interface Column {
  label: string;
  prop: string;
}
const props = defineProps({
  title: String,
  width: {
    type: String,
    default: '40%'
  },
  modelValue:{
    type:Boolean,
    default:false
  },
  data: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Array as () => Column[],
    default: () => []
  },
  total: {
    type: Number,
    default: 0
  },
  currentPage:{
    type: Number,
    default: 1
  },
  pageSize:{
    type: Number,
    default: 10
  },
  placeholder: String,
  searchQuery:{
    type: String,
    default: ''
  }
});

let size = ref<ComponentSize>('small')
let currentPage = ref<number>(props.currentPage)
let pageSize = ref<number>(props.pageSize)
let visible = ref<boolean>(false)
let selectLength = ref<number>(0)
const columns = ref(props.columns)
const total = ref<number>(props.total)
const searchQuery = ref<string>(props.searchQuery)
const debouncedSearchQuery = ref('');
const emit = defineEmits(['update:modelValue','onCommit','selectChange',
  'sizeChange','currentChange','onClose','searchChange']);

watch(()=> [props.modelValue,props.pageSize,props.total],()=>{
  visible.value = props.modelValue;
  pageSize.value = props.pageSize;
  total.value = props.total;
})

watch(()=>[visible.value,pageSize.value],([newVal, newPageSize])=>{
  emit('update:modelValue', newVal);
  emit('sizeChange', newPageSize);
})
const updateSearchQuery = _.debounce((query:string) => {
  debouncedSearchQuery.value = query;
  emit('searchChange', query);
}, 300);

watch(searchQuery, (newValue) => {
  updateSearchQuery(newValue);
});

const closeDialog = () => {
  emit('update:modelValue', false);
};

const commitSelection = () => {
  emit('onCommit',false)
  emit('selectChange', [])
};

const handleSizeChange = (size:number) => {
  emit('sizeChange', size)
};

const handleCurrentChange = (page:number) => {
  emit('currentChange', page)
};

const handleSelectionChange = (selection:any) => {
  selectLength.value = selection.length
  emit('selectChange', selection)
};
</script>

