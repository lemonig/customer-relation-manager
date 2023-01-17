import { _post } from "@App/server/http";
// 用户
export function userInfo(data) {
  return _post({
    url: `/api/user/owner`,
    data,
  });
}
// 菜单
export function menuInfo(data) {
  return _post({
    url: `/api/user/menu/list`,
    data,
  });
}
