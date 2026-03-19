<template>
  <div>
    <PageHead title="知识文章">
      <template  #buttons>
        <el-button type="primary">新增</el-button>
      </template>
    </PageHead>
    <TableSelect :fromItem="fromItem"  @search="handleSearch"></TableSelect>
  </div>
  
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import PageHead from '../../components/PageHead.vue';
import TableSelect from '../../components/TableSelect.vue';
const router= useRouter();
const fromItem=ref([
  {comp:'input',prop:'title',label:'文章标题',placeholder:'请输入文章标题'},
  {comp:'select',prop:'category',label:'分类',placeholder:'请选择分类',
  Option:[{label:'分类1',value:1},{label:'分类2',value:2}]},
])
const handleSearch=(FormData)=>{
  console.log(FormData,'查询参数');
  
}
</script>