// 图片等静态资源统一走同源 /media 前缀，由 nginx 反向代理到后端，
// 避免 HTTPS 外网访问时的混合内容拦截
export const baseURL = '/media'
