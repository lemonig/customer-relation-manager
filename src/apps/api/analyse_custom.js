
import { _post, _download } from "@App/server/http";
const basePath = 'undefined'
// 根据客户获取活动列表 
export function activity(data) {
  return _post({
    url: `/api/analysis/org/activity`,
    data
  })
}


// 按客户统计费用列表  
export function countByOrg(data) {
  return _post({
    url: `/api/analysis/countByOrg`,
    data
  })
}