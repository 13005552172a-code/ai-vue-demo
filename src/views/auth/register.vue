<template>
  <div class="container">
    <div class="title">
      <div class="title-text">
        <h2>创建您的用户</h2>
        <p>请填写注册信息</p>
      </div>
    </div>
    <div class="form-container">
      <el-form
      ref="sumbitFormRef"
      :model="formData"
      :rules="rules"
      label-position="top"
      >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formData.username" size="large" placeholder="请输入用户名或邮箱"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formData.email" size="large" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="formData.nickname" size="large" placeholder="请输入昵称(可选)"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="formData.phone" size="large" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="formData.password" size="large" placeholder="请输入密码" show-password></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input type="Password" v-model="formData.confirmPassword" size="large" placeholder="请再次输入密码" show-password></el-input>
      </el-form-item>
      <el-button class="btn" type="primary" @click="handleregister(sumbitFormRef)">创建用户</el-button>
      </el-form>
      <div class="footer">
        <p>已有账号?<router-link to="/auth/login">立即登录</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {  ref } from 'vue'
import {register} from '../../api/admin'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
const router = useRouter()
const formData = ref({
  username: '',
  email:'',
  nickname:'',
  phone:'',
  password:'',
  confirmPassword:'',
  gender:1,
  userType:1
})

const rules =ref({
  username: [{ message: '请输入用户名', trigger: 'blur',required: true, }],
  email: [{ message: '请输入邮箱', trigger: 'blur', required: true, type: 'email' }],
  phone: [{ message: '请输入手机号', trigger: 'blur', required: true, pattern: /^1[34578]\d{9}$/ }],
  password: [{ message: '请输入密码', trigger: 'blur', required: true, min: 6 }],
  confirmPassword:[{ message: '请输入确认密码', trigger: 'blur', required: true, min: 6,}]
})
// 表单提交
const sumbitFormRef=ref(null)

const handleregister= async(formEl)=>{
  if(!formEl) return
   await formEl.validate((valid) => {
    if(valid){
      register(formData.value).then(res=>{
        ElMessage.success(`注册成功`)
        console.log(res);
        router.push(`/auth/login`)
      })
    }
  })
}
</script>

<style lang="scss" scoped>
  .container {
    width: 384px;
    .flex-box {
        display: flex;
        align-items: center;
    }
    .title {
        .title-text {
            text-align: center;
            h2 {
                font-size: 36px;
                margin-bottom: 10px;
            }
            p {
                font-size: 18px;
                color: #6b7280;
            }
        }
    }
    .form-container {
        margin-top: 30px;
        .btn {
            margin-top: 40px;
            width: 100%;
        }
        .footer {
            padding: 30px;
            text-align: center;
        }
    }
}
</style>