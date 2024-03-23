import axios from 'axios'
import { useUserStore } from '@/stores/user.js'

const baseURL = 'http://big-event-vue-api-t.itheima.net'

const instance = axios.create({
  // 基础地址，超时时间
  baseURL,
  timeout: 10000
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 携带token
    const UserStore = useUserStore()
    if (UserStore.token) {
      config.headers.Authorization = UserStore.token
    }

    return config
  },
  (err) => Promise.reject(err)
)

import { ElMessage } from 'element-plus'
import router from '@/router'
// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    // 处理业务失败
    // 摘取核心响应数据
    if (res.data.code === 0) {
      return res
    }
    // 业务失败，给错误提示，抛出错误
    ElMessage.error(res.data.message || '服务异常')
    return Promise.reject(res.data)
  },
  (err) => {
    // 处理401错误
    // 错误的特殊情况 =》 401 权限不足 或 token过期 =》 拦截到登陆
    if (err.response?.state === 401) {
      router.push('/login')
    }

    // 错误的默认情况 =》 只要给提示
    ElMessage.error(err.response.data.message || '服务异常')
    return Promise.reject(err)
  }
)

export default instance
