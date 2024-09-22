import request from '@/utils/request'
// 定义基本的url
const BASE_URL = '/admin/system/sysUser'

export default {
  // 列表
  getUserPageInfo(page, limit, searchObj) {
    return request({
      url: `${BASE_URL}/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },

  // 删除
  removeUserById(id) {
    return request({
      //  url: '/admin/system/user/'+page+"/"+limit,
      url: `${BASE_URL}/removeUserById/${id}`,
      method: 'delete'
    })
  },

  saveUser(user) {
    return request({
      url: `${BASE_URL}/addUser`,
      method: 'post', // 提交方式为 post
      data: user // 传递json 数据
    })
  },
  // 根据id 去获取一个角色
  getUserById(id) {
    return request({
      url: `${BASE_URL}/findUserById/${id}`,
      method: 'get' // 提交方式
    })
  },

  updateUser(user) {
    return request({
      url: `${BASE_URL}/updateUser`,
      method: 'post', // 提交方式为 post
      data: user
    })
  },
  // 批量 删除
  bactchremoveId(ids) {
    return request({
      url: `${BASE_URL}/removeBatchUserByIds`,
      method: 'delete', // 提交方式
      data: ids // 传递的json格式
    })
  },

  //修改状态
  updateStatus(id, status) {
    return request({
      url: `${BASE_URL}/updateStatus/${id}/${status}`,
      method: 'get'
    })
  },
}
