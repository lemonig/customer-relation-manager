import { _post, _download } from "@App/server/http";
// 商机分页查询
export function dealPage(data) {
  return _post({
    url: `/api/deal/page`,
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
// 商机活动获取
export function dealList(data) {
  return _post({
    url: `/api/deal/activity/list`,
    data,
  });
}
// 商机添加
export function dealadd(data) {
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
// 商机编号自动获取
export function dealCodeGet(data) {
  return _post({
    url: `/api/deal/code/get`,
    data,
  });
}
// 商机漏斗
export function dealChart(data) {
  return _post({
    url: `/api/deal/chart`,
    data,
  });
}
// 商机导出
export function dealExport(data, title) {
  return _download({
    url: `/api/deal/export`,
    data,
    title,
  });
}

// 终止
export function dealterminate(data) {
  return _post({
    url: `/api/deal/action/terminate`,
    data,
  });
}
// 丢单
export function deallose(data) {
  return _post({
    url: `/api/deal/action/lose`,
    data,
  });
}
// 赢单
export function dealwin(data) {
  return _post({
    url: `/api/deal/action/win`,
    data,
  });
}
// 转移
export function dealtransfer(data) {
  return _post({
    url: `/api/deal/action/transfer`,
    data,
  });
}
// 批准完成
export function approveOperate(data) {
  return _post({
    url: `/api/deal/approve/operate`,
    data,
  });
}

// 审批分页获取
export function approvalPage(data) {
  return _post({
    url: `/api/deal/approve/page`,
    data,
  });
}
// 审批导出
export function approvalexport(data, title) {
  return _download({
    url: `/api/deal/approve/export`,
    data,
    title,
  });
}
// 审批漏斗
export function dealFunnel(data, title) {
  return _post({
    url: `/api/deal/funnel`,
    data,
  });
}

// 变更日志
export function dealLogs(data) {
  return _post({
    url: `/api/deal/history/page`,
    data,
  });
}
// 时间线
export function dealTimeline(data) {
  return _post({
    url: `/api/deal/timeline`,
    data,
  });
}
// 重开
export function dealReopen(data) {
  return _post({
    url: `/api/deal/action/reopen`,
    data,
  });
}
// 变化商机
export function changeDealList(data) {
  return _post({
    url: `/api/analysis/changeDeal`,
    data,
  });
}
// c产品
export function productList(data) {
  return _post({
    url: `/api/product/list`,
    data,
  });
}


// 商机-联系人记录 
export function personPage(data) {
  return _post({
    url: `/api/deal/person/page`,
    data
  })
}

// 商机-活动获取 
export function activitypage(data) {
  return _post({
    url: `/api/deal/activity/page`,
    data
  })
}

// 商机-产品记录 
export function productpage(data) {
  return _post({
    url: `/api/deal/product/page`,
    data
  })
}



// 商机-合同
export function contractpage(data) {
  return _post({
    url: `/api/deal/contract/page`,
    data
  })
}
// 商机-招标代理记录
export function biddingAgencypage(data) {
  return _post({
    url: `/api/deal/biddingAgency/page`,
    data
  })
}
// 商机-合作伙伴记录
export function partnerpage(data) {
  return _post({
    url: `/api/deal/partner/page`,
    data
  })
}
// 商机-竞争对手记录
export function competitorpage(data) {
  return _post({
    url: `/api/deal/competitor/page`,
    data
  })
}
// 商机-冲突
export function countConflictDealDeal(data) {
  return _post({
    url: `/api/analysis/countConflictDeal`,
    data
  })
}