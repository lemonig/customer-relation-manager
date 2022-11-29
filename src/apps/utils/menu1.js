import menuData from "./menuData";
import React from "react";
import IconFont from "@Components/IconFont";

function arrayToTree(items) {
  const result = []; // 存放结果集
  const itemMap = {}; //
  for (const item of items) {
    const id = item.id;
    const pid = item.pid;
    if (item.icon && typeof item.icon === "string") {
      item.icon = <IconFont iconName={item.icon}></IconFont>;
    }
    if (!itemMap[id] && pid === 0) {
      itemMap[id] = {
        children: [],
      };
    }
    // 子集无children

    // if (pid === 0) {
    //   itemMap[id] = {
    //     ...item,
    //     children: itemMap[id]["children"],
    //   };
    // } else {
    //   itemMap[id] = item;
    // }
    itemMap[id] = {
      ...item,
      children: itemMap[id]["children"],
    };
    const treeItem = itemMap[id];

    if (pid === 0) {
      result.push(treeItem);
    } else {
      if (!itemMap[pid]) {
        itemMap[pid] = {
          children: [],
        };
      }
      itemMap[pid].children.push(treeItem);
    }
  }
  // 除去没有children 的属性
  // result.map((item) => {
  //   if (!item.children.length) {
  //     delete item.children;
  //   }
  // });
  return result;
}

export function handleMenu() {
  let copy = JSON.parse(JSON.stringify(menuData));
  return arrayToTree(copy);
}

export function handleRouter() {
  let copy = JSON.parse(JSON.stringify(menuData));
  return copy.filter((item) => !!item.path);
}
