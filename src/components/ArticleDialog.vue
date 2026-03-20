<template>
  <el-dialog
  title="编辑文章"
  v-model="modelValue"
  width="50%"
  @close="handleClose"
  >
  <el-form >
    <el-form-item :model="formData" :rules="rules"  label="文章标题" prop="title"> 
      <el-input v-model="formData.title" placeholder="请输入文章标题" maxlength="200"  show-word-limit clearable/>
    </el-form-item>
    <el-form-item label="所属分类" prop="categoryId"> 
      <el-select placeholder="请选择分类" v-model="formData.categoryId">
        <el-option v-for="item in props.categoryList" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>
    </el-form-item>
    <el-form-item label="文章摘要" prop="summary"> 
      <el-input v-model="formData.summary" placeholder="请输入文章摘要(可选)" :rows="4" type="textarea" maxlength="1000"  show-word-limit clearable/>
    </el-form-item>
    <el-form-item :model="formData" :rules="rules"  label="标签" prop="tags"> 
      <el-select v-model="formData.tagArray" placeholder="请输入标签" multiple filterable allow-create style="width:100%"  clearable>
        <el-option v-for="item in tagArray" :key="item" :label="item" :value="item"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="封面图片">
      <el-upload
    ref="formData.coverImage"
    class="upload-demo"
    :action="handleSe"
    :before-upload="beforeUpload"
    :http-request="uploadImage"
    accept="image/*"
    >
    <div v-if="!imgUrl" class="cover-placeholder">
      <p>请上传封面图片</p>
    </div>
    <img v-else :src="imgUrl" alt="封面图片" class="cover-img">
  </el-upload>
    </el-form-item>

  </el-form>
  </el-dialog>
</template>

<script setup>
import {ref,reactive,computed} from 'vue'
import { ElMessage } from 'element-plus'
const imgUrl=ref('')
// 上传前的校验
const beforeUpload=(file)=>{
  // 是否为图片
 const isImage=file.type.startsWith('image/')
 //是否大小合格
 const ist5M=file.size/1024/1024<5
 if(!isImage){
  ElMessage.error(`上传封面图片,请选择图片文件`)
  return false
 }
 if(!ist5M){
  ElMessage.error(`上传封面图片,请选择小于5M的图片`)
  return false
 }
  return isImage
}
// 接口逻辑
const uploadImage=()=>{}




const props=defineProps({
  modelValue:{
    type:Boolean,
    default:false
  },
  categoryList:{
    type:Array,
    default:[]
  }
})
// 解决父子通信中的props传值问题
const emit=defineEmits(['update:modelValue'])
const modelValue=computed({
  // 可读的属性
  get(){
    return props.modelValue
  },
  // 可写的属性(修改)
  set(val){
    emit('update:modelValue',val)
  }
})

const handleClose = () => {}

// 表单数据
const formData=reactive({
    "title": "",
    "content": "",
    "coverImage": "",
    "categoryId": "",
    "summary": "",
    "tags": "",
    "id": ""
})

const rules=reactive({
  title:[{required:true,message:'请输入文章标题',trigger:'blur'},{max:200,message:'文章标题不能超过200个字符',trigger:'blur'}],
  categoryId:[{required:true,message:'请选择分类',trigger:'change'}],
  summary:[{max:1000,message:'文章摘要不能超过1000个字符',trigger:'blur'}],
  tags:[{type:'array',message:'请选择标签',trigger:'change'}]
})
// 标签
const tagArray=[//// multiple：多选；filterable：快速筛选标签；allow-create：手动输入新标签;clearable：一键清空
  '情绪管理','焦虑','压力','忧郁',
  '睡眠','冥想','正念','放松','心理健康','自我成长','人际关系','工作压力','学习方法',
  '生活技巧'
]

</script>

<style lang="scss" scoped>
.cover-placeholder{
  width: 200px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color:#8b949e;
  background: #f6f8fa;
}
</style>