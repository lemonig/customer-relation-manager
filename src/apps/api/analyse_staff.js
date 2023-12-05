
import { _post, _download } from "@App/server/http";
const basePath = 'undefined'


// 按人员统计费用列表 
export function countByPerson(data) {
  return _post({
    url: `/api/analysis/countByPerson`,
    data
  })
}

// 人员日历 
export function calender(data) {
  return _post({
    url: `/api/analysis/person/calender`,
    data
  })
}
// 我的销售 
export function saleDashboard(data) {
  return _post({
    url: `/api/analysis/person/saleDashboard`,
    data
  })
}
// 商机赢单 
export function winDeal(data) {
  return _post({
    url: `/api/analysis/person/winDeal`,
    data
  })
}
// 商机停滞 
export function unWinDeal(data) {
  return _post({
    url: `/api/analysis/person/unWinDeal`,
    data
  })
}
// 商机推进 
export function advanceDeal(data) {
  return _post({
    url: `/api/analysis/person/advanceDeal`,
    data
  })
}
// 商机无变化 
export function noChangeDeal(data) {
  return _post({
    url: `/api/analysis/person/noChangeDeal`,
    data
  })
}
// 费用对商机贡献 
export function activityFeeContribution(data) {
  return _post({
    url: `/api/analysis/person/activityFeeContribution`,
    data
  })
}
// 商机概览 
export function dealOverview(data) {
  return _post({
    url: `/api/analysis/person/dealOverview`,
    data
  })
}
// 活动概览 
export function activityOverview(data) {
  return _post({
    url: `/api/analysis/person/activityOverview`,
    data
  })
}
// 合同概览 
export function contractOverview(data) {
  return _post({
    url: `/api/analysis/person/contractOverview`,
    data
  })
}
// 费用概览 
export function feeOverview(data) {
  return _post({
    url: `/api/analysis/person/feeOverview`,
    data
  })
}
// 合同直方图概览 
export function contractLineOverview(data) {
  return _post({
    url: `/api/analysis/person/contractLineOverview`,
    data
  })
}
// 合同饼图概览 
export function contractPieOverview(data) {
  return _post({
    url: `/api/analysis/person/contractPieOverview`,
    data
  })
}
// 费用直方图概览 
export function feeLineOverview(data) {
  return _post({
    url: `/api/analysis/person/feeLineOverview`,
    data
  })
}
// 费用饼图概览 
export function feePieOverview(data) {
  return _post({
    url: `/api/analysis/person/feePieOverview`,
    data
  })
}
// 费用饼图概览 
export function userinfo(data) {
  return _post({
    url: `/api/analysis/userinfo`,
    data
  })
}