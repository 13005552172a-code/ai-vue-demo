<template>
  <div>
    <PageHead title="知识文章">
      <template  #buttons>
        <el-button @click="handleEdit({})" type="primary">新增</el-button>
      </template>
    </PageHead>
    <TableSelect :fromItem="fromItem"  @search="handleSearch"></TableSelect>
    <el-table :data="tableData" style="width: 100%; margin-top: 25px;">
      <el-table-column  label="文章标题" fixed="left" width="200">
        <template  #default="scope">
          <div style="display: flex; align-items: center">
            <el-icon><timer /></el-icon>
             <span >{{ scope.row.title }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column  label="分类" width="200">
        <template  #default="scope">
          <div style="display: flex; align-items: center">
            <el-icon><timer /></el-icon>
             <span >{{ scope.row.categoryName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="作者"  prop="authorName" width="150"/>
      <el-table-column label="阅读量"  prop="readCount" width="150"/>
      <el-table-column label="发布时间"  prop="updatedAt" width="200"/>

      <el-table-column label="操作" width="200" fixed="right">
      <template #default="scope">
        <el-button size="small" text type="primary" @click="handleEdit(scope.row)">编辑</el-button>
        <el-button size="small" @click="handlePush(scope.row)" v-if="scope.row.status===0||scope.row.status===2" type="success" >发布</el-button>
        <el-button size="small"  @click="handleupPush(scope.row)" v-else="scope.row.status===1" type="warning" >下线</el-button>
         <el-button size="small"  type="danger" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </el-table-column>
    </el-table>
    <el-pagination
    style="margin-top: 25px;"
    :page-size="pagination.size"
    layout="prev, pager, next"
    :total="pagination.total"
     @current-change="handleChange" />
     <!-- 这个就是弹窗了 -->
     <ArticleDialog
      :categoryList="categoryList" :editFormData="editFormData" v-model:modelValue="dialogVisivle" @success="handlesuccess"/>
  </div>
  
</template>

<script setup>
import { ref,onMounted,reactive } from 'vue';
import PageHead from '../../components/PageHead.vue';
import TableSelect from '../../components/TableSelect.vue';
import ArticleDialog from '../../components/ArticleDialog.vue';
import {categoryTree,articlePage,knowledgeArticle,changeArticle,deleteArticle} from '../../api/admin'
import { ElMessageBox,ElMessage } from 'element-plus';
// 编辑
const editFormData=ref(null)
const handleEdit=(row)=>{
  if(!row.id) {
    editFormData.value=null
    dialogVisivle.value=true
  }else{
    knowledgeArticle(row.id).then(res=>{
    editFormData.value=res
    console.log(editFormData);
    dialogVisivle.value=true
  })
  }
  
  
}
// 发布
const handlePush=(row)=>{
  ElMessageBox.confirm(
    `确认${row.title}发布吗`,
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'info',
    }
  ).then(()=>{
    changeArticle(row.id,{status:1}).then(res=>{
      ElMessage.success('发布成功')
      handleSearch()
    })
  })
}
// 下线
const handleupPush=(row)=>{
  ElMessageBox.confirm(
    `确认${row.title}下线吗`,
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(()=>{
    changeArticle(row.id,{status:2}).then(res=>{
      ElMessage.success('下线成功')
      handleSearch()
    })
  })
}
// 删除
const handleDelete=(row)=>{
  ElMessageBox.confirm(
    `确认${row.title}删除吗`,
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(()=>{
    deleteArticle(row.id).then(res=>{
      ElMessage.success('删除成功')
      handleSearch()
    })
  })
}
// 分类列表
const categoryList=ref([])
onMounted(async()=>{
  const data=await categoryTree()
  categoryList.value=data.map(item=>{
    // 映射
    return {
      label:item.categoryName,
      value:item.id
    }
  })
  fromItem.value[1].Option=categoryList.value
  // console.log(categoryList.value);
  
  handleSearch()
})

const fromItem=ref([
  {comp:'input',prop:'title',label:'文章标题',placeholder:'请输入文章标题'},
  {comp:'select',prop:'categoryId',label:'分类',placeholder:'请选择分类'},
  {comp:'select',prop:'status',label:'状态',placeholder:'请选择状态',
  Option:[{label:'草稿',value:'0'},{label:'已发布',value:'1'},{label:'已下线',value:'2'}]},
])

// 分页参数
const pagination=reactive({
  currentPage:1,
  size:10,
  total:0
})

// 分页
const handleChange=(page)=>{
  pagination.currentPage=page
  handleSearch()
}
// 文章详情是否打开
const dialogVisivle=ref(false)
// 
const handlesuccess=()=>{
  dialogVisivle.value=false
  handleSearch()
}
const tableData=ref([])

const handleSearch=async(FormData)=>{
  const params={
    ...pagination,
    ...FormData,
  }
  const {records,total}=await articlePage(params)
  tableData.value=records
  pagination.total=total
  // console.log(records);
  

}
</script>