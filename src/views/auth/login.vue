<template>
  <div class="container">
    <div class="title">
      <div class="back-home">
        <el-icon><Back/></el-icon>
        <span @click="router.push('/')" style="cursor: pointer;">返回首页</span>
      </div>
      <div class="title-text">
        <h2>登录您的账户</h2>
        <p>请输入您的登录信息</p>
      </div>
    </div>
    <div class="form-container">
      <el-form
      ref="ruleformref"
      :model="formData"
      :rules="rules"
      label-position="top"
      >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formData.username" size="large" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="formData.password" size="large" placeholder="请输入密码" show-password></el-input>
      </el-form-item>
      <el-button class="btn" type="primary" @click="handleLogin(ruleformref)">登录</el-button>
      </el-form>
      <div class="footer">
        <p>没有账号?<router-link to="/auth/register">立即注册</router-link></p>
      </div>
      
    </div>
  </div>
</template>

<script setup> 

import { ref, } from 'vue'

import { login } from '../../api/admin'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
const router=useRouter()

const formData = ref({
  username:'',
  password:''
})

const rules =ref({
  username: [{ message: '请输入用户名', trigger: 'blur',required: true, }],
  password: [{ message:'请输入密码', trigger: 'blur',required: true, }],
  
})
// 登录
const ruleformref=ref()
const handleLogin=async(formEL)=>{
  if(!formEL) return
  await formEL.validate((valid, errors)=>{
    if(valid){
     login(formData.value).then(res=>{
      if(!res.token){
        return console.error('登录失败');
      }
      localStorage.setItem('token',res.token)
      localStorage.setItem('userInfo',JSON.stringify(res.userInfo))//缓存只能以字符串的形式存储
      // 根据用户角色判断跳转页面
    if(res.userInfo.userType===2){
      ElMessage.success(`登录成功`)
      router.push(`/back/dashboards`)
    }
    else{
      ElMessage.success(`登录成功`)
      router.push(`/`)
    }
     })
    
    }
  })
}

</script>


<style lang="scss" scoped>
.container{
  width: 384px;
  .title{
    .back-home{
      margin-bottom: 60px;
    }
    .title-text{
      text-align: center;
      h2{
        font-size:36px;
        margin-bottom: 10px;
      }
      p{
        font-size:18px;
        color: #6b7280;
        
      }
    }
  }
  .form-container{
    .btn{
        margin-top: 40px;
        width: 100%;
      }
    .footer{
      margin-top: 20px;
      text-align: center;
    }
  }
}
</style>