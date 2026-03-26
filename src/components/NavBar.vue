<template>
  <div class="navbar">
    <div class="flex-box">
      <el-button @click="handlecollect" >
        <el-icon ><Operation /></el-icon>
      </el-button>
       <p class="page-title">{{route.meta.title}}</p>
    </div>

    <div class="flex-box">
      <!-- 头像 -->
      <el-avatar style="width: 30px;height: 30px;" :src=imgUrl  alt="头像"/>
    <el-dropdown>
    <span class="el-dropdown-link">
      admin
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="handleback">退出登录</el-dropdown-item>

      </el-dropdown-menu>
    </template>
  </el-dropdown>
    </div>

  </div>
</template>

<script setup>
import { ArrowDown } from '@element-plus/icons-vue'
import {useAdminStore} from '../stores/admin'
import { useRouter,useRoute } from 'vue-router'
import { ElMessageBox,ElMessage } from 'element-plus'
import { logout } from '../api/admin'
const router=useRouter()
const route=useRoute()

const imgUrl=new URL('../assets/users.png',import.meta.url).href

const handlecollect=()=>{
  useAdminStore().toggleCollect()
}
const handleback = () => {
  ElMessageBox.confirm(
    `确定退出登录吗`,
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(()=>{
    logout().then(res=>{
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      router.push('/auth/login')
      ElMessage.success('退出成功')
    })
  })
  
}
</script>

<style lang="scss" scoped> 
.navbar{
  height: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
  justify-content: space-between;
  padding: 0 15px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,0.08);
  .flex-box{
  display: flex;
  align-items: center;
  justify-content: center;
  .page-title{
    margin-left: 20px;
    font-size: 26px;
    font-weight: bold;
    color: #1f2937;
  }
}
}

</style>