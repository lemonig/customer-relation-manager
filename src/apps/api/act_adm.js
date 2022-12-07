import { _post, _download } from "@App/server/http";
const basePath = "undefined";
// 活动删除
export function actDelete(data) {
  return _post({
    url: `/api/activity/delete`,
    method: "post",
    data,
  });
}
// 活动计划导出
export function actExport(data, title) {
  return _download({
    url: `/api/activity/export`,
    data,
    title,
  });
}
// 活动创建
export function actAdd(data) {
  return _post({
    url: `/api/activity/add`,
    data,
  });
}
// 活动修改
export function actUpdate(data) {
  return _post({
    url: `/api/activity/update`,
    data,
  });
}
// 活动分页查询
export function actPage(data) {
  return _post({
    url: `/api/activity/page`,
    data,
  });
}
