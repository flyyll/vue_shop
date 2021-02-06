import request from '@/utils/request';

// 获取所有权限列表
export function getPower() {
  return request({
    method: 'get',
    url: 'rights/list',
  })
};

// 获取角色列表
export function getRoles() {
  return request({
    method: 'get',
    url: 'roles',
  })
};

// 编辑角色
export function editRoles(id) {
  return request({
    method: 'get',
    url: `roles/${id}`,
  })
};
// 提交编辑好的角色
export function addRoles(id, data) {
  return request({
    method: 'put',
    url: `roles/${id}`,
    data
  })
};
// 删除角色
export function deleteRoles(id, data) {
  return request({
    method: 'delete',
    url: `roles/${id}`,
    data
  })
};
// 根据id删除对应的权限
export function deleteRight(roleId, rightId) {
  return request({
    method: 'delete',
    url: `roles/${roleId}/rights/${rightId}`,
  })
};

// 获取所有列表的去权限
export function getRight() {
  return request({
    method: 'get',
    url: 'rights/tree',
  })
};


// 角色授权
export function roleEmpower(id, data) {
  return request({
    method: 'post',
    url: `roles/${id}/rights`,
    data
  })
};