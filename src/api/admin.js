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

// 注册接口
export function register(data){
  return service.post(`/user/add`,data)
}

// 用户之ai助手
// 创建新的会话接口
export function createstartSession(data){
  return service.post(`/psychological-chat/session/start`,data)
}

// 分页查询咨询会话
export function  getSessionList(params){
  return service.get('/psychological-chat/sessions',{params})
}
// 删除咨询会话
export function deleteSession(sessionId){
  return service.delete(`/psychological-chat/sessions/${sessionId}`)
}
// 获取会话消息列表
export function getMessageList(sessionId){
  return service.get(`/psychological-chat/sessions/${sessionId}/messages`)
}
// 流式对话
export function streamMessage(data){
  return service.post(`/api/psychological-chat/stream`,data)
}
// 获取会话情绪分析结果
export function getEmotionResult(sessionId){
  return service.get(`/psychological-chat/session/${sessionId}/emotion`)
}

// 情绪页面
// 创建或更新情绪日记
export function createorUpdateemotionDiary(data){
  return service.post(`/emotion-diary`,data)
}

// 知识管理页面
export function knowledgeList(params){
  return service.get('/knowledge/article/page',{params })
}

// 知识文章详情
export function knowledgeDetail(id){
  return service.get(`/knowledge/article/${id}`)
}