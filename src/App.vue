<template>
  <div class="app">
    <router-view></router-view>
  </div>
</template>

<script setup>

const arr=[1,2,3]
const obj={name:"ggg",age:18}
console.log(Object.prototype.toString.call(arr))
console.log(Object.prototype.toString.call(obj))

console.log(Object.prototype.toString)
</script>

<style scoped>
</style>