import { _post } from "@App/server/http";
const basePath = "undefined";
// 部门删除
export function configList(data) {
  return _post({
    url: `/api/config/web/list`,
    data,
  });
}
export function configUpdate(data) {
  return _post({
    url: `/api/config/web/update`,
    data,
  });
}