import request from '@/utils/request';
// 获取订单列表数据
export function getOrders(data) {
  return request({
    method: 'get',
    url: '/orders',
    params: data
  })
};
// 获取物流数据
export function getProgressData(id) {
  return request({
    method: 'get',
    url: `/kuaidi/${id}`,
  })
};