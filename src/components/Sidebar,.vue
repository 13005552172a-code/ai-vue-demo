<template>
  <el-aside :width="iscollects?'64px':'264px'">
    <!-- 不需要有过渡效果:collapse-transition="false"  -->
    <el-menu
        default-active="2"
        class="menu-style"
         :collapse="iscollects"
         :collapse-transition="false"
      >
      <!-- 图形 -->
      <div class="brand">
        <el-image style="margin-right: 10px; width: 50px; height: 50px;" :src=logoImg alt="logo"/>
        <!-- 当需要折叠，则消失 -->
        <div v-show="!iscollects" class="info-card">
          <h1 class="brand-title">心理健康ai助手</h1>
          <p class="brand-subtitle">管理后台</p>
        </div>
      </div>
      <!-- 切换 -->
        <el-menu-item @click="selectmenu" v-for="item in router.options.routes[1].children" :key="item.path" :index="item.path">
          <el-icon><component :is="item.meta.icon" /></el-icon>
          <span>{{item.meta.title}}</span>
        </el-menu-item>
      </el-menu>
  </el-aside>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAdminStore } from '../stores/admin';
import logoImg from '../assets/机器人.png'
const router= useRouter();

const iscollects=computed(()=>useAdminStore().iscollect)

const selectmenu=(key)=>{
  router.push('/back/'+key.index);
}

</script>

<style lang="scss" scoped>
.menu-style{
  height: 100%;
  .brand{
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background-color: #fff;
  border-bottom: 1px solid #e5e7eb;
  .brand-title{
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 5px;
    color: #1f2937;
  }
  .brand-subtitle{
    font-size: 14px;
    color: #6b7280;
  }
}
}


</style>