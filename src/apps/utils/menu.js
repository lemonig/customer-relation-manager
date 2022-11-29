import menuData from "./menuData";

import { arrayToTree } from "./util";

export function handleMenu() {
  let copy = JSON.parse(JSON.stringify(menuData));
  return arrayToTree(copy);
}

export function handleRouter() {
  let copy = JSON.parse(JSON.stringify(menuData));
  return copy.filter((item) => !!item.path);
}
