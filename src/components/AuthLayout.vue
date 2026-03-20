<template>
  <div class="auth">
    <div class="left-section">
      <div class="content">
        <div class="title">心理AI助手</div>
        <p class="text">每个深夜,每个焦虑的时刻,我们都在这里。<br>不必独自承受,让心与心的连接温暖您的每一天</p>
        <div class="robot">
          <el-image class="img" style="width: 90px ;height: 90px;" :src=imgUrl alt="心理AI助手"/>
        </div>
      </div>
    </div>
    <div class="right-section">
      <router-view></router-view>
    </div>
    
  </div>
</template>

<script setup>
import imgs from '../assets/robot-fill.png'
const imgUrl = imgs

</script>

<style lang="scss" scoped>
.auth{
  display: flex;
  background-color: #fff;
  .left-section{
    display: flex;
    flex-direction: column;
    align-self: center;
    justify-content: center;
    width: 50%;
    flex:1;
    height: 100vh;
    background-color: rgb(5, 151, 105);
    .content{
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center; 
      .title{
        color:#fff;
        font-size: 30px;
        font-weight: bold;
        margin-bottom: 20px;
      }
      .text{
        color:#fff;
        text-align: center;
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 20px;
      }
      .robot{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 160px;
        height: 160px;
        background-color: rgba(255,255,255,0.05);
        text-align: center;
        border: 2px solid rgba(255,255,255,0.2);
        border-radius: 50%;
        box-shadow:0 15px 35px rgba(0,0,0,0.1),inset 0 1px 0rgba(255255255,0.3);
      }
    }
  }
  .right-section{
    display: flex;
    align-self: center;
    width: 100%;
    flex:1;
    justify-content: center;


  }
}
</style>