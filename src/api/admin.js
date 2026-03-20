import service from '../utils/request'

export function login(data){
  return service.post('/user/login',data)
}

export function categoryTree(){
  return service.get(`/knowledge/category/tree`)
}

export function articlePage(params){
  return service.get(`/knowledge/article/page`,{params})
}

export function uploadFile(file,businInfo){
  const formData = new FormData()
  formData.append('file', file)
  formData.append('businessType',ARTICLE)
  formData.append('businessId',businInfo.businessId)
  formData.append('businessField',cover)
  return service.post('/file/upload',formData)
}





