<template>
  <el-dialog :width="width" v-model="visible">
    <template #header>
      <div style="display: flex; align-items: center">
        <span>{{ title }}</span>
        <el-input
          :suffix-icon="Search"
          style="margin-left: 10px; width: 40%;"
          :placeholder="placeholder"
          v-model="searchQuery"
        />
      </div>
    </template>

    <el-table :data="filteredData" height="40vh" @selection-change="handleSelectionChange">
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
import { ref, computed,watch } from 'vue';
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
  data: Array,
  columns: {
    type: Array as () => Column[],
    default: () => []
  },
  total: Number,
  placeholder: String,
});


let size = ref<ComponentSize>('small')
let currentPage = ref<number>(1)
let pageSize = ref<number>(10)
let visible = ref<boolean>(false)
const columns = ref(props.columns)
const total = ref(props.total)
const data = ref<Array<any>>(props.data || [])
const searchQuery = ref('')
const debouncedSearchQuery = ref('');
const emit = defineEmits(['update:modelValue','onCommit','selectChange',
  'sizeChange','currentChange','onClose']);

watch(()=> props.modelValue,()=>{
  visible.value = props.modelValue;
})

watch(()=>visible.value,(newVal)=>{
  emit('update:modelValue', newVal);
})
const updateSearchQuery = _.debounce((query:string) => {
  debouncedSearchQuery.value = query;
}, 300);

watch(searchQuery, (newValue) => {
  updateSearchQuery(newValue);
});

const filteredData = computed(() => {
  if (!debouncedSearchQuery.value) return props.data;
  const query = debouncedSearchQuery.value.trim().toLowerCase();
  return data.value.filter(item => {
    return Object.values(item.name).some(value =>
     String(value).toLowerCase().includes(query)
    );
  });
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
  emit('selectChange', selection)
};
</script>

