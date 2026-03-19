<template>
  <div class="page-head">
    <p class="page-title">{{props.title}}</p>
    <div class="action-btn">
      <slot name="buttons"/> 
    </div>
  </div>
</template>
<script setup>
const props=defineProps({
  title: {
    type: String,
    default:'页面标题'//默认标题
  }
})
</script>

<style lang="scss" scoped>
.page-head{
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  justify-content: space-between;
  .page-title{
    font-size:24px;
    color: #2d3748;
  }
}  
</style>