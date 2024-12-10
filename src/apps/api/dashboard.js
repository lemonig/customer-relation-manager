
import { _post, _download } from "@App/server/http";
const basePath = 'undefined'
// 销售汇总 
export function saleCount(data) {
  return _post({
    url: `/api/v2/index/saleCount`,
    data
  })
}
// 销售简报 
export function saleSimpleReport(data) {
  return _post({
    url: `/api/v2/index/saleSimpleReport`,
    data
  })
}
// 商机数量漏斗 
export function funnelByDealNum(data) {
  return _post({
    url: `/api/v2/index/funnelByDealNum`,
    data
  })
}
// 商机金额漏斗 
export function funnelByDealValue(data) {
  return _post({
    url: `/api/v2/index/funnelByDealValue`,
    data
  })
}
// 合同签订额图表 
export function chartByContractValue(data) {
  return _post({
    url: `/api/v2/index/chartByContractValue`,
    data
  })
}
// 合同已收金额图表 
export function chartByContractReceivedValue(data) {
  return _post({
    url: `/api/v2/index/chartByContractReceivedValue`,
    data
  })
}
// 任务
export function activityPage(data) {
  return _post({
    url: `/api/v2/jump/activity/page`,
    data
  })
}
// 商机
export function dealPage(data) {
  return _post({
    url: `/api/v2/jump/deal/page`,
    data
  })
}
// 合同 
export function contractPage(data) {
  return _post({
    url: `/api/v2/jump/contract/page`,
    data
  })
}