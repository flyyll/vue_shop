import request from '@/utils/request';

export function addOutlines(data) {
  return request({
    method: 'post',
    url: "/outlines",
    data,
  })
}


// 判断字段值是否存在   需要传递两个值过来
export function exist(field, value) {
  return request({
    method: 'get',
    url: '/outlines/exist',
    // 通过字符串query 查询 需要使用
    params: {
      field, // 因为传递过来的值和我定义值一样可简写
      value,
    },
  })
};
// 获取大纲的接口  做页面显示
export function getOutlines() {
  return request({
    method: 'get',
    url: '/outlines',

  })
};
// 大纲删除的接口
export function delOutlines(id) {
  return request({
    method: 'delete',
    url: `/outlines/${id}`,

  })
};
// 大纲排序的接口 
// firstId表示: 自己的id  secondId: 表示上一个下一个的id
export function SortOutlines(firstId, secondId) {
  return request({
    method: 'put',
    url: `/outlines/sort/${firstId}/${secondId}`,
  })
};

// 编辑大纲的接口 
export function EditOutlines(id) {
  return request({
    method: 'get',
    url: `/outlines/${id}`,
  })
};
// 更新大纲的接口 
export function UpdateOutlines(id, data) {
  return request({
    method: 'put',
    url: `/outlines/${id}`,
    data,
  })
};