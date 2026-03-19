<template>
  <div class="common-layout">
    <el-container class="main-container">
      <Sidebar/>
      <el-container>
        <el-header>
          <NavBar/>
        </el-header>
        <el-main class="main-content">
          <router-view class="content-container"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Sidebar from './Sidebar,.vue';
import NavBar from './NavBar.vue';
</script>

<style lang="scss" scoped>
.common-layout {
  height: 100vh;
  .el-header{
    height: 74px !important;
  }  
  .main-container {
    height: 100%;
    .content-container{
      padding: 20px;
      min-height: calc(100% - 74px);
      background-color: #fff;
    }
  }

}
</style>