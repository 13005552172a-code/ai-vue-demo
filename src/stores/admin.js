import { defineStore } from 'pinia'
import {ref} from 'vue'
// 折叠效果
export const useAdminStore = defineStore('admin',()=> {
  const iscollect=ref(false)
  const toggleCollect=()=>{
    iscollect.value=!iscollect.value
  }
  return{
    iscollect,
    toggleCollect
  }
})







