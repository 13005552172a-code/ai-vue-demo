<template>
  <el-form  
  :model="fromData"
  ref="fromDatarule"
  >
  <el-row :gutter="24">
    <template v-for="item in fromItemAttes" :key="item.prop">
      <el-col :="item.col">
        <el-form-item :label="item.label" :prop="item.prop">
        <component v-model="fromData[item.prop]" :is="IsComp(item.comp)" :placeholder="item.placeholder">
          <!-- 为select组件添加选项 -->
        <template v-if="item.comp==='select'">
          <el-option label="全部" value=""/>
          <el-option v-for="opt in item.Option" :key="opt.value" :label="opt.label" :value="opt.value"/>
        </template>
        </component>
      </el-form-item>
      </el-col>
      
    </template>
  </el-row>
    <el-row>
      <el-button @click="handleSearch" type="primary">查询</el-button>
      <el-button @click="resetForm(fromDatarule)">重置</el-button>
    </el-row>
    
  </el-form>
</template>

<script setup>
import {ref,reactive,computed} from 'vue'

// 接收props
const props=defineProps({
  fromItem:{
    type:Array,
    default:()=>[]
  }
})
// 枚举获取(假如comp为select，那么就会自动变为el-select)
const IsComp=(comp)=>{
  return {
    input:'el-input',
    select:'el-select'
  }[comp]
}

// 设置不同屏幕宽度对应的大小
const fromItemAttes=computed(()=>{
  const {fromItem}=props
  fromItem.forEach(item=>{
    // 对应的屏幕占比
    item.col={xs:24,sm:12,md:8,lg:6,xl:6}
  })
  return fromItem
})


// 表单数据
const fromData=reactive({})
// 子传父
const emit=defineEmits([`search`])
const handleSearch=()=>{
  emit(`search`,fromData)
}
const fromDatarule=ref()
// 重置表单
const resetForm=(formEl)=>{
  if(!formEl) return 
  formEl.resetFields()
  emit(`search`,fromData)
}
</script>

<style lang="scss" scoped>
  
</style>