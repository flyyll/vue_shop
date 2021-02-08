import request from '@/utils/request';
// 获取用户
export function getGoodsList(data) {
  return request({
    method: 'get',
    url: '/categories',
    params:data,
  })
};
// 添加分类
export function addCateList(data) {
  return request({
    method: 'post',
    url: '/categories',
    data,
  })
};
// 商品分类数据列表
export function getParentCateList(data) {
  return request({
    method: 'get',
    url: '/categories',
    params:data,
  })
};

//  根据 id 查询分类数据
export function editCateById(id) {
  return request({
    method: 'get',
    url: `categories/${id}`,
  })
};

//  根据 id 编辑提交分类
export function SubmitCateById(id,data) {
  return request({
    method: 'put',
    url: `categories/${id}`,
    data,
  })
};
//  根据 id 编辑删除分类
export function deleteCateById(id) {
  return request({
    method: 'delete',
    url: `categories/${id}`,
  })
};