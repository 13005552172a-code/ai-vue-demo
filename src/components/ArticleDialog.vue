<template>
  <el-dialog
  :title="isEdie? '编辑文章': '新建文章'"
  v-model="modelValue"
  width="50%"
  @close="handleClose"
  >
  <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" >
    <el-form-item   label="文章标题" prop="title"> 
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
    class="upload-demo"
    action="#"
    :before-upload="beforeUpload"
    :show-file-list="false"
    :http-request="uploadImage"
    accept="image/*"
    >
    <div v-if="!imgUrl" class="cover-placeholder">
      <p>请上传封面图片</p>
    </div>
    <img v-else :src="imgUrl" alt="封面图片" class="cover-img">
  </el-upload>
  <div v-if="imgUrl">
      <el-button size="small"  type="danger" @click="removeUrl">移除封面</el-button>
  </div>
    </el-form-item>
    <el-form-item label="文章内容" prop="content">
      <RichTextEditor 
      v-model="formData.content"
      placeholder="请输入文章内容"
      :max-char-count="5000"
      @Created="handleEditorCreated"
      @Change="handleEditorChange"
      />
    </el-form-item>
  </el-form>
  <div v-if="btnRef">
    <h3>内容预览</h3>
    <div v-html="formData.content"></div>
  </div>
  <template #footer>
    <el-button @click="btnRef=!btnRef" >{{ btnRef? '隐藏预览' : '显示预览' }}</el-button>
    <el-button @click="handleClose">取消</el-button>
    <el-button @click="handleSubmit" :loading="loading" type="primary" >{{isEdie? '编辑文章': '新建文章'}}</el-button>
  </template>
  </el-dialog>
</template>

<script setup>
import {ref,reactive,computed,nextTick,watch} from 'vue'
import { ElMessage } from 'element-plus'
import { uploadFile,createArticle,updateArticle} from '../api/admin'
import { baseURL } from '../config'
import RichTextEditor from './RichTextEditor.vue'
//预览效果
const btnRef=ref(false)
// 提交
const formRef=ref()
const loading=ref(false)
const handleSubmit=()=>{
  formRef.value.validate((valid,fields)=>{
    if(valid){
      loading.value=true
      const submitData={
        ...formData,
        tags:formData.tagArray.join(',')
      }
      delete submitData.tagArray
      if(!isEdie.value){
        // 新增
        createArticle(submitData).then(res=>{
        loading.value=false
        emit('success')   
        ElMessage.success('文章创建成功')
        formRef.value.resetFields()
        modelValue.value=false
      })
      }else{
        // 编辑
        updateArticle(props.editFormData.id,submitData).then(res=>{
          loading.value=false
          emit('success')   
          ElMessage.success('文章编辑成功')
        })
      }
      
      
    }
  })
}

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
const uploadImage=async({file})=>{
  const businessId=crypto.randomUUID()
  const fileRes=await uploadFile(file,{
    businessId:businessId
  })
  // 图片显示在dialog里面
imgUrl.value=`${baseURL}${fileRes.filePath}`
// 存储在数据里面
formData.coverImage=fileRes.filePath
}

// 移除封面
const removeUrl=()=>{
  imgUrl.value=''
  formData.coverImage=''
}
// 取消按钮
const handleClose=()=>{
  formRef.value.resetFields()
  businessId.value=null
  formData.tagArray=[]
  removeUrl()
  emit('update:modelValue',false)
}

// 富文本
const handleEditorChange=(data)=>{
formData.content=data.text
console.log(formData);
}
// 
const editorInstance=ref(null) // 富文本编辑器实例
const handleEditorCreated = (editor) => {
  editorInstance.value = editor // 先保存编辑器实例
  // 编辑场景：有内容需要回填
  if (formData.content && editor) {
    // 延迟到下一次 DOM 更新后执行
    nextTick(() => {
      editor.setHtml(formData.content) // 安全地回填 HTML 内容
    })
  }
}

const props=defineProps({
  modelValue:{
    type:Boolean,
    default:false
  },
  categoryList:{
    type:Array,
    default:[]
  },
  editFormData:{
    type:Object,
    default:null
  }
})

// 判断是新增还是标题
const isEdie=computed(()=>!!props.editFormData)

const businessId=ref(null)
// 监听编辑数据
watch(()=>props.editFormData,(newVal)=>{
  nextTick(()=>{
    if(newVal){
    // 回填数据
    Object.assign(formData,newVal)
    // 使用id
    businessId.value=newVal.id
    imgUrl.value=baseURL+newVal.coverImage
  }
  })
  
})


// 解决父子通信中的props传值问题
const emit=defineEmits(['update:modelValue','success'])
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

// 表单数据
const formData=reactive({
    "title": "",
    "content": "",
    "coverImage": "",
    "categoryId": "",
    "summary": "",
    "tags": "",
    "id": "",
     "tagArray": []
})

const rules=reactive({
  title:[{required:true,message:'请输入文章标题',trigger:'blur'},
  {max:200,message:'文章标题不能超过200个字符',trigger:'blur'}],
  categoryId:[{required:true,message:'请选择分类',trigger:'change'}],
  content:[{required:true,message:'请输入文章内容',trigger:'blur'},
  {max:5000,message:'文章内容不能超过5000个字符',trigger:'blur'}],
})
// 标签
const tagArray=[
  //// multiple：多选；filterable：快速筛选标签；allow-create：手动输入新标签;clearable：一键清空
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
.cover-img{
  width: 200px; 
  height: 120px;
  display: block;
}
</style>