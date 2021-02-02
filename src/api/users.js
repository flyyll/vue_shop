import request from '@/utils/request';
export function login(data) {
  return request({
    method: 'post',
    url: '/users/login',
    data,
  })
}
export function AddUser(data) {
  return request({
    method: 'post',
    url: '/users',
    data,
  })
}
// 判断字段值是否存在   需要传递两个值过来
export function exist(field, value) {
  return request({
    method: 'get',
    url: '/users/exist',
    params: {
      field,
      value,
    },
  })
}
export function addUsers(data) {
  return request({
    method: 'get',
    url: '/users',
    params: data,

  })
}
export function EditUsers(id) {
  return request({
    method: 'get',
    url: `/users/${id}`,
  })
}
export function updateUsersId(id, data) {
  return request({
    method: 'put',
    url: `/users/${id}`,
    data,
  })
}
export function deleteUsersId(id) {
  return request({
    method: 'delete',
    url: `/users/${id}`,
  })
}
