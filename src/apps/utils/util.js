import React from "react";
import IconFont from "@Components/IconFont";

// 数组转树
export function arrayToTree(items) {
  const result = []; // 存放结果集
  const itemMap = {}; //
  for (const item of items) {
    const id = item.id;
    const pid = item.pid;
    if (item.icon && typeof item.icon === "string") {
      item.icon = <IconFont iconName={item.icon}></IconFont>;
    }
    if (!itemMap[id] && !item.isleaf) {
      itemMap[id] = {
        children: [],
      };
    }

    // itemMap[id] = {
    //   ...item,
    //   children: itemMap[id]["children"],
    // };
    if (!item.isleaf) {
      itemMap[id] = {
        ...item,
        children: itemMap[id]["children"],
      };
    } else {
      itemMap[id] = item;
    }

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
  return result;
}
