// 获取文章分类
import request from '@/utils/request.js'
export const artGetChannelsService = () => {
  request.get('/my/cate/list')
}
