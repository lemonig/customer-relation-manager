// 商机
import { _post, _download } from "@App/server/http";
// 商机活动获取
export function Deallist(data) {
  return _post({
    url: `/api/deal/activity/list`,
    data,
  });
}
// 商机编号自动获取
export function dealCodeGet(data) {
  return _post({
    url: `/api/deal/code/get`,
    data,
  });
}
// 商机单个获取
export function dealSingleGet(data) {
  return _post({
    url: `/api/deal/get`,
    data,
  });
}
// 商机分页查询
export function dealPage(data) {
  return _post({
    url: `/api/deal/page`,
    data,
  });
}
// 商机添加
export function dealAdd(data) {
  return _post({
    url: `/api/deal/add`,
    data,
  });
}
// 商机更新
export function dealUpdate(data) {
  return _post({
    url: `/api/deal/update`,
    data,
  });
}
