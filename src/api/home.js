import request from '@/utils/request';
export function menus(data) {
  return request({
    method: 'get',
    url: '/menus',
    data,
  })
}