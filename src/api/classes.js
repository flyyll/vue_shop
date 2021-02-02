import request from '@/utils/request';
// 添加班级接口
export function addClass(data) {
  return request({
    method: 'post',
    url: "/classes",
    data,
  })
}
// 判断字段值是否存在   需要传递两个值过来
export function ClassExist(field, value) {
  return request({
    method: 'get',
    url: '/classes/exist',
    params: {
      field,
      value,
    },
  })
}
// 获取班级接口
export function getClass(data) {
  return request({
    method: 'get',
    url: '/classes',
    params: data,
  })
}


// 根据ID获取单个班级信息接口
export function getClassID(id) {
  return request({
    method: 'get',
    url: `/classes/${id}`,
  })
};
// 保存班级时的接口

export function editClassID(id, data) {
  return request({
    method: 'put',
    url: `/classes/${id}`,
    data,
  })
};

export function delClassID(id) {
  return request({
    method: 'delete',
    url: `/classes/${id}`,
  })
};