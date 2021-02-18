import request from '@/utils/request';
// 获取用户
export function getGoodsList(data) {
  return request({
    method: 'get',
    url: '/categories',
    params: data,
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
    params: data,
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
export function SubmitCateById(id, data) {
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


// Params  组件区数据

//  商品分类总数据列表
export function getGoodsCateList() {
  return request({
    method: 'get',
    url: 'categories',
  })
};

//  参数列表的请求
export function getParameterList(id, data) {
  return request({
    method: 'get',
    url: `categories/${id}/attributes`,
    params: data
  })
};

// 添加动态参数或者静态属性
export function addParamsDataList(id, data) {
  return request({
    method: 'post',
    url: `categories/${id}/attributes`,
    data
  })
};
// 添加动态参数或者静态属性
export function editParamsDataList(id, attrId, data) {
  return request({
    method: 'get',
    url: `categories/${id}/attributes/${attrId}`,
    param: data,

  })
};
// 添加动态参数或者静态属性
export function submitParamsDataList(id, attrId, data) {
  return request({
    method: 'put',
    url: `categories/${id}/attributes/${attrId}`,
    data,


  })
};
// 删除动态参数或者静态属性
export function delParamsDataList(id, attrId) {
  return request({
    method: 'delete',
    url: `categories/${id}/attributes/${attrId}`

  })
};


// 编辑提交el-tag参数
export function SubmitElTagData(id, attrId, data) {
  return request({
    method: 'put',
    url: `categories/${id}/attributes/${attrId}`,
    data

  })
};


// 以下是 list 页面数据

// 获取 list 页面数据
export function getListData(data) {
  return request({
    method: 'get',
    url: 'goods',
    params: data
  })
};

// 根据 ID 删除数据 
export function delListData(id) {
  return request({
    method: 'delete',
    url: `goods/${id}`,

  })
};

// 商品分类数据列表 展示在级联选择器
export function getCascaderData() {
  return request({
    method: 'get',
    url: 'categories',
  })
};
// 商品分类参数列表数据
export function getParameterData(id, data) {
  return request({
    method: 'get',
    url: `categories/${id}/attributes`,
    params: data
  })
};

// 商品最终添加操作
export function addParameterData(data) {
  return request({
    method: 'post',
    url: 'goods',
    data
  })
};