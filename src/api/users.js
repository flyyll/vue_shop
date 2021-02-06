import request from '@/utils/request';
// 获取用户
export function getUsers(data) {
  return request({
    method: 'get',
    url: '/users',
    params: data
  })
};
// 修改用户的状态
export function modifyUsersState(id, type) {
  return request({
    method: 'put',
    url: `/users/${id}/state/${type}`,
  })
};

// 添加用户
export function addUsers(data) {
  return request({
    method: 'post',
    url: "users",
    data,
  })
};

// 根据id编辑用户信息
export function editUsers(id) {
  return request({
    method: 'get',
    url: `users/${id}`,
  })
};

// 根据id编辑用户提交
export function submitUsers(id, data) {
  return request({
    method: 'put',
    url: `users/${id}`,
    data,
  })
};
// 根据id删除用户
export function deleteUsers(id) {
  return request({
    method: 'delete',
    url: `users/${id}`,

  })
};

// 获取分配时的角色列表
export function addRoles() {
  return request({
    method: 'get',
    url: "roles"
  })
};
// 分配用户角色
export function distributionRoles(id, data) {
  return request({
    method: 'put',
    url: `users/${id}/role`,
    data
  })
};