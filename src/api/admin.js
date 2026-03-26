import service from '../utils/request'

export function login(data){
  return service.post('/user/login',data)
}

// 知识文章页面
export function categoryTree(){
  return service.get(`/knowledge/category/tree`)
}

export function articlePage(params){
  return service.get(`/knowledge/article/page`,{params})
}
//有点复杂
export function uploadFile(file,businInfo){
  const formData = new FormData()
  formData.append('file', file)
  formData.append('businessType','ARTICLE')
  formData.append('businessId',businInfo.businessId)
  formData.append('businessField','cover')
  return service.post('/file/upload',formData,{
    headers:{
      'Content-Type':'multipart/form-data'
    }
  })
}

export function createArticle(data){
  return service.post('/knowledge/article',data)
}
// 更新知识文章
export function knowledgeArticle(id){
  return service.get(`/knowledge/article/${id}`)
}
// 新增
export function updateArticle(id,data){
  return service.put(`/knowledge/article/${id}`,data)
}

export function changeArticle(id,data){
  return service.put(`/knowledge/article/${id}/status`,data)
}

export function deleteArticle(id){
  return service.delete(`/knowledge/article/${id}`)
}

// 咨询页面
export function psychologicalSessions(params){
  return service.get(`/psychological-chat/sessions`,{params})
}

export function psychologicalchat(sessionId){
  return service.get(`/psychological-chat/sessions/${sessionId}/messages`)
}

// 情绪页面
export function emotionDiary(params){
  return service.get(`/emotion-diary/admin/page`,{params})
}
export function deleteEmotion(id){
  return service.delete(`/emotion-diary/admin/${id}`)
}

// 可视化页面
export function visualPage(){
  return service.get(`/data-analytics/overview`)
}
// 退出登录
export function logout(){
  return service.post('/user/logout')
}