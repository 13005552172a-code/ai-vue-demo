<template>
  <div class="frontend-layout">
    <div class="navbar-container">
      <div class="brand-section">
        <el-image style="width: 50px;height: 50px;" :src="robot" alt="品牌logo" class="brand-logo"/>
        <h1 class="brand-name">心理健康AI助手</h1>
      </div>
      <div class="nav-section">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link v-if="isLogin" to="/consulation" class="nav-link">AI咨询</router-link>
        <router-link v-if="isLogin" to="/emotionDiarys" class="nav-link">情绪日记</router-link>
        <router-link  to="/frontendknowledge" class="nav-link">知识库</router-link>
        <el-button @click="handleLogout" v-if="isLogin" class="logout-btn">退出登录</el-button>
        <template v-else>
        <router-link  class="nav-link" to="/auth/login">登录</router-link>
        <router-link  class="nav-link" to="/auth/register">
          <el-button type="primary">注册</el-button>
        </router-link>
        </template>
      </div>
    </div>
    <div class="main-container">
      <router-view></router-view>
    </div>
    <div class="footer-container">
      <div class="footer-bottom">
        <p>© 2026 心理健康AI助手, All Rights Reserved.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import robot from '../assets/机器人.png'
import { onMounted, ref } from 'vue';
import { logout } from '../api/admin';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
const router = useRouter()
const isLogin=ref(false)
onMounted(()=>{
  isLogin.value=localStorage.getItem('token')!==null
})

const handleLogout = () => {
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
.frontend-layout {
        background-color: #fff;
        .navbar-container {
            max-width: 1200px;
            height: 100%;
            margin: 0 auto;
            padding: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .brand-section {
                display: flex;
                align-items: center;
                .brand-name {
                    margin-left: 10px;
                    font-size: 24px;
                    font-weight: 600;
                    color: #333;
                }
            }
            .nav-section {
                display: flex;
                align-items: center;
                gap: 40px;
                .nav-link {
                    color: #4b5563;
                    font-size: 16px;
                    font-weight: 500;
                    &:hover {
                        color: #4A90E2;
                    }
                }
            }
        }

        .footer-container {
            background: #1f2937;
            color: white;
            padding: 15px 0;
            margin-top: auto;
            .footer-bottom {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 10px;
                text-align: center;
            }
        }
    }
</style>