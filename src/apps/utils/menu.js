import menuData from "./menuData";

import { arrayToTree } from "./util";

// const menuData = JSON.parse(localStorage.getItem("menuList"));
export function handleMenu(data) {
  let copy = JSON.parse(JSON.stringify(data));
  return arrayToTree(copy);
}

export function handleRouter() {
  if (!menuData) return [];
  let copy = JSON.parse(JSON.stringify(menuData));
  return copy.filter((item) => !!item.name);
}
