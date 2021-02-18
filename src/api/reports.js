import request from '@/utils/request';
// 获取   基于时间统计的折线图
export function getReportsData() {
  return request({
    method: 'get',
    url: 'reports/type/1',

  })
};
